const User = require("../models/user");

const findUser = async (id) => {
  const findExistingUser = await User.findOne({ _id: id });
  return findExistingUser;
};

const updateUserProfile = async (id,details) => {
  const findExistingUser = await findUser(id);
  if (findExistingUser) {
   const {firstname,lastname,imageData,username,encryptedPassword} = details 
   if(firstname) findExistingUser.firstname = firstname 
   if(lastname) findExistingUser.lastname = lastname 
   if(imageData) findExistingUser.image = imageData
   if(username) findExistingUser.username = username 
   if(encryptedPassword) findExistingUser.password = encryptedPassword 
   await findExistingUser.save()
   return findExistingUser 
  }
};
module.exports = {
  findUser,updateUserProfile
};
