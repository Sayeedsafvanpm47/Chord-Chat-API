const userRepository = require('../repositories/userRepository')


const findUser = async (id)=>{
          return userRepository.findUser(id)
}

const updateUserProfile = async (id,details)=>{
          return userRepository.updateUserProfile(id,details)
}
module.exports = {
findUser,updateUserProfile
}