const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Consumer = require('../messaging/consumer')
const consumer = new Consumer()
const Producer = require('../messaging/producer')
const producer = new Producer()
const {
  currentUser,
  requireAuth,
  BadRequestError,
  currentUserCookie
} = require("chordchat-common");


// router.use(currentUser);
// router.use(requireAuth)


//route to search for users
// router.post("/api/user-service/find-users", async (req, res) => {
//   try {
    
  
//     const searchTerm = req.body.searchTerm;
//     console.log(req.currentUser,'user')
//     if (
//       !searchTerm ||
//       typeof searchTerm !== "string" ||
//       searchTerm.trim() === ""
//     ) {
//       return res.status(400).json({ message: "Invalid search term" });
//     }
   
//     const foundUsers = await User.find({
//       email: { $regex: searchTerm, $options: "i" },
//     });
   
//     if (foundUsers.length > 0) {
//       return res.json({ message: "Users found", users: foundUsers,currentuser:req.currentUser});
//     } else {
//       return res
//         .status(404)
//         .json({ message: "No users found matching the search term" });
//     }
//   } catch (error) {
//     console.error("Error finding users:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
// route to view a certain user's profile
// router.get("/api/user-service/view-user-profile/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     let user = await User.findOne({ _id: userId });
//     if (!user) throw new BadRequestError("User does not exist");
//     return res.json({ userDetails: user });
//   } catch (error) {
//     return res.json({ error: error.message });
//   }
// });

// route to follow or unfollow a particular user
// router.post("/api/user-service/toggle-follow-user/:id", async (req, res) => {
//   const userId = req.params.id;
//   // const user = req.currentUser;
//   const user = req.body.currentUser
//   console.log(userId)
//   console.log(user);
//   const targetUser = await User.findOne({ _id: userId });
//   console.log(targetUser,'tar')
//   const currentUser = await User.findOne({ _id: user });
//   console.log(currentUser,'curr')

//   if (targetUser && currentUser) {
//     const isFollowing = currentUser.idols.includes(userId);

//     if (isFollowing) {
//       const targetUserIndexInFollowers = targetUser.fans.indexOf(
//         currentUser.id
//       );
//       const currentUserIndexInIdols = currentUser.idols.indexOf(userId);
//       targetUser.fans.splice(targetUserIndexInFollowers, 1);
//       currentUser.idols.splice(currentUserIndexInIdols, 1);
//       await targetUser.save();
//       await currentUser.save();
//       return res.json({
//         message: "User unfollowed successfully",
//         currentUser: currentUser,
//         followedUser: targetUser,
//       });
//     } else {
//       targetUser.fans.push(currentUser.id);
//       currentUser.idols.push(userId);
//       await targetUser.save();
//       await currentUser.save();
//       const FollowAction = {
//         userId : userId,
//         message : {message:`${currentUser.username} started following you!`},
//         followerId:currentUser._id,
//         type : 'Follow'
//       }
//       await producer.publishMessage('follow-user',FollowAction)
//       return res.json({
//         message:
//           "User followed successfully,event generated to be consumed by notification service",
//         currentUser: currentUser,
//         followedUser: targetUser,
//       });
//     }
//   } else {
//     return res.status(400).send({ message: "Failed to follow, bad request" });
//   }
// });

// router.get("/api/user-service/get-idols/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userData = await User.findOne({ _id: id });
//     let idolDetails = [];

//     if (userData) {
//       for (const user of userData.idols) {
//         if(user !== id)
//         {
//           const currentUser = await User.findOne({ _id: user });
//           idolDetails.push(currentUser);
//         }
       
//       }
//     }

//     console.log(idolDetails, 'idol details');
//     return res.json({ data: idolDetails });
//   } catch (error) {
//     console.error("Error fetching idol details:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/api/user-service/get-fans/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userData = await User.findOne({ _id: id });
//     let fansDetails = [];

//     if (userData) {
//       for (const user of userData.fans) {
//         const currentUser = await User.findOne({ _id: user });
//       fansDetails.push(currentUser);
//       }
//     }

//     console.log(fansDetails.length, 'fans details');
//     return res.json({ data: fansDetails });
//   } catch (error) {
//     console.error("Error fetching idol details:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

async function saveLikedPost()
{
  try {
    console.log('in like post')
    await consumer.ConsumerMessages('like-post-queue','user-liked',async(message)=>{
      const findUser = await User.findOne({_id:message.message.userId})
      console.log(message.message.userId)
      console.log(findUser,'currentState')
      if(findUser)
        {
           let checkLiked = findUser.likedPosts.findIndex(item => item == message.message.postId)
           if(checkLiked === -1)
            {
              findUser.likedPosts.push(message.message.postId)
              await findUser.save()
            }
            else
            {
              findUser.likedPosts.splice(checkLiked, 1);
              await findUser.save();
            }
         
          console.log(findUser)
        }
    })
   
  } catch (error) {
    console.log(error)
  }
}

saveLikedPost()

async function orderRefund()
{
  try {
    await consumer.ConsumerMessages('refund-queue','refund-user',async(message)=>{
      const findUser = await User.findOne({_id:message.message.userId})
      
      console.log(findUser,'found user')
      if(findUser)
        {
          findUser.wallet = findUser.wallet + message.message.amount
          await findUser.save()
        }
    })
  } catch (error) {
    console.log(error)
  }
}

orderRefund()

async function walletDeduct()
{
  try {
    await consumer.ConsumerMessages('wallet-queue','deduct-wallet',async(message)=>{
      const findUser = await User.findOne({_id:message.message.userId})
      
      console.log(findUser,'found user')
      if(findUser)
        {
          findUser.wallet = findUser.wallet - message.message.amount
          await findUser.save()
        }
    })
  } catch (error) {
    console.log(error)
  }
}
walletDeduct()

async function addPost(){
  try {
    await consumer.ConsumerMessages('post-queue','post-user',async (message)=>{
      const findUser = await User.findOne({_id:message.message.userId})
      if(findUser)
        {
          findUser.gigs.push(message.message.gigId)
          await findUser.save()
        }
    })
  } catch (error) {
    console.log(error)
  }
}
addPost()
async function deletePost()
{
  try {
    await consumer.ConsumerMessages('post-queue','delete-user-post',async (message)=>{
      const findUser = await User.findOne({_id:message.message.userId})
      if(findUser)
        {
          const findId = findUser.gigs.findIndex(item => item == message.message.postId)
          if(findId !== -1)
            {
              findUser.gigs.splice(findId,1)
              await findUser.save()
            }
        }
    })
  } catch (error) {
    console.log(error)
  }
}
deletePost()
router.get('/api/user-service/get-liked-posts',async (req,res)=>{
  try {
    const response = await User.findOne({_id:req.currentUser._id})
    return res.json({message:'fetched liked posts',likedPosts:response.likedPosts})
  } catch (error) {
    
  }
})

router.get('/api/user-service/get-wallet',async (req,res)=>{
  try {
    const user = await User.findOne({_id:req.currentUser._id})
    return res.json({message:'fetched user wallet',wallet:user.wallet})
  } catch (error) {
    
 console.log(error) 
}
})



module.exports = router;
