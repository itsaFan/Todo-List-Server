const config = require("../config/config");
const jwt = require("jsonwebtoken");
const cache = require("memory-cache");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!config.accessSecret) {
    return res.status(500).json({ error: "Access Token is missing or undefined" });
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if(cache.get(token)) {
      return res.status(401).json({ error: "Access token is blacklisted." });
    }

    jwt.verify(token, config.accessSecret, (error, userPayload) => {
      if (error) {
        console.log("JWT verification Error:", error);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      req.userPayload = userPayload;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized: No bearer token" });
  }
};

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.steffToken;
  // console.log("Refresh Token:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided." });
  }

  if (!config.refreshSecret) {
    return res.status(500).json({ error: "Refresh Token is missing or undefined" });
  }
  if (cache.get(refreshToken)) {
    return res.status(401).json({ error: "Refresh token is blacklisted." });
  }

  jwt.verify(refreshToken, config.refreshSecret, (error, userPayload) => {
    if (error) {
      console.log("JWT verification Error:", error);
      return res.status(401).json({ error: "Invalid refresh token." });
    }
    req.userPayload = userPayload;
    next();
  });
};

module.exports = { verifyAccessToken, verifyRefreshToken };
