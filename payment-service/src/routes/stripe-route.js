const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51PBBfzSAq6ZQeUm6ftiBFYYhqxVT0hCLvmkhOHflPDo66IC8d27pycR5uq2qtNMzRCESvPvGH71x51nkUP8PHlGf00NCqkv3qi"
);
const { v4: uuidv4 } = require("uuid");

const Producer = require("../messaging/producer");
const producer = new Producer();

router.post("/api/payment-service/payment", async (req, res) => {
  let { products } = req.body;
  console.log(products, "products");

  let productInfo = [products];
  const lineItems = productInfo.map((product) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: product.title,
        description:product.description,
        images: [product.image],
      },
      unit_amount: Math.floor(parseInt(product.price * 100) ),
  
    },
    quantity: product.quantity || 1,
   
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:3006/success?products=${encodeURIComponent(
      JSON.stringify(products)
    )}`,
    cancel_url: "http://localhost:5173/error",
  });
  res.json({ id: session.id });
});

router.get("/success", async (req, res) => {
  const products = req.query.products
    ? JSON.parse(decodeURIComponent(req.query.products))
    : {};

  let message = {
    title: products.title,
    ticketId:products._id,
    userId: req.currentUser._id,
    price:products.price,
    username: req.currentUser.username,
    description:products.description,
    quantity:parseInt(products.quantity),
    image:products.image,
    totalAmount:products.totalPrice
  };
  await producer.publishMessage("payment-success", message);

  // Redirect to the success URL of the frontend
  res.redirect("http://localhost:5173/notifications");
});

module.exports = router;
