const express = require("express");
const app = express();
require("express-async-errors");

const { currentUser, requireAuth } = require("chordchat-common");
const createOrder = require('./src/routes/createOrder')
const getOrders = require('./src/routes/getOrders')
const cancelOrder = require('./src/routes/cancelOrder')

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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


app.use(createOrder)
app.use(getOrders)
app.use(cancelOrder)

module.exports = app;
