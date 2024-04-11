const express = require("express");
const { body } = require("express-validator");
const { validateRequest } = require("chordchat-common");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const generateOtp = require('../helpers/generateOtp')

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }),
    body("username").isString().isLength({min:4,max:15}),
    body("firstname").isString().isLength({min:3,max:15}),
    body("lastname").isString().isLength({min:3,max:15}),
    body("talent").isString(),  
  ],
  validateRequest,
 async (req, res) => {
     const emailExist = await User.findOne({})
  }
);
