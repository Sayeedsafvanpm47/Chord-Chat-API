const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const Producer = require('../messaging/producer')
const producer = new Producer()

router.delete("/api/post-service/delete-post/:id",async (req, res) => {
          try {
            console.log('in delete post')
              const postId = req.params.id;
              const findPost = await Post.deleteOne({_id:postId})
              const message = {
                userId : req.currentUser._id,
                postId : postId
              }
              await producer.publishMessage('delete-user-post',message)
                  return res.status(204).json({message:"Post deleted successfully!"}); 
            
              
          } catch (error) {
              console.error('Error deleting post:', error);
              return res.status(500).json({ message: 'Internal server error' });
          }
      });

module.exports = router 