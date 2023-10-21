const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  address: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
