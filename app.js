const { URI, PORT } = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const personRouter = require("./controllers/person");
const { reqLog, unknownEndpoint, errHandler } = require("./utils/middleware");
const { info, error } = require("./utils/logger");
const mongoose = require("mongoose");

info("attempting connection to MongoDB");

mongoose
  .connect(URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((err) => error("error connecting to MongoDB", err.message));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(bodyParser.json());
app.use(reqLog);

app.use("/api/persons", personRouter);

app.use(unknownEndpoint);
app.use(errHandler);

module.exports = app;
