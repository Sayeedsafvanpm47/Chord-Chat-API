const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");

const getProfileRouter = require("./src/routes/profile");
const userActionsRouter = require("./src/routes/userActions");
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
        

app.use(userActionsRouter);
app.use(getProfileRouter);
app.use(errorHandler);

module.exports = app;
