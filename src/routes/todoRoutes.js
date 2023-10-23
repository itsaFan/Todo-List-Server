const express = require("express");
const { createTodo, viewTodoCreatedBy, viewAllTodos, deleteTodo, editTodo, searchTodos } = require("../controllers/todoController");
const { verifyAccessToken } = require("../auth/validate");
const { checkRole } = require("../auth/checkRole");
const { xRequestId } = require("../middlewares");

const router = express.Router();

router.post("/add", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), createTodo);
router.get("/me", verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), viewTodoCreatedBy);
router.get("/all", verifyAccessToken, checkRole(["ROLE_ADMIN"]), viewAllTodos);
router.get("/search", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), searchTodos);

router.delete("/delete/:todoId", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), deleteTodo);
router.put("/edit/:todoId", xRequestId, verifyAccessToken, checkRole(["ROLE_USER", "ROLE_ADMIN"]), editTodo);

module.exports = router;
