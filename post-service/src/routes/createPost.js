const express = require("express");
const router = express.Router();
const Post = require('../models/post')

const {
  BadRequestError,
} = require("chordchat-common");

const upload = require("../middleware/multer");


const compressFile = require("../middleware/compression");
const {uploadCloudinary,uploadVideo} = require("../helpers/cloudinaryUpload");


router.post('/api/post-service/uploadvid',upload.single('video'),async(req,res)=>{
//  if(req.file)
//  {
//  const response =await compressFile(req.file.path)
//  console.log(response,'response')
//  return res.json({message:response})
//  }
try {
  const {description,title} = req.body 
console.log(description)
console.log(title)
const user_id = req.currentUser._id
const username = req.currentUser.username 
if (req.file) {

  const video = await uploadVideo(req.file.path,'posts')
  
  console.log(video)
  const postData = {description,title,user_id,video,username}
  const postCreated = new Post(postData)
  await postCreated.save()
  console.log(postCreated)

  return res.json({message:'success',data:postData})
}
  
} catch (error) {
  console.log(error)
  throw new BadRequestError('Failed to pos')
  
}
})



module.exports = router;
