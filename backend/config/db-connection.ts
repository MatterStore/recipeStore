const mongoose = require("mongoose");

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.jd0lpeu.mongodb.net/?retryWrites=true&w=majority`;
console.log(DB_URL);

const mongoOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(DB_URL, mongoOpts, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log("\nConnected to Database.");
  }
});
