const express = require('express')
const router = express.Router()
const stripe = require('stripe')('sk_test_51PBBfzSAq6ZQeUm6ftiBFYYhqxVT0hCLvmkhOHflPDo66IC8d27pycR5uq2qtNMzRCESvPvGH71x51nkUP8PHlGf00NCqkv3qi')
const {v4:uuidv4} = require('uuid')

router.post("/api/payment-service/payment",async (req,res) => {
const {products} = req.body;
console.log(products,'products')
const lineItems = products.map((product)=>({
          price_data:{
                    currency:"USD",
                    product_data:{
                              name:product.name,
                             
                    },
                    unit_amount: Math.floor(product.price * 100),
          },
          quantity:product.quantity || 1
          
}))
const session = await stripe.checkout.sessions.create({
payment_method_types:["card"],
line_items:lineItems,
mode:'payment',
success_url:'http://localhost:5173/success',
cancel_url:'http://localhost:5173/error'
})
res.json({id:session.id})
})

module.exports = router 