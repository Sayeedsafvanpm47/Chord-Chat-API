const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");
const createAdRouter = require("./src/routes/createAd");
const adActionsRouter = require("./src/routes/adActions");
const editAdRouter = require("./src/routes/editAd");
const viewAdRouter = require("./src/routes/viewAd");
const makeDealRouter = require("./src/routes/makeDeal");
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
app.use(adActionsRouter);
app.use(createAdRouter);
app.use(editAdRouter);
app.use(errorHandler);
app.use(viewAdRouter);
app.use(makeDealRouter);

module.exports = app;
