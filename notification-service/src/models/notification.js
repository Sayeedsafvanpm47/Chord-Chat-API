const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const NotificationSchema = new Schema({
  notification:{
    type: Object,
  },
  userId : {
    type : String
  },
  type : {
    type : String 
  }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("notification", NotificationSchema);
