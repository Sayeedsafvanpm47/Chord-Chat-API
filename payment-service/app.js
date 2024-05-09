const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");
const handlePayment = require('./src/routes/handlePayment')
const stripePayment = require('./src/routes/stripe-route')
const { currentUser, requireAuth } = require("chordchat-common");

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

app.use(currentUser);
app.use(requireAuth);
app.use(handlePayment)
app.use(stripePayment)

module.exports = app;
