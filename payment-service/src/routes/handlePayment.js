const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// Create a PayPal environment
const clientId = 'AWH29Ty7klt_wr9H1fuC8P4_mh5JIa8_nBiPEPXtcsHjR_wceWH0PgzsZUfNbx7v8uS9W3Up8-UELLAy';
const clientSecret = 'ECE3c0ZbD6neOqskdigGoPeh0iOOQayLsh0f98n8Hm5SZ3Yf3Mg7NLwQMy0tANEj2336DTxFbbOajTpM';
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

router.post("/api/payment-service/paymentsss", async (req, res) => {
          try {
              // Construct request to create PayPal order
              const request = new paypal.orders.OrdersCreateRequest();
              request.prefer("return=representation");
              request.requestBody({
                  intent: "CAPTURE",
                  purchase_units: [{
                      amount: {
                          currency_code: "USD",
                          value: "2000", // 1000 Rs ticket x 2
                          breakdown: {
                              item_total: { // Add item_total here
                                  currency_code: "USD",
                                  value: "2000",
                              },
                          },
                      },
                      items: [
                          {
                              name: "Concert Ticket",
                              description: "Ticket for the concert",
                              quantity: "2",
                              unit_amount: {
                                  currency_code: "USD",
                                  value: "1000",
                              },
                          },
                      ],
                  }],
              });
      
              // Execute request to create PayPal order
              const response = await client.execute(request);
              const orderId = response.result.id;
              res.json({ orderId });
          } catch (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
      });
      
      // Define route for completing PayPal transaction
      router.post("/api/payment-service/paypal-transaction-complete", async (req, res) => {
          try {
              const orderId = req.body.orderId;
              const request = new paypal.orders.OrdersCaptureRequest(orderId);
              request.requestBody({});
              const capture = await client.execute(request);
              const result = capture.result;
              res.json({ result });
          } catch (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
      });
      


// async function receiveMessage(message) {
//     const create_payment_json = [{
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             "return_url": "http://localhost:3006/api/payment-service/success",
//             "cancel_url": "http://localhost:3006/api/payment-service/cancel"
//         },
//         "transactions": [{
//             "item_list": {
//                 "items": [

//                 ]
//             },
//             "amount": {
//                 "currency": "INR",
//                 "total": "10.20"
//             },
//             "description": "Keep purchasing awesome tickets with chord-chat"
//         }]
//     }];

//     try {
//         const payment = await new Promise((resolve, reject) => {
//             paypal.payment.create(create_payment_json, (error, payment) => {
//                 if (error) reject(error);
//                 else resolve(payment);
//             });
//         });

//         for (let i = 0; i < payment.links.length; i++) {
//             if (payment.links[i].rel === 'approval_url') {
//                 // Redirect the user to the PayPal approval URL
//                 // You may need to store payment ID in database for later use
//                 // In this example, I'm just sending the approval URL as the reply
//                 const reply = { approval_url: payment.links[i].href };
//                 producer('ticket-payment-notification', JSON.stringify(reply));
//                 break; // Exiting loop after sending the approval URL
//             }
//         }

//         console.log(message);
//         const reply = { message: 'Detail received' };
//         producer('ticket-payment-notification', JSON.stringify(reply));
//         return message;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// // You need to await the consumer function or handle its promise
// const data = consumer('ticket-group', 'ticket-detail', receiveMessage);

// // Define success route
// router.get('/success', (req, res) => {
//     // Here you can handle the successful payment
//     // You may want to update your database or perform any other necessary actions
//     console.log('Payment success:', req.query);
//     res.send('Payment successful!');
// });

// // Define cancel route
// router.get('/cancel', (req, res) => {
//     // Here you can handle the cancellation of payment
//     // You may want to display a message to the user or redirect them to a specific page
//     console.log('Payment cancelled:', req.query);
//     res.send('Payment cancelled!');
// });

module.exports = router;
