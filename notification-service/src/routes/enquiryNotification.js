const express = require('express');
const Consumer = require('../messaging/consumer');
const consumer = new Consumer();
const enquiryNotifications = express.Router();
const Notification = require('../models/notification')



async function listenForEnquiries() {
  try {
    console.log('waiting for enquiry notification')
    const data = await consumer.ConsumerMessages('enquiry-queue', 'enquiry-message', async (message) => {
      console.log('Data received:', message);
      
          let newNotification = new Notification({
            userId:message.message.userId,
            notification:message.message 
          })
          await newNotification.save()
      

      
    });
  } catch (error) {
    console.error('Error listening for order placement:', error);
  }
}
listenForEnquiries()
module.exports = enquiryNotifications
