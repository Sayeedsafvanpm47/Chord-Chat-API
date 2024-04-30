const express = require("express");
const app = express();
require("express-async-errors");

const adminTicket = require('./src/routes/admin')
const viewTicket = require('./src/routes/getTickets')
const buyTicket = require('./src/routes/buyTicket')
const { currentUser, requireAuth } = require("chordchat-common");
require('./src/utils/ticketExpirationCron')

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
app.options("*", cors(corsOptions));
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
app.use(adminTicket)
app.use(viewTicket)
app.use(buyTicket)


module.exports = app;
