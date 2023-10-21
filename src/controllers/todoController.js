const { todoDao } = require("../dao");

const createTodo = async (req, res) => {
  const { title, description } = req.body;

  const userId = req.userPayload.userId;

  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const todo = await todoDao.createTodo({
      title,
      description,
      createdBy: userId,
    });

    res.status(201).json({ message: "Todo created successfully", todo: todo });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const viewTodoCreatedBy = async (req, res) => {
  const userId = req.userPayload.userId;

  try {
    const todos = await todoDao.getTodoByCreator(userId);
    return res.status(200).json({ message: "Todo List: ", todos });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const viewAllTodos = async (req, res) => {
  try {
    const todos = await todoDao.getAllTodos();
    return res.status(200).json({ message: "All Todos: ", todos });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const userId = req.userPayload.userId;
  const userRole = req.userPayload.role;

  try {
    const todo = await todoDao.getTodoByID(todoId);
    // console.log(todo);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.createdBy._id.toString() !== userId && userRole !== "ROLE_ADMIN") {
      return res.status(403).json({ message: "Only the creator or admin can delete it" });
    }

    await todoDao.deleteTodo(todoId);
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const editTodo = async (req, res) => {
  const { todoId } = req.params;
  const newTodoData = req.body;
  const userId = req.userPayload.userId;
  const userRole = req.userPayload.role;

  try {
    const todo = await todoDao.getTodoByID(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.createdBy._id.toString() !== userId && userRole !== "ROLE_ADMIN") {
      return res.status(403).json({ message: "Only the creator or admin can edit it" });
    }

    const updatedTodo = await todoDao.updateTodo(todoId, newTodoData);
    return res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  createTodo,
  viewTodoCreatedBy,
  viewAllTodos,
  deleteTodo,
  editTodo,
};
