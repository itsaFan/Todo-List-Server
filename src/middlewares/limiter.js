const rateLimit = require("express-rate-limit");

const LoginLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many login attempts, please try again after 30 seconds",

});

module.exports = {
  LoginLimiter,
};


