require("dotenv").config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

module.exports = { URI, PORT };
