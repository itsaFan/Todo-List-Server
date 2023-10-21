const Permission = require("../models/permission");

const findUserRole = async () => {
  return Permission.findOne({ role: "ROLE_USER" });
};

module.exports = {
  findUserRole,
};
