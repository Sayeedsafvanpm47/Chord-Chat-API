const express = require('express')
const router = express.Router()
const Otp = require('../models/otp-verify');
const User = require('../models/user')
const { BadRequestError } = require('chordchat-common');
const { encryptPassword } = require('../helpers/encryptPassword');

router.post('/api/users/forgotPassword', async (req, res) => {
         try {
          const {email,enteredOtp,newPassword,confirmPassword} = req.body
          const findOtp = await Otp.findOne({email})
          let otp 
          if(!findOtp) throw new BadRequestError('Confirm the email in which the otp was sent!')
          otp = findOtp.otp 
console.log(otp,'otpfound')
console.log(enteredOtp,'entered')
          if(otp == enteredOtp)
          {
                  if(newPassword == confirmPassword)
                  {
                            const encryptedPassword = await encryptPassword(newPassword)
                            console.log(encryptedPassword)
                            const user = await User.findOne({email})
                            if(user)
                            {
                                      user.password = encryptedPassword 
                                      await user.save()
                                      res.json({message:'Password changed successfully!'})
                            }else
                            {
                                      throw new BadRequestError('Something went wrong!')
                            }
                  }else
                  {
                            throw new BadRequestError('The passwords does not match')
                  }
          }else
          {
                  throw new BadRequestError('Otp verification failed!')
          }
         } catch (error) {
           res.json({errors:[error.message]})
           console.log(error.message)
         }
            
          
        });


        module.exports = router 