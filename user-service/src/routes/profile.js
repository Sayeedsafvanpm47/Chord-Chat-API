const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  currentUser,
  requireAuth,
  validateRequest,
  BadRequestError,
} = require("chordchat-common");
const { body } = require("express-validator");
const {
  decryptPassword,
  encryptPassword,
} = require("../helpers/encryptPassword");
const upload = require("../middleware/multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

router.patch(
  "/api/user-service/edit-profile",
  upload.single("image"),
  async (req, res) => {
    try {
      const {firstname,lastname, username, oldpassword, newpassword, confirmpassword } = req.body;
      let _id = req.currentUser 
      let imageData;
      let user = await User.findOne({ _id:_id});
      if (!user) throw new BadRequestError();
      if (username) user.username = username;
      if(firstname) user.firstname = firstname; 
      if(lastname) user.lastname = lastname; 
      const existingPass = user.password;
      //add image
      if (req.file) {
        const result = cloudinary.uploader.upload(
          req.file.path,
          { folder: "marketplace" },
          (err, result) => {
            if (err) {
              console.log(err);
              throw new BadRequestError("Image upload failed!");
            }
            fs.unlink(req.file.path, (unlinkErr) => {
              if (unlinkErr) {
                console.log("Error deleting file:", unlinkErr);
              }
            });
          }
        );
        imageData = (await result).secure_url;
      }
      if(imageData) user.image = imageData
      if (oldpassword) {
        let decryptedPass = decryptPassword(oldpassword, existingPass);
        if (decryptedPass) {
          if (newpassword.length < 4 || newpassword.length > 20) {
            return res.json({
              message:
                "Password must be at least 4 charecters and not more than 20",
            });
          }
          if (newpassword == confirmpassword) {
            let encryptedNewPassword = await encryptPassword(newpassword);
            user.password = encryptedNewPassword;
           
          } else {
            return res.json({
              message: "Updation failed, passwords doesnt match",
            });
          }
        } else {
          throw new BadRequestError('Error updating profile');
        }
      }
      if(firstname || lastname || imageData || username ||newpassword)
      {
       await user.save()
       return res.json({ message: "User details updated successfully", data:user });
      }
      return res.json({message:'Updation failed'})
   
    } catch (error) {
       console.log(error)
       throw new BadRequestError('Error updating profile')
    }
  }
);

module.exports = router;
