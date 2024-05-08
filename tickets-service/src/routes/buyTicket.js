const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const Consumer = require("../messaging/consumer");
const {BadRequestError} = require('chordchat-common')
const consumer = new Consumer();
router.post(
  "/api/ticket-service/buy-ticket/:id/:quantity",
  async (req, res) => {
    try {
      const ticketId = req.params.id;
      const quantity = req.params.quantity;

      console.log(quantity, "quantity");

      const findTicket = await Ticket.findOne({ _id: ticketId });
      const price = findTicket.price;
      if (findTicket) {
        return res.json({
          data: {
            ...findTicket._doc,
            quantity: quantity,
            totalPrice: quantity * price,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);
async function clearStock() {
          console.log('in clear stock')
  try {
    await consumer.ConsumerMessages(
      "stock-queue",
      "clear-stock",async(data)=>{
          console.log(data,'receieved stock data')
          if(data)
                    {
                              const findTicket = await Ticket.findOne({
                                        _id: data.message.ticketId,
                                      });
                                      if (findTicket) {
                                          findTicket.stock = findTicket.stock - data.message.quantity
                                          await findTicket.save()
                                          console.log('finished modifiying ticket')
                                      }else
                                      {
                                          throw new BadRequestError('Error clearing stock')
                                      }
                    }
      }
    );
   

  } catch (error) {
          console.log(error)
  }
}
clearStock()
async function reclaimStock() {
          console.log('in reclaim stock')
  try {
    await consumer.ConsumerMessages(
      "reclaim-stock-queue",
      "reclaim-stock",async(data)=>{
          console.log(data,'receieved stock data')
          if(data)
                    {
                              const findTicket = await Ticket.findOne({
                                        _id: data.message.ticketId,
                                      });
                                      if (findTicket) {
                                          findTicket.stock = findTicket.stock + data.message.quantity
                                          await findTicket.save()
                                          console.log('finished reclaiming stock')
                                      }else
                                      {
                                          throw new BadRequestError('Error clearing stock')
                                      }
                    }
      }
    );
   

  } catch (error) {
          console.log(error)
  }
}
reclaimStock()
module.exports = router;
