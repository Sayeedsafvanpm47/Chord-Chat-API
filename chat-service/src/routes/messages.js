const express = require('express')
const router = express.Router()
const Message = require('../models/message')
const { BadRequestError } = require('chordchat-common')
const Producer = require('../messaging/producer')
const producer = new Producer()

router.post('/api/chat-service/set-message',async(req,res)=>{
          try {
                   const {conversationId,text,senderId,type,username,receiverId} = req.body
                   console.log(req.body)
                    if(!conversationId || !text || !senderId) throw new BadRequestError('Some properties are not recieved')
                     
                   const message = new Message({conversationId,text,senderId})
                   await message.save()
                   if(message && type=='enquiry')
                    {
                      const message = {
                              userId : receiverId,
                              message:`Enquiry from ${username}! Check the chat..`
                      }
                      producer.publishMessage('enquiry-message',message)
                    }
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