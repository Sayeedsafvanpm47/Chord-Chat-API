const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");

const signUpRouter = require("./src/routes/userSignup");
const currentUserRouter = require("./src/routes/currentUser")
const signOutRouter = require('./src/routes/userSignout')
const signInRouter = require('./src/routes/userSignin')
const getProfileRouter = require('./src/routes/getProfile')
const cookieSession = require('cookie-session')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({signed:false,secure:false}))
app.use(signUpRouter);
app.use(currentUserRouter)
app.use(signOutRouter)
app.use(signInRouter)
app.use(getProfileRouter)
app.use(errorHandler);


module.exports = app;
