const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.delete("/api/post-service/delete-post/:id",async (req, res) => {
          try {
              const postId = req.params.id;
              const findPost = await Post.deleteOne({_id:postId})

                  return res.status(204).json({message:"Post deleted successfully!"}); 
            
              
          } catch (error) {
              console.error('Error deleting post:', error);
              return res.status(500).json({ message: 'Internal server error' });
          }
      });

module.exports = router 