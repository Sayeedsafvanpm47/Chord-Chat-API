const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const MarketplaceSchema = new Schema({
  user_id:{
    type : String
  },
  username:{
    type : String
  },
  description : {
    type : String,
  },
  image : {
    type : String ,
   
  },
  price : {
    type : Number,
    default:0
  },
 active : {
  type : Boolean ,
  default:true

 },
 flagCount : {
   type : Number ,
   default:0
 },
 visibility : {
  type : Boolean ,
  default:true
 },
 flaggers : {
  type:Array,
  default:[]
 }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Marketplace", MarketplaceSchema);
