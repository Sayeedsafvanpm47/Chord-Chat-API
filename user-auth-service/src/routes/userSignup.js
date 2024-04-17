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

router.post('/api/users/generate-otp',async(req,res)=>{
  try {
    const email = req.body.email
    
     let otp = await generateOtp()
     if(!email) throw new BadRequestError('Please enter an email!')
     await sendMail(email,otp).then((res)=>console.log(res))
    let findOtp = await Otp.findOne({email})
    if(findOtp)
    {
      findOtp.otp = otp
      await findOtp.save()
    }else
    {
    let OtpForVerification = new Otp({
      email,otp
    })
    await OtpForVerification.save()
  }
    return res.json({message:'otp generated',otp,email})

    
  } catch (error) {
    console.log(error)
  }
})

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Invalid password credentials"),
 
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email,password, username, firstname, lastname, talent,enteredOtp } =
        req.body;
        let otp 
      const verifyOtp = await Otp.findOne({email})
    
      
      if(verifyOtp)
      {
        
        otp = verifyOtp.otp 
      
      }else
      {
        throw new BadRequestError('Confirm the email in which the otp was sent!')
      }
      console.log(otp,'otp')
      const emailExist = await User.findOne({ email });
      console.log(req.session,'session')
      if (emailExist) {
        throw new BadRequestError("Email already exists");
      }
      
     

     
      const encryptedPassword = await encryptPassword(password);

      const signUpDetails = {
        email,
        password:encryptedPassword,
        username,
        firstname,
        lastname,
        talent,
        
        
      };
      console.log(signUpDetails,'signupdetails')
    console.log(enteredOtp,'entered')
    console.log(otp,'otp')
    console.log(enteredOtp == otp)
     if(enteredOtp == otp)
     {
      console.log(otp,'inside')
      const newUser = await new User(signUpDetails)
      newUser.save()
    
      const userDetails = {...newUser._doc}
      delete userDetails.password
      console.log(userDetails,'userDetails')
      const userJWT = jwt.sign(userDetails, process.env.JWT_KEY);
      req.session = {
        jwt: userJWT
      };
      return res.json({message:'Otp Verification success, user registered successfully',data:userDetails})
     }
     else
     {
      throw new BadRequestError('Otp verification failed!')
     }
  

    
    } catch (error) {
      if (error instanceof BadRequestError) {
        return res.status(400).json({ errors: [error.message] });
      } else {
        console.error("Unexpected error:", error);
        return res.status(500).json({ errors: ["An unexpected error occurred"] });
      }
    }
  }
);







module.exports = router;
