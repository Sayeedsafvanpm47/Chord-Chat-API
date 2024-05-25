const userService = require('../services/userService')
const {decryptPassword} = require('../helpers/encryptPassword')
const jwt = require('jsonwebtoken')
const { BadRequestError } = require('chordchat-common')

const signInUser = async (req,res,next)=>{
          try {
                    const {email,password} = req.body 
                    const checkUser = await userService.findUser(email)
                    if(!checkUser) throw new BadRequestError('User not found, sorry')
                              const existingPass = checkUser.password 
                              const decryptedPass = await decryptPassword(password,existingPass)
                              if(decryptedPass)
                             {
                             
                                     const userDetails = {...checkUser._doc}
                                     delete userDetails.password
                                     console.log(userDetails)
                                     const userJWT = jwt.sign(userDetails,process.env.JWT_KEY)
                                   
                                  
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
}

module.exports = {
signInUser
}