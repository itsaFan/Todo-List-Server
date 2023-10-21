const express = require("express");
const { register, login, requestResetPassword, resetPassword, logout, refreshToken } = require("../controllers/authController");
const { LoginLimiter } = require("../middlewares");
const { verifyRefreshToken } = require("../auth/validate");

const router = express.Router();

router.post("/register", register);
router.post("/login", LoginLimiter, login);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", verifyRefreshToken, refreshToken);

module.exports = router;
