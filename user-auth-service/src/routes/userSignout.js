const express = require('express')
const router = express.Router()

router.post('/api/users/signout',async(req,res)=>{
          // req.session = null 
          res.clearCookie('jwt'); 
          res.json({message:'User logged out successfully'})
})

module.exports = router 