const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");
const { currentUser, requireAuth } = require("chordchat-common");
const conversationRouter = require('./src/routes/conversations')
const messageRouter = require('./src/routes/messages')
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketIo = require('socket.io')
const http = require('http');
const ioConfig = require("./src/utils/ioConfig");

app.use(cookieParser());
app.set("trust proxy", true);
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    httpOnly: true,
    signed: false,
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    // domain: '.chordchat.dev'
  })
);


// app.use(currentUser);
// app.use(requireAuth);
app.use(conversationRouter)
app.use(messageRouter)

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});
ioConfig(io)

module.exports = {app,server,io}
