const express = require('express')
const router = express.Router()
const Market = require('../models/marketplace')
const upload = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const BadRequestError = require('chordchat-common/src/errors/bad-request-error')

router.patch('/api/market/edit-ad/:adId',upload.single('image'),async (req,res)=>{
          try {
            console.log('edit called')
            const adId = req.params.adId 
            let imageData
            console.log(adId,'adid')
            console.log(req.body)
            const {description,price,image} = req.body 
         
            console.log(description,'desc')
            console.log(price,'price')
            console.log(image,'image')
            console.log(req.file,'file')
            console.log(req.file?.path,'path')
           if(req.file){ const result = cloudinary.uploader.upload(req.file.path,{folder:"marketplace"},(err,result)=>{
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
        imageData = (await result).secure_url 
      }
      console.log(imageData,'imageData back')
            const findAd = await Market.findOne({_id:adId})
            if(!findAd)
            {
            return res.status(404).send({message:'Ad not found'})
            }else{
            if(imageData) findAd.image = imageData 
            if(description) findAd.description = description 
            if(price) findAd.price = price 
            await findAd.save()
            return res.json({message:`Your Ad has been updated succesfully`,data:findAd})
            }
            
          } catch (error) {
                    console.log(error)
            return res.status(500).send({message:'Internal server error!'})
          }
        })

        module.exports = router 