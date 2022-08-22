const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (req, res, nxt) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => nxt(err));
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

personRouter.put("/:id", (req, res, nxt) => {
  Person.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => nxt(err));
});

personRouter.delete("/:id", (req, res, nxt) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => nxt(err));
});

module.exports = personRouter;
