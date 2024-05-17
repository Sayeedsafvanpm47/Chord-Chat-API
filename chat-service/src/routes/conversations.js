const express = require('express')
const router = express.Router()
const Conversation = require('../models/conversation')


router.post('/api/chat-service/set-conversation',async(req,res)=>{
          try {
                    const findConversation = await Conversation.find({
                              members : {$in:[req.body.receiverId]}
                    })
                    console.log(findConversation,'find conversation')
                    if(findConversation.length == 0)
                    {
                              const conversation = new Conversation({members:[req.body.senderId,req.body.receiverId]}) 
                              await conversation.save()
                              console.log('Added to conversation')
                              res.status(200).json({message:'success',conversation})
                    }else
                    {
                              res.status(200).json({message:'Already have conversation'})
                    }
                 
          } catch (error) {
                    console.log(error)
          }
})

router.get('/api/chat-service/get-conversations/:userId',async (req,res)=>{
          try {
              
                    const conversation = await Conversation.find({
                              members : {$in:[req.params.userId]}
                    })
                    res.status(200).json({message:'success',conversation})
          } catch (error) {
                    
          }
})





module.exports = router 