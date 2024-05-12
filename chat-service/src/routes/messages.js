const express = require('express')
const router = express.Router()
const Message = require('../models/message')
const { BadRequestError } = require('chordchat-common')

router.post('/api/chat-service/set-message',async(req,res)=>{
          try {
                   const {conversationId,text,senderId} = req.body
                   console.log(req.body)
                    if(!conversationId || !text || !senderId) throw new BadRequestError('Some properties are not recieved')

                   const message = new Message(req.body)
                   await message.save()
                   return res.status(200).json({message:'success',message})

          } catch (error) {
                    console.log(error)
          }
})

router.get('/api/chat-service/get-messages/:conversationId',async (req,res)=>{
          try {
                    const messages = await Message.find({conversationId:req.params.conversationId})
                    res.status(200).json({message:'Messages for conversation fetched',messages})
          } catch (error) {
                    console.log(error)
          }
})

module.exports = router 