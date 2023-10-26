const express = require("express");
const { register, login, requestResetPassword, resetPassword, logout, refreshToken } = require("../controllers/authController");
const { LoginLimiter, xRequestId } = require("../middlewares");
const { verifyRefreshToken } = require("../auth/validate");
const { body } = require("express-validator");

const router = express.Router();

router.post("/register", xRequestId, body("username", "email", "password").trim(), register);
router.post("/login", LoginLimiter, xRequestId, body("identifier").trim(), login);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", xRequestId, resetPassword);
router.post("/logout", xRequestId, logout);
router.post("/refresh", xRequestId, verifyRefreshToken, refreshToken);

module.exports = router;
