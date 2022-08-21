const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "name is too short"],
  },
  number: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /\d{2,3}-\d{7,8}/.test(v),
      message: () => "invalid phone number format",
    },
    date: { type: Date, required: true },
    id: { type: Number, required: true },
  },
});

personSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
