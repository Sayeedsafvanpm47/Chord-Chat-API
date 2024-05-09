const express = require('express')
const router = express.Router()
const Notification = require('../models/notification')
const {currentUser,requireAuth} = require('chordchat-common')

router.use(currentUser)
router.use(requireAuth)
router.get('/api/notification-service/get-user-notifications',async(req,res)=>{
          try {
                    const notifications = await Notification.find({userId:req.currentUser._id}).sort({createdAt:-1})
                    if(notifications)
                              {
                                        console.log(notifications, 'fetched user notifications successfully')
                                        return res.json({message:'Fetched user notifications',notifications})
                              }
          } catch (error) {
                    console.log(error)
          }
})

module.exports = router 