const helmet = require("helmet");

const applyHelmet = (app) => {
  app.use(helmet());
  app.use(helmet.frameguard({ action: "sameorigin" }));
};

module.exports = { applyHelmet };
