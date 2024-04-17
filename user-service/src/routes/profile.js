const express = require("express");
const router = express.Router();
const User = require('../models/user')
const {
  currentUser,
  requireAuth,
  validateRequest,
  BadRequestError
} = require("chordchat-common");
const { body } = require("express-validator");
const { decryptPassword, encryptPassword } = require("../helpers/encryptPassword");

router.use(currentUser);
router.use(requireAuth);

router.get('/api/user-service/getme',(req,res)=>{
  res.json({message:'Hey'})
})
router.patch(
  "/api/user-service/edit-profile",
  async (req, res) => {
    try {
       const {username,oldpassword,newpassword,confirmpassword} = req.body 
       let email = req.currentUser.email  
       let user = await User.findOne({email})
       if(!user) throw new BadRequestError
       if(!username && !oldpassword && !newpassword && !confirmpassword) return res.json({message:'Nothing to update'})
       if(username) user.username = username
       const existingPass = user.password  
       if(oldpassword){
       let decryptedPass = decryptPassword(oldpassword,existingPass)
       if(decryptedPass)
       {
              if(newpassword.length < 4 || newpassword.length > 20){
                     return res.json({message:'Password must be at least 4 charecters and not more than 20'})

              }
              if(newpassword == confirmpassword)
              {
                    let encryptedNewPassword = await encryptPassword(newpassword)
                    user.password = encryptedNewPassword 
                    await user.save()
                   

              }else
              {
                     return res.json({message:'Updation failed, passwords doesnt match'})
              }
       }else
       {
              throw new BadRequestError 
       }
}
       return res.json({message:'User details updated successfully',user})
       

    } catch (error) {}
  }
);



module.exports = router;
