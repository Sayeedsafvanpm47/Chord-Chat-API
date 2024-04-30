const express = require('express')
const router = express.Router()
const Ticket = require('../models/ticket')
const { producer } = require('../../../common/src/messaging/producer')

router.post('/api/ticket-service/buy-ticket/:id',async (req,res)=>{
          try {
          const ticketId = req.params.id 

          const findTicket = await Ticket.findOne({_id:ticketId})
          if(findTicket)
          {
                    await producer('ticket-detail',JSON.stringify(findTicket))
                    return res.json({message:'Waiting for payment confirmation'})
          }
                    
          } catch (error) {
                    console.log(error)
          }
})

module.exports = router 