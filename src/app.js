const express = require("express");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const { applyCors } = require("./middlewares");
const dbConnection = require("./config/db-config");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/todoRoutes");
const YAML = require("yamljs");
const OpenApiValidator = require("express-openapi-validator");
const swaggerUi = require("swagger-ui-express");

//setup
const app = express();
applyCors(app);
app.use(cookieParser());
app.use(express.json());
dbConnection();

//Swagger Config
const swaggerDocument = YAML.load("./src/doc/openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/doc/openapi.yaml",
    validateRequests: true,
  })
);

app.use("/api", authRoutes);
app.use("/api/todo", userRoutes);

//Open-api error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(config.port, () => console.log(`Server is running on http://localhost:${config.port}`));


