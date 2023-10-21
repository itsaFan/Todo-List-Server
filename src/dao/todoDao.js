const Todo = require("../models/todo");

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

    const result = await Todo.findOneAndUpdate(filter, updates, {
      new: true,
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

module.exports = {
  createTodo,
  getTodoByCreator,
  getAllTodos,
  getTodoByID,
  deleteTodo,
  updateTodo,
};
