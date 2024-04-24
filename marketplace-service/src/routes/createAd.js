const BadRequestError = require('chordchat-common/src/errors/bad-request-error')
const express = require('express')
const router = express.Router()
const Market = require('../models/marketplace')
const upload = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');


router.post('/api/market/createAd',upload.single('image'),async (req,res)=>{
          try {
                console.log(req.body)
                console.log(req.file)
                let user_id
                let username 

                if(req.currentUser)
                {
                  user_id = req.currentUser?._id 
                  username = req.currentUser?.username
                }
                if(!req.file)
                {
                        console.log('Missing')
                }
               
                  const {description,price,location} = req.body 
                  console.log(req.body,'body')
                  
                  const result = cloudinary.uploader.upload(req.file.path,{folder:"marketplace"},(err,result)=>{
                        if(err)
                        {
                                console.log(err)
                                throw new BadRequestError('Image upload failed!')
                        }
                        fs.unlink(req.file.path, (unlinkErr) => {
                                if (unlinkErr) {
                                  console.log('Error deleting file:', unlinkErr);
                                }
                              });
                  })
                  const imageData = (await result).secure_url 
                 
                 if (!description || !price || !imageData)
                 throw new BadRequestError('Error while creating ad')
                  const newAd = new Market({description,price,image:imageData,username,user_id,location})
                   await newAd.save() 
                   return res.json({message:'Ad created successfully'})

          } catch (error) {
                     console.log(error)
          }
})

module.exports = router 