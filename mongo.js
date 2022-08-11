const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://toby:${password}@cluster0.5az3h.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const Person = mongoose.model("Person", {
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
      validator: (v) => /(?:^\+\d{2,3}\-\d{7,}|^\d{2,3}\-\d{7,})/.test(v),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

const person = new Person({ name: process.argv[3], number: process.argv[4] });

if (false) {
  person.save().then((prsn) => {
    console.log("contact saved");
    mongoose.connection.close();
  });
}

Person.find({}).then((prsn) => {
  prsn.forEach((p) => console.log(p));
  mongoose.connection.close();
});
