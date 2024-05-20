const express = require('express')
const signInRouter = express.Router()
const {decryptPassword} = require('../helpers/encryptPassword')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {body} = require('express-validator')
const {validateRequest} = require('chordchat-common')
const { BadRequestError } = require('chordchat-common')

signInRouter.post('/api/users/signin',[
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
                    const userDetails = {...checkUser._doc}
                    delete userDetails.password
                    console.log(userDetails)
                    const userJWT = jwt.sign(userDetails,process.env.JWT_KEY)
                  
                    // req.session = {
                    //           jwt:userJWT
                    // }

                    res.cookie('jwt', userJWT, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'none', 
                        path: '/',
                        
                     
                      });
                return res.json({message:'success',data:userDetails,token: userJWT })
            }else
            {
                   throw new BadRequestError('Invalid credentials')
            }

                    
          } catch (error) {
                    next(error)
                   console.log(error)
          }
})

module.exports = {signInRouter}