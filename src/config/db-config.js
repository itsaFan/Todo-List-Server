const mongoose = require("mongoose");
const config = require("./config");
const Permission = require("../models/permission");

async function seedPermissions() {
  try {
    const roles = ["ROLE_USER", "ROLE_ADMIN"];

    for (const role of roles) {
      const existingRole = await Permission.findOne({ role: role });
      if (!existingRole) {
        const newRole = new Permission({ role: role });
        await newRole.save();
      }
    }
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
}

const dbConnection = () => {
  mongoose
    .connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connect to MongoDb");
      seedPermissions();
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = dbConnection;
