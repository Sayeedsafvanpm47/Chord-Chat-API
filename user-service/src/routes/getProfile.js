const express = require('express')
const router = express.Router()
const {currentUser,requireAuth} = require('chordchat-common')
router.get('/api/users/get-profile',currentUser,requireAuth,async(req,res)=>{
          try { 
                 console.log(req.currentUser)
                 res.json({message:'User profile'})  
          } catch (error) {
                    res.json(error)
          }
})

module.exports = router 