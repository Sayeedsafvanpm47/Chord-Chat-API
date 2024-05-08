const express = require("express");
const app = express();
require("express-async-errors");
const { currentUser, requireAuth } = require("chordchat-common");
const orderNotification = require('./src/routes/orderNotification');
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketIo = require('socket.io');
const http = require('http');
const Consumer = require('./src/messaging/consumer');


const consumer = new Consumer();

app.use(cookieParser());
app.set("trust proxy", true);
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));

// Initialize cookie session middleware
app.use(cookieSession({
  httpOnly: true,
  signed: false,
  secure: false,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
}));

// Initialize Express middleware for JSON and form data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO with the HTTP server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});





// io.on('connection', async (socket) => {
//   console.log('User connected successfully');
//   socket.on("disconnect", () => {
//     console.log("A client disconnected");
   
// });

//   likePost(socket); 
 
//   await listenForOrderPlaced(socket);


// });



// async function likePost(socket) {
//  await consumer.ConsumerMessages('like-queue', 'liked',async ()=>{
//     socket.on('show-like', () => {
//       socket.emit('like', 'likedpost');
//     });
//   });
  
// }

// Use orderNotification routes
app.use(orderNotification);

// Export the Express app and server
module.exports = { app, server };
