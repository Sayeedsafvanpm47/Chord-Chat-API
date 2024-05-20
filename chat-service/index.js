
require("dotenv").config();
const mongoose = require("mongoose");
const {app,server} = require('./app')
let connection = process.env.MONGO_URI;

mongoose.connect(connection);

const db_connect = mongoose.connection;
db_connect.once("open", () => {
  console.log("Database connected successfully!");

  try {
    server.listen(3009, () => {
      console.log("Chat service listening to port 3009");
    });
  } catch (error) {
    console.log("error occured in app", error);
  }
});
