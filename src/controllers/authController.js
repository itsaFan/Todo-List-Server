const { permissionDao, userDao } = require("../dao");
const { isValidPassword } = require("../utils/password-validation");
const { generateResetToken } = require("../middlewares");
const { sendEmail } = require("../config/emailService");
const { getResetPaswEmailContent } = require("../config/emailTemplates");
const cache = require("memory-cache");
const { generateLoginTokens, generateAccessToken } = require("../auth/token-generator");
const { handleFailedAttempt, FAILED_ATTEMPTS_LIMIT } = require("../utils/limit-handlers");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUsername = await userDao.findUserByUsername(username);
    if (existingUsername) {
      return res.status(403).json({ message: "Username already taken" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password needs to be at least 8 characters long and contain both numerical and alphabetical letters.",
      });
    }

    const defaultRole = await permissionDao.findUserRole();
    if (!defaultRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    await userDao.createUser({ username, email, password, role: defaultRole._id });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  const cacheKey = `login-attempts-${identifier}-${password}`;
  try {
    const currentAttempts = cache.get(cacheKey) || 0;

    if (currentAttempts >= FAILED_ATTEMPTS_LIMIT) {
      return res.status(429).json({ message: "You have been locked out because this account has attempted to login too many times. Please try again in 15 minutes." });
    }

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/username & password is required" });
    }

    let user;
    if (identifier.includes("@")) {
      user = await userDao.findUserByEmail(identifier);
    } else {
      user = await userDao.findUserByUsername(identifier);
    }

    if (!user) {
      return handleFailedAttempt(res, cacheKey, "Username or Email not found");
    }

    if (!user.verifyPassword(password)) {
      return handleFailedAttempt(res, cacheKey, "Wrong password");
    }

    cache.del(cacheKey);

    const { accessToken, refreshToken } = generateLoginTokens(user);
    res.cookie("steffToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ accessToken });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

// const login = async (req, res) => {
//   const { identifier, password } = req.body;

//   try {
//     let user;

//     if (!identifier || !password) {
//       return res.status(400).json({ message: "Email/username & password is required" });
//     }

//     if (identifier.includes("@")) {
//       user = await userDao.findUserByEmail(identifier);
//     } else {
//       user = await userDao.findUserByUsername(identifier);
//     }

//     if (!user) {
//       return res.status(401).json({ message: "Username or Email not found" });
//     }

//     if (!user.verifyPassword(password)) {
//       return res.status(401).json({ message: "Wrong password" });
//     }

//     // console.log('Successful login flag:', res.locals.successfulLogin);
//     const { accessToken, refreshToken } = generateLoginTokens(user);
//     res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
//     res.json({ accessToken });
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };

const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userDao.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No email found" });
    }

    const token = generateResetToken();
    user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 60000;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const emailContent = getResetPaswEmailContent(token);

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: emailContent,
    });

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: "Password needs to be at least 8 characters long and contain both numerical and alphabetical letters.",
      });
    }

    const user = await userDao.findUserByResetTokenAndExpireDate(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.body.accessToken;

  if (refreshToken) {
    cache.put(refreshToken, true, 7 * 24 * 60 * 60 * 1000);
  }

  // can't use because no front-end yet
  if (accessToken) {
    cache.put(accessToken, true, 15 * 60 * 1000);
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

const refreshToken = async (req, res) => {
  try {
    const newAccessToken = generateAccessToken(req.userPayload.userId, req.userPayload.username, req.userPayload.role);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  register,
  login,
  requestResetPassword,
  resetPassword,
  logout,
  refreshToken,
};
