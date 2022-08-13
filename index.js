require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Person = require("./models/person");

const logger = (req, res, nxt) => {
  console.log("METHOD", req.method);
  console.log("PATH", req.path);
  console.log("BODY", req.body);
  console.log("___");
  nxt();
};

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(logger);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, nxt) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      }
      res.status(404).end();
    })
    .catch((err) => nxt(err));
});

app.post("/api/persons", (req, res, nxt) => {
  if (req.body) {
    const person = new Person({
      name: req.body.name,
      number: req.body.number,
      date: new Date(),
      id: req.body.id,
    });

    return person
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((err) => nxt(err));
  }
  res.status(400).json({ error: "content missing" });
});

app.get("/info", (req, res, nxt) => {
  Person.countDocuments((err, count) => {
    if (err) {
      nxt(err);
    }

    res.send({
      status: `phonebook has entries for ${count} people.
      [${new Date()}].`,
    });
  });
});

app.delete("/api/persons/:id", (req, res, nxt) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => nxt(err));
});

app.put("/api/persons/:id", (req, res, nxt) => {
  const person = { number: req.body.number };

  const opts = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(req.params.id, person, opts)
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => nxt(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, nxt) => {
  console.error(err);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    res.status(400).json({ error: err });
  }

  nxt(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
