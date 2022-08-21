const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("should return persons as JSON", async () => {
  await api
    .get("/api/persons")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 10000);

afterAll(() => mongoose.connection.close());
