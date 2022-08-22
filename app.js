const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const personRouter = require("./controllers/person");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
const mongoose = require("mongoose");
const { info, error } = require("./utils/logger");

info("connecting to MongoDB");

mongoose
  .connect(config.URI)
  .then(() => info("connected to MongoDB"))
  .catch((err) => error("could not connect to MongoDB", err.message));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.use("/api/persons", personRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
