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
          checkNum = /(?:^\+\d{2,3}\-\d{7,}|^\d{2,3}\-\d{7,})/.test(v);
        return cleanNum && checkNum;
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
