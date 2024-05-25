const User = require('../models/user')

const findUser = async (email)=>{
const findExistingUser = await User.findOne({email:email})
return findExistingUser 
}

const signUpUser = async ()=>{

}



module.exports = {
findUser 
}