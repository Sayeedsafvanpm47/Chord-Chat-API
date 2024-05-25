const express = require("express");
const { body } = require("express-validator");
const { validateRequest, currentUser, requireAuth } = require("chordchat-common");
const BadRequestError = require("chordchat-common/src/errors/bad-request-error");
const User = require("../models/user");
const Otp = require('../models/otp-verify')
const jwt = require("jsonwebtoken");
const router = express.Router();
const generateOtp = require("../helpers/generateOtp");
const {
  encryptPassword,
  decryptPassword,
} = require("../helpers/encryptPassword");
const { sendMail } = require("../utils/sendMail");


router.get('/api/users/hi',async(req,res)=>{
  try {
    res.json({message:'Hi'})
  } catch (error) {
    console.log(error)
  }
})






module.exports = router;
