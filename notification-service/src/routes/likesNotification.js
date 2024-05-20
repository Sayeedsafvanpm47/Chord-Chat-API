const express = require('express');
const Consumer = require('../messaging/consumer');
const consumer = new Consumer();
const likesNotification = express.Router();
const Notification = require('../models/notification')



async function listenForLikes() {
  try {
    console.log('waiting for order notification')
    const data = await consumer.ConsumerMessages('likes-queue', 'liked-post', async (message) => {
      console.log('Data received:', message);
      
          let newNotification = new Notification({
            userId:message.message.userId,
            notification:message.message.message
          })
          await newNotification.save()
      

      
    });
  } catch (error) {
    console.error('Error listening for order placement:', error);
  }
}
listenForLikes()
module.exports = likesNotification
