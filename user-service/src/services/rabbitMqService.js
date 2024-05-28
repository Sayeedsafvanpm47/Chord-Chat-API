const Consumer = require('../messaging/consumer')
const consumer = new Consumer()
const Producer = require('../messaging/producer')
const producer = new Producer()
const express = require('express')
const router = express.Router()
const userService = require('../services/userService')


async function saveLikedPost()
{
  try {
    console.log('in like post')
    await consumer.ConsumerMessages('like-post-queue','user-liked',async(message)=>{
      const findUser = await userService.findUser(message.message.userId)
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



module.exports = router