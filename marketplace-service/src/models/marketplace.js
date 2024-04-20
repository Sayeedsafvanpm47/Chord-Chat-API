const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const MarketplaceSchema = new Schema({
  user_id:{
    type : String 
  },
  description : {
    type : String,
  },
  image : {
    type : String 
  },
  price : {
    type : Number 
  },
 active : {
  type : Boolean 
 },
 flagCount : {
   type : Number 
 },
 visibility : {
  type : Boolean 
 }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Marketplace", MarketplaceSchema);
