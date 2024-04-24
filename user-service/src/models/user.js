const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const UserSchema = new Schema({
  email: {
    type: String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  talent:{
    type:String
  },
  profile_pic:{
    type:String
  },
  online_status:{
    type:Boolean
  },
  fans:{
    type:Array,
  
  },
  idols:{
    type:Array 
  },
  gigs:{
    type:Array 
  },
  profile_description:{
    type:String
  },
  status:{
  type : String ,
  enum:['active','blocked']
  },
  block_list : {
    type :Array 
  },
  wallet : {
    type : Number 
  },
  notifications : {
    type : Array 
  },
  isAdmin : {
    type:Boolean,
    default : false
  },
  image:{
    type:String
  },
  active : {
    type:Boolean,
    default : true
  }
}, {
  toJSON:{
        transform(doc,ret){
            
            delete ret.password; 
            delete ret.__v;
        }    
  }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("User", UserSchema);
