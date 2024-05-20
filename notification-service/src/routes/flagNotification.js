const express = require('express');
const Consumer = require('../messaging/consumer');
const consumer = new Consumer();
const flagNotifications = express.Router();
const Notification = require('../models/notification')



async function listenForFlags() {
  try {
    console.log('waiting for flag notification')
    const data = await consumer.ConsumerMessages('flag-queue', 'flag-post', async (message) => {
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
listenForFlags()
module.exports = flagNotifications
