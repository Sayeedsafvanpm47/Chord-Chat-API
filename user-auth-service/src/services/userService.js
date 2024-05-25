const userRepository = require('../repositories/userRepository')

const findUser = async (email)=>{
          return userRepository.findUser(email)
}

const signUpUser = async (details)=>{
          return userRepository(details)
}

const findOtp = async (email)=>{
          return userRepository.findOtp(email)
}

const updateOtp = async (email,otp)=>{
          return userRepository.updateOtp(email,otp)
}

const createOtp = async (email,otp)=>{
          return userRepository.createOtp(email,otp)
}

module.exports = {
findUser,findOtp,updateOtp,createOtp,signUpUser
}