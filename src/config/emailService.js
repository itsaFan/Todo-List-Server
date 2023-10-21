const nodemailer = require("nodemailer");
const config = require("./config");

const transporter = nodemailer.createTransport({
  host: config.smtpMail,
  port: 587,
  auth: {
    user: config.email,
    pass: config.emailPasw,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: config.email,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
