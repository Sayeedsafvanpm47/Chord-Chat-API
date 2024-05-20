const express = require('express');
const Consumer = require('../messaging/consumer');
const consumer = new Consumer();
const followNotifications = express.Router();
const Notification = require('../models/notification')



async function listenForfollows() {
  try {
    console.log('waiting for follow notification')
    const data = await consumer.ConsumerMessages('follow-queue', 'follow-user', async (message) => {
      console.log('Data received:', message);
      
          let newNotification = new Notification({
            userId:message.message.userId,
            notification:{
              message : message.message.message.message,
              followerId:message.message.followerId 
            },
            type : message.message.type 
          })
          await newNotification.save()
      

      
    });
  } catch (error) {
    console.error('Error listening for order placement:', error);
  }
}
listenForfollows()
module.exports = followNotifications
