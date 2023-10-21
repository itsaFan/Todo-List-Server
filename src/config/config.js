require("dotenv").config();

const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  mainUrl: process.env.MAIN_URL,
  devUrl: process.env.DEV_URL,
  smtpMail: process.env.SMTP_EMAIL,
  email: process.env.EMAIL,
  emailPasw: process.env.EMAIL_PASW,
};

module.exports = config;
