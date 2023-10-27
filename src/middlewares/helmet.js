const helmet = require("helmet");

const applyHelmet = (app) => {
  app.use(helmet());
  app.use(
    helmet.frameguard({ action: "sameorigin" }),
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    })
  );
};

module.exports = { applyHelmet };
