const Todo = require("../models/todo");
const User = require("../models/user");

const createTodo = async (todoData) => {
  const newTodo = new Todo(todoData);
  await newTodo.save();
  return newTodo;
};

const getTodoByCreator = async (createdBy) => {
  return Todo.find({ createdBy }).populate("createdBy", "_id username email");
};

const getAllTodos = async () => {
  return Todo.find().populate("createdBy", "_id username email");
};

const getTodoByID = async (_id) => {
  return Todo.findById({ _id }).populate("createdBy", "_id username email");
};

const deleteTodo = async (todoId) => {
  return Todo.deleteOne({ _id: todoId });
};

const updateTodo = async (todoId, newTodoData) => {
  try {
    const filter = { _id: todoId };
    const updates = {};

    if (newTodoData.title) {
      updates.title = newTodoData.title;
    }

    if (newTodoData.description) {
      updates.description = newTodoData.description;
    }

    if (newTodoData.priority) {
      updates.priority = newTodoData.priority;
    }

    if (newTodoData.deadline) {
      updates.deadline = newTodoData.deadline;
    }

    const result = await Todo.findOneAndUpdate(filter, updates, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("Error when trying to update:", error);
    throw error;
  }
};

const findTodo = async (query, userRole, userId) => {
  try {
    if (userRole === "ROLE_ADMIN") {
      const users = await User.find({ username: new RegExp(query, "i") });
      const userIds = users.map((user) => user._id);

      return await Todo.find({
        $or: [{ title: new RegExp(query, "i") }, { createdBy: { $in: userIds } }],
      }).populate("createdBy", "_id username email");
    } else if (userRole === "ROLE_USER") {
      return await Todo.find({
        $and: [{ title: new RegExp(query, "i") }, { createdBy: userId }],
      });
    }
  } catch (error) {
    console.error("Error when trying to search:", error);
    throw error;
  }
};

module.exports = {
  createTodo,
  getTodoByCreator,
  getAllTodos,
  getTodoByID,
  deleteTodo,
  updateTodo,
  findTodo,
};
