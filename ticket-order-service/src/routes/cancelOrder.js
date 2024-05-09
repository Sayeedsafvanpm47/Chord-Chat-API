const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const Producer = require('../messaging/producer')
const producer = new Producer()

router.post(
  "/api/ticket-order-service/cancel-order/:orderId",
  async (req, res) => {
    try {
      const orderId = req.params.orderId;
      console.log(orderId,'order id')
      const findOrder = await Order.findOne({ _id: orderId });
      if (findOrder) {
      findOrder.status = 'Cancelled'
      await findOrder.save()
      const stockDetails = {
          ticketId : findOrder.ticketId,
          quantity : findOrder.quantity
      }
      await producer.publishMessage('reclaim-stock',stockDetails)
      const refundDetails = {
          userId : findOrder.userId,
          amount : findOrder.totalAmount 
      }
      await producer.publishMessage('refund-user',refundDetails)
      return res.json({message:'Successfully cancelled the order!'})
}else
{
          return res.json({message:'Error cancelling order'})
}
    } catch (error) {
          console.log(error)
    }
  }
);
module.exports = router;
