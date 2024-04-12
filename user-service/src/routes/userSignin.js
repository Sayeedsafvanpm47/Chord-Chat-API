const express = require('express')
const router = express.Router()
const {decryptPassword} = require('../helpers/encryptPassword')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {body} = require('express-validator')
const {validateRequest} = require('chordchat-common')
const { BadRequestError } = require('chordchat-common')

router.post('/api/users/signin',[
          body('email').isEmail().withMessage('Email must be valid!')
          ,
          body('password').trim().notEmpty().withMessage('You must enter a password!')
],validateRequest,async (req,res,next)=>{
          try {
             const {email,password} = req.body 
             const checkUser = await User.findOne({email:email})
             if(!checkUser) throw new BadRequestError('User not found, sorry')
             const existingPass = checkUser.password 
             const decryptedPass = await decryptPassword(password,existingPass)
            if(decryptedPass)
            {
                    const userDetails = {email:checkUser.email}
                    delete userDetails.password 
                    const userJWT = jwt.sign(userDetails,process.env.JWT_KEY)
                    req.session = {
                              jwt:userJWT
                    }
                    return res.json({message:'success'})
            }else
            {
                    throw new BadRequestError('Invalid credentials')
            }

                    
          } catch (error) {
                    next(error)
                   console.log(error)
          }
})

module.exports = router