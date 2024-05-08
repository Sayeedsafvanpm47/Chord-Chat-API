const Order = require('../models/orders');
const Consumer = require('../messaging/consumer');
const express = require('express')
const router = express.Router()
const consumer = new Consumer();
const Producer = require('../messaging/producer')
const producer = new Producer()
async function createOrder() {
  try {
    const orderInfo = await consumer.ConsumerMessages('order-queue','payment-success');
   console.log(orderInfo,'info')
   console.log(orderInfo.message,'order info to be saved')
   if(orderInfo)
    {
const order = new Order(orderInfo.message)
  
  await order.save() 
  console.log(order,'saved order')
  let notificationstatus
  if(order)
    {
     notificationstatus = await producer.publishMessage('order-placed-success',order)
    //  const stockDetail = {ticketId:order.}
     await producer.publishMessage('clear-stock',order.quantity)
    }
 
  console.log('msg to be sent',notificationstatus)
if(notificationstatus)
{
  console.log('msg successfully sent',notificationstatus)
}
    }
  
    // Further logic here to process the order info
  } catch (error) {
    console.error("Error consuming message:", error);
  }
}
createOrder()

module.exports = router 
