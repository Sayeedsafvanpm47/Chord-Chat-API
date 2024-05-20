const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.patch('/api/post-service/edit-post/:id',async (req,res)=>{
          try {
                   
                   const {title,description} = req.body
                   console.log(title,'title')
                   console.log(description,'desc')
                   const postId = req.params.id 
                   console.log('inside edit post',postId)
                   const findPost = await Post.findOne({_id:postId})
                   console.log(findPost,'found post')
                   if(findPost)
                   {
          
                   if(description) findPost.description = description 
                   if(title) findPost.title = title
                   await findPost.save()
                   console.log(findPost,'edited post')
                    return res.json({message:'Edited successfully',findPost})
                   }else
                   {
                    
                    return res.status(404).send({message:'Not found'})
                   }

                    
          } catch (error) {
                    console.error('Error fetching likes:', error);
                    return res.status(500).json({ message: 'Internal server error' });
                    
          }
})

module.exports = router 