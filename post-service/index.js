const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

let connection = process.env.MONGO_URI;

mongoose.connect(connection);

const db_connect = mongoose.connection;
db_connect.once("open", () => {
  console.log("Database connected successfully!");

  try {
    app.listen(3004, () => {
      console.log("Post service listening to port 3004");
    });
  } catch (error) {
    console.log("error occured in app", error);
  }
});
