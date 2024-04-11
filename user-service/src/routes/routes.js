const { NotFoundError, currentUser } = require("chordchat-common")
const express = require('express')
const router = express.Router()

router.get('/',currentUser,(req,res)=>{
         
          res.send({currentUser:req.currentUser||null})
         
})

module.exports = router 


