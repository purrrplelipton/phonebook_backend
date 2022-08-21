const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personRouter.get("/:id", (req, res, nxt) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      }
      res.status(404).end();
    })
    .catch((err) => nxt(err));
});

personRouter.post("/", (req, res, nxt) => {
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

personRouter.get("/info", (req, res, nxt) => {
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

personRouter.delete("/:id", (req, res, nxt) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => nxt(err));
});

personRouter.put("/:id", (req, res, nxt) => {
  const person = { number: req.body.number };

  const opts = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(req.params.id, person, opts)
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => nxt(err));
});

module.exports = personRouter;
