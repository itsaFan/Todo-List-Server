const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;



// priority: {
//   type: String,
//   enum: ["low", "medium", "high"]
// },
// createdOn: {
//   type: Date,
//   required: true,
// },
// dueOn: {
//   type: Date,
//   required: true,
// },