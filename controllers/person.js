const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personRouter.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      }
      res.status(404).end();
    })
    .catch((err) => next(err));
});

personRouter.post("/", (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    address: req.body.address,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    id: req.body.id,
    date: new Date(),
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

personRouter.get("/info", (req, res, next) => {
  Person.countDocuments((err, count) => {
    if (err) {
      next(err);
    }

    res.send({
      status: `phonebook has entries for ${count} people.
      [${new Date()}].`,
    });
  });
});

personRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

personRouter.put("/:id", (req, res, next) => {
  const person = { number: req.body.number };

  const opts = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(req.params.id, person, opts)
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

module.exports = personRouter;
