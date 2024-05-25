const userRepository = require('../repositories/userRepository')

const findUser = async (email)=>{
          return userRepository.findUser(email)
}

module.exports = {
findUser
}