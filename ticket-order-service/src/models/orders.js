const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Ticket model
const OrderSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
   quantity: {
      type: Number,
      default: 1,
    },
    totalAmount : {
      type:Number,
      default : 100 
    },
    image : {
      type:String 
    },
    userId :{
      type:String
    },
    username : {
      type : String
    },
    ticketId:{
      type: String
    },
    payment : {
      type : Boolean
    },
    status: {
      type: String,
      enum: ['Active', 'Cancelled'],
      default: 'Active' 
    }
  },
  { timestamps: true }
);


// Export the Ticket model
module.exports = mongoose.model("Order", OrderSchema);
