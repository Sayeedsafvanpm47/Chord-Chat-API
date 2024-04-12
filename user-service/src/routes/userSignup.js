const express = require("express");
const { body } = require("express-validator");
const { validateRequest, currentUser, requireAuth } = require("chordchat-common");
const BadRequestError = require("chordchat-common/src/errors/bad-request-error");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const generateOtp = require("../helpers/generateOtp");
const {
  encryptPassword,
  decryptPassword,
} = require("../helpers/encryptPassword");


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
      const { email, password, username, firstname, lastname, talent } =
        req.body;

      const emailExist = await User.findOne({ email: email });

      if (emailExist) {
        throw new BadRequestError("Email already exists");
      }

      const otp = await generateOtp();
      const encryptedPassword = await encryptPassword(password);

      const signUpDetails = {
        email,
        password:encryptedPassword,
        username,
        firstname,
        lastname,
        talent,
        
        
      };

      
    
      const userJWT = jwt.sign(signUpDetails, process.env.JWT_KEY);
      req.session = {
        jwt: userJWT,
        otp:otp
      };
      const sessionOtp = req.session.otp 
     
      console.log(userJWT,'userjwt')
      console.log(req.session.jwt)

      return res.status(200).json({
        message: "Otp generated, waiting for verification, user details shared",
      sessionOtp 
      });
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

router.get('/api/users/regenerate-otp',currentUser,async(req,res)=>{
  try {
     let otp = await generateOtp()
     
     req.session.otp = otp 
  
     res.json({message:'otp changed',otp})

    
  } catch (error) {
    
  }
})

router.post('/api/users/verify-signup', currentUser, async (req, res) => {
  try {
    const otp = req.body.otp;
    const signUpDetails = req.currentUser
    if(otp == req.session.otp)
    {
      const newUser = await new User(signUpDetails)
      newUser.save()
      return res.json({message:'Otp Verification success, user registered in database!'})
    }
    return res.json({ message:'Otp verification failed, please try again' });
  } catch (error) {
    console.error("Error verifying signup:", error);
    res.status(500).json({ errors: ["An unexpected error occurred"] });
  }
});



module.exports = router;
