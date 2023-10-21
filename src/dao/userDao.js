const User = require("../models/user");

const createUser = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const findUserByUsername = async (username) => {
  return User.findOne({ username }).populate("role");
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).populate("role");
};

const findUserByResetTokenAndExpireDate = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserByResetTokenAndExpireDate,
};
