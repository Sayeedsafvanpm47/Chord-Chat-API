const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const PostSchema = new Schema({
user_id:{
  type:String
},
description:{
  type:String
},
title:{
  type:String
},likes:{
  type:Array,
  default:[]
},
comments:{
  type:Array,
  default:[]
},
visibility:{
  type:Boolean,
  default:true
},active:{
  type:Boolean,
  default:true
},
video:{
  type:String
},
flagcount:{
  type:Number,
  default:0
},
flaggers:{
  type:Array,
  default:[]
},
username:{
  type:String
}

},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Post", PostSchema);
