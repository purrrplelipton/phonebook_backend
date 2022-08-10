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
    minLength: [8, "number too short"],
    validate: {
      validator: (v) => {
        const cleanNum = v.replace(/\D/g, "").length >= 8,
          checkHyphen = v.match(/\-/g).length === 1,
          checkStart = /(?:^\+\d{2,3}\-\d{8}|^\d{2,3}\-\d{8})/.test(v);
        return cleanNum && checkHyphen && checkStart;
      },
      message: (props) => `${props.value} is not a valid phone number`,
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
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
