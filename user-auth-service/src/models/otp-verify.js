const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the User model


const OtpSchema = new Schema({
  email: {
    type: String,
    required:true
  },
  otp : {
          type : String,
          required: true
  }
},{ timestamps: true });

// Create and export the User model
module.exports = mongoose.model("Otp", OtpSchema);
