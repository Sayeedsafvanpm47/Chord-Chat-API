const express = require('express')
const router = express.Router()
const Ticket = require('../models/ticket')
const {BadRequestError} = require('chordchat-common')


router.post('/api/ticket-service/create-ticket',async(req,res)=>{
          try {
                  const {title,price,description,stock} = req.body 
                  if(price < 5) throw BadRequestError('Enter a price greater than 5')
                  if(stock <= 0) throw BadRequestError('Enter stock greater than zero')
                  const newticket = new Ticket({title,price,description,stock})
                  await newticket.save()
                  return res.json({message:'Ticket created successfully',newticket})

          } catch (error) {
                    
          }
})

router.patch('/api/ticket-service/edit-ticket/:id', async (req, res) => {
          const id  = req.params.id;
          const { title, description, price, stock} = req.body;  
          const findTicket = await Ticket.findOne({_id:id})
          if(findTicket)
          {
                    if(title) findTicket.title = title 
                    if(description) findTicket.description = description 
                    if(price) findTicket.price = price 
                    if(stock) findTicket.stock = stock 
                    await findTicket.save() 
                    return res.json(`Ticket details changed successfully!`)
          }else
          {
                  throw BadRequestError('Ticket not found!')
          }
      

         
        });

router.get('/api/ticket-service/view-buyers',async(req,res)=>{

})

router.get('/api/ticket-service/toggle-view-ticket',async (req,res)=>{
          
})
module.exports = router 