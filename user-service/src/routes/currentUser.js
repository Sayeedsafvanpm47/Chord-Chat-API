const {currentUser} = require('chordchat-common')
const express = require('express')

const router = express.Router()
router.get('/api/users/currentuser',currentUser,(req,res)=>{
          const session = req.session.jwt
res.send({currentUser:req.currentUser||null,session})



})
module.exports = router
