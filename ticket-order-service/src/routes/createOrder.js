const Order = require('../models/orders');
const Consumer = require('../messaging/consumer');
const express = require('express')
const router = express.Router()
const consumer = new Consumer();
const Producer = require('../messaging/producer')
const producer = new Producer()
async function createOrder() {
  try {
    await consumer.ConsumerMessages('orders-queue', 'payment-success', async (orderInfo) => {
      console.log(orderInfo, 'info');
      console.log(orderInfo.message, 'order info to be saved');
      
      // Process the order and save it to the database
      const order = new Order(orderInfo.message);
      await order.save();
      if(order)
        {
          const stockDetils = {
            ticketId:order.ticketId,
            quantity:order.quantity
          }
          await producer.publishMessage('clear-stock',stockDetils)
          const message = {
            message :  {message:`Your order for ${order.quantity} ${order.title} tickets has been successfull`},
            userId : order.userId
          }
          await producer.publishMessage('order-placed-info',message)
        }else
        {
          const message = {
            message :  {message:`Your order for ${order.quantity} ${order.title} tickets has failed please try again! `},
            userId : order.userId
          }
          await producer.publishMessage('order-placed',message)
        }
      
      // Further processing and message publishing
    });
  } catch (error) {
    console.error("Error consuming message:", error);
  }
}

createOrder();

module.exports = router 
