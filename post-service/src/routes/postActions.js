const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { v4: uuidv4 } = require("uuid");
const { currentUser, requireAuth } = require("chordchat-common");
const Producer = require('../messaging/producer')
const producer = new Producer()

router.get("/api/post-service/toggle-like-post/:id", async (req, res) => {
  try {
          console.log(req.currentUser,'current')
          console.log(req.cookies,'cookie')
    const postId = req.params.id;
    const user_id = req.currentUser._id;
    const findPost = await Post.findOne({ _id: postId });
    let isLiked;
    let postMessage = {
      postId : postId,
      userId : user_id 
    }

    if (findPost) {
      let findIfLiked = findPost.likes.findIndex(
        (like) => like.user_id == user_id
      );
      if (findIfLiked !== -1) {
        findPost.likes.splice(findIfLiked, 1);
        isLiked = false;

      } else {
        if(findPost.user_id !== user_id)
          {
            findPost.likes.push({
              user_id: user_id,
              username: req.currentUser.username,
            });
            isLiked = true;
            const message = {
              userId : findPost.user_id,
              message : {message:`${req.currentUser.username} liked your post!`}
            }
            await producer.publishMessage('liked-post',message)
           
            console.log('liked post')
          }
          else
          {
            return res.json({message:'Your own post'})
          }
       
     
      }
      await producer.publishMessage('user-liked',postMessage) 
      await findPost.save();
     
  
   
      console.log(isLiked,'is liked')
      return res.json({
        message: isLiked ? "Liked post" : "Unliked post",
        findPost,isLiked
      });
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/api/post-service/liked-posts',async(req,res)=>{
          try {
                    const user_id = req.currentUser._id
                    console.log(user_id,'userId')
                    
                    const likedPosts = await Post.find({ 'likes.user_id': user_id });

                    res.json({ likedPosts });
          } catch (error) {
                    
          }
})


router.get("/api/post-service/view-comments/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const findPost = await Post.findOne({ _id: postId });
    if (findPost) {
      return res.json({
        message: "Comments fetched successfully",
        comments: findPost.comments,
      });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error fetching comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/api/post-service/delete-comment/:id/:commentId",
  async (req, res) => {
    try {
      const postId = req.params.id;
      const  commentId  = req.params.commentId;

      const findPost = await Post.findOne({ _id: postId });

      if (findPost) {
        const commentIndex = findPost.comments.findIndex(
          (comment) => comment.commentId == commentId
        );

        if (commentIndex !== -1) {
          findPost.comments.splice(commentIndex, 1);
          await findPost.save();
          return res.json({
            message: "Comment deleted successfully",
            data: findPost,
          });
        } else {
          return res.status(404).json({ message: "Comment not found" });
        }
      } else {
        return res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/api/post-service/view-likes/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const findPost = await Post.findOne({_id:postId})
    if (findPost) {
      return res.json({
        message: "Likes fetched successfully",
        likes: findPost.likes,
      });
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/post-service/share-post/:postId", async (req, res) => {
          try {
            const id = req.params.postId;
            const findPost = await Post.findOne({ _id: id });
            const sendMessage = `
            Check out this awesome post!
            ${findPost.title}
            Login/Signup to chord chat: http://localhost:5173
`;
     
            const encoded = encodeURIComponent(sendMessage);
            const isMobileDevice =
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
        
            let link;
            if (isMobileDevice) {
              link = `whatsapp://send?text=${encoded}`;
            } else {
              link = `https://web.whatsapp.com/send?text=${encoded}`;
            }
        
            if (isMobileDevice && !isWhatsAppAppAvailable()) {
              link = `https://web.whatsapp.com/send?text=${encoded}`;
            }
        
            function isWhatsAppAppAvailable() {
              return /(whatsapp|wa)/i.test(navigator.userAgent);
            }
        
            res.send(link);
          } catch (error) {}
        });

router.post('/api/post-service/add-comment/:id',async (req,res)=>{
          try {
                   
           const comment = req.body.comment
           const postId = req.params.id 
           const user_id = req.currentUser._id
           const username = req.currentUser.username
           const profile = req.currentUser.image 
           const findPost = await Post.findOne({_id:postId})

           if(findPost)
           {

                    findPost.comments.push({user_id,username,profile,comment,commentId:uuidv4()})
                   await findPost.save()
                   const message = {
                    userId : findPost.user_id,
                    message : {message:`${req.currentUser.username} commented "${comment}" on your post!`}
                  }
                  await producer.publishMessage('liked-post',message)
                 
                    return res.json({message:'comment added successfully!',data:findPost})

           }else
           {
                    return res.status(404).json({ message: 'Post not found' });
           }
           
                    
          } catch (error) {
                    console.error('Error adding comment:', error);
                    return res.status(500).json({ message: 'Internal server error' });
          }
})

router.post('/api/post-service/flag-post/:id', async (req, res) => {
          try {
              const postId = req.params.id;
              const userId = req.currentUser._id;
              let message;
      
              const findPost = await Post.findOne({ _id: postId });
              if (findPost) {
                  const findIfFlaggedIndex = findPost.flaggers.findIndex(user => user === userId);
                  if (findIfFlaggedIndex === -1) {
                    
                      findPost.flaggers.push(userId);
                      findPost.flagcount++;
                      message = 'Post flagged!';
                      const flagAction = {
                        userId : findPost.user_id,
                        message : {message:`Your post was flagged by a user`}
                      }
                      await producer.publishMessage('flag-post',flagAction)

                  } else {
                   
                      findPost.flaggers.splice(findIfFlaggedIndex, 1);
                      findPost.flagcount--;
                      message = 'Post unflagged';
                  }
      
                  if (findPost.flagcount > 5) {
                      findPost.active = false;
                      const flagAction = {
                        userId : findPost.user_id,
                        message : {message:`Your post is hidden since it exceeded flag count!`}
                      }
                      await producer.publishMessage('flag-post',flagAction)
                  }
                  await findPost.save();
                  
                  return res.status(200).send({ message: message, findPost });
              } else {
                  return res.status(404).send({ message: 'Post not found' });
              }
          } catch (error) {
              console.log(error);
              res.status(500).send({ message: 'Internal server error' });
          }
      });
      

module.exports = router;
