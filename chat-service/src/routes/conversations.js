const express = require('express')
const router = express.Router()
const Conversation = require('../models/conversation')


router.post('/api/chat-service/set-conversation',async(req,res)=>{
          try {
                   const conversation = new Conversation({members:[req.body.senderId,req.body.receiverId]}) 
                   await conversation.save()
                   res.status(200).json({message:'success',conversation})
          } catch (error) {
                    
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