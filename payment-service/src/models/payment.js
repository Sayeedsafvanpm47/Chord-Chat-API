const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const PaymentSchema = new Schema({
  user_id:{
    type : String
  },
  username:{
    type : String
  },
  paymentStatus : {
    type : String,
  },
  amount : {
    type : String ,
   
  },
  ticket_details : {
    type : Number,
    default:0
  }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("payment", PaymentSchema);
