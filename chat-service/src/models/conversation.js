const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const ConversationSchema = new Schema({
  user_id:{
    type : String
  },
 members:{
  type :Array 
 }

},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Conversation", ConversationSchema);
