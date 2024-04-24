const express = require('express')
const router = express.Router()
const Market = require('../models/marketplace')


router.post('/api/market/request-reply/:adId',async (req,res)=>{
try {
          const adId = req.params.adId 
          const {userId} = req.body 
          const adDetails = await Market.findOne({_id:adId})
          if(adDetails)
          {
                    return res.json({message:'Ad details sent out to notifications for requesting users reply',data:adDetails,requestedUser:userId})
          }
          else
          {
                    return res.json({message:'Failed in requesting for enquiry for ad'})
          }
          
} catch (error) {
          console.log(error)
          return res.json({error:[error]})
}
})

module.exports = router 