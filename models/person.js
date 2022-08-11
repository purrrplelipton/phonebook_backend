const mongoose = require("mongoose");

// mongoose.set("useFindAndModify", false);

const url = process.env.MONGODB_URI;

console.log("attempting connection to MongoDB");

mongoose
  .connect(url)
  .then(() => console.log("connection established"))
  .catch((error) => console.log("failed to connect to MongoDB", error));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    unique: true,
    minLength: 8,
    validate: {
      validator: (v) => /(?:^\+\d{2,3}\-\d{7,}|^\d{2,3}\-\d{7,})/.test(v),
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
