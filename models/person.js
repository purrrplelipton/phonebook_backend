const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "name is too short"],
  },
  number: {
    type: String,
    required: [true, "number is required"],
    unique: true,
    validate: {
      validator: (v) => /\d{2,3}\-\d{7,8}/.test(v),
      message: () => "invalid number format",
    },
  },
  email: { type: String, unique: true },
  address: { type: String },
  birthdate: { type: String },
  gender: { type: String },
  id: { type: Number, unique: true },
  date: { type: Date, required: true },
});

personSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
