const express = require('express')
const router = express.Router()
const Order = require('../models/orders')
const { currentUser, requireAuth } = require("chordchat-common");

router.use(currentUser)
router.use(requireAuth)

router.get('/api/ticket-order-service/get-orders',async(req,res)=>{
          try {
                    const userId = req.currentUser 
                    const orders = await Order.find({userId:userId})
                    if(orders)
                              {
                                        return res.json({message:'Orders fetched successfully',orders})
                              }else
                              {
                                        return res.json({message:'Failed to fetch orders',orders})
                              }
          } catch (error) {
                    console.log(error)
          }
})

module.exports = router 