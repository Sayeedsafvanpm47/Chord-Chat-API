const express = require('express')
const router = express.Router()


router.post('/api/users/signout',async(req,res)=>{
          console.log('in logout!')
          req.session = null 
          res.cookie('jwt', '', { 
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none',
                    path: '/'
                });
          res.json({message:'User logged out successfully'})
})

module.exports = router 