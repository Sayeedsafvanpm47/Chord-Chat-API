const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const MessageSchema = new Schema({
  user_id:{
    type : String
  },
  conversationId : {
    type :String 
  },
  text:{
    type:String
  },
  senderId:{
    type :String
  }

},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Message", MessageSchema);
