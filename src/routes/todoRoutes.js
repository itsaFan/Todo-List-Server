const express = require("express");
const { createTodo, viewTodoCreatedBy, viewAllTodos, deleteTodo, editTodo } = require("../controllers/todoController");
const { verifyAccessToken } = require("../auth/validate");
const { checkRole } = require("../auth/checkRole");

const router = express.Router();

router.post("/add", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), createTodo);
router.get("/me", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), viewTodoCreatedBy);
router.get("/all", verifyAccessToken, checkRole(["ROLE_ADMIN"]), viewAllTodos);

router.delete("/delete/:todoId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), deleteTodo);
router.put("/edit/:todoId", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), editTodo);

module.exports = router;
