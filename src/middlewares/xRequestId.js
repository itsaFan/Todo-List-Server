const uuid = require("uuid");

const xRequestId = (req, res, next) => {
  if (req.headers["x-request-id"]) {
    res.setHeader(`x-required-id`, req.headers[`x-request-id`]);
  } else {
    const reqId = uuid.v4();
    res.setHeader("x-request-id", reqId);
  }
  next();
};

module.exports = { xRequestId };
