const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");

const signUpRouter = require("./src/routes/userSignup");
const currentUserRouter = require("./src/routes/currentUser");
const signOutRouter = require("./src/routes/userSignout");
const signInRouter = require("./src/routes/userSignin");
const forgotPasswordRouter = require("./src/routes/forgotPassword");
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')
const cors = require("cors");

app.use(cookieParser())
app.set("trust proxy", true);
const corsOptions = {
          origin: ['http://localhost:5173', 'https://chordchat.dev'],
          optionsSuccessStatus: 200,
          credentials: true
        };
        app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//           cookieSession({
//             signed: false,
//             secure: false,
//             sameSite: 'none',  
//             maxAge: 24 * 60 * 60 * 1000 
//           })
//         );
app.use(signUpRouter);
app.use(currentUserRouter);
app.use(signOutRouter);
app.use(signInRouter);
app.use(forgotPasswordRouter);
app.use(errorHandler);

module.exports = app;
