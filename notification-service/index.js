const {app,server} = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
let connection = process.env.MONGO_URI;

mongoose.connect(connection);


const db_connect = mongoose.connection;
db_connect.once("open", () => {
  console.log("Database connected successfully!");

  try {
  server.listen(3008, () => {
      console.log("Notification service listening to port 3008");
    });
  } catch (error) {
    console.log("error occured in app", error);
  }
});

