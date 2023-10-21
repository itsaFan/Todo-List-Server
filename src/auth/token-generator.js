const config = require("../config/config");
const jwt = require("jsonwebtoken");

const generateLoginTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role.role,
    },
    config.accessSecret,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role.role,
    },
    config.refreshSecret,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

const generateAccessToken = (userId, username, role) => {
  return jwt.sign(
    {
      userId: userId,
      username: username,
      role: role,
    },
    config.accessSecret,
    {
      expiresIn: "15m",
    }
  );
};

module.exports = {
  generateLoginTokens,
  generateAccessToken,
};
