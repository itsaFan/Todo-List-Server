const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const { applyCors, applyHelmet, setPermissionPolicy } = require("./middlewares");
const dbConnection = require("./config/db-config");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");
const swaggerUi = require("swagger-ui-express");
const escapeHtml = require("escape-html");

//setup
const app = express();
applyCors(app);
applyHelmet(app);
app.use(setPermissionPolicy)
app.use(cookieParser());
app.use(express.json());
dbConnection();

app.get("/api/security-test", (req, res) => {
  const name = req.query.name ? escapeHtml(req.query.name) : "Guest";
  res.send(`
      <h1>Hello ${name}</h1><br />
      <p> Security Test</p>
     `);
});
//Swagger Config
// const swaggerDocument = YAML.load("./src/doc/openapi.yaml");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(
//   OpenApiValidator.middleware({
//     apiSpec: "./src/doc/openapi.yaml",
//     validateRequests: true,
//   })
// );

app.use("/api", authRoutes);
app.use("/api/todo", todoRoutes);

//Open-api error handling
// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     message: err.message,
//     errors: err.errors,
//   });
// });

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));
