const express= require('express')
const router = express.Router()

router.get('/api/ticket-service/lock-stock/:id/:stock',async(req,res)=>{

          try {
                   const stock = req.params.stock 
                   const ticketId = req.params.id 
                   

          } catch (error) {
                    
          }
})

module.exports = router 