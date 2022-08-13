const { info, error } = require("./logger");

const reqLog = (req, res, next) => {
  info("METHOD", req.method);
  info("PATH", req.path);
  info("BODY", req.body);
  info("---");

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errHandler = (err, req, res, next) => {
  error(err.message);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (err.message === "ValidationError") {
    res.status(400).json({ error: err.message });
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    res.status(400).send({ error: err });
  }

  next(err);
};

module.exports = { reqLog, errHandler, unknownEndpoint };
