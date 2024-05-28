const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");

const getProfileRouter = require("./src/routes/profile");
const userActionsRouter = require("./src/routes/userActions");
const adminRouter = require('./src/routes/admin')
const hireMusicianRouter = require('./src/routes/hireMusicians')
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const rabbitMQ = require('./src/services/rabbitMqService')
const {currentUser,requireAuth} = require('chordchat-common')

app.use(cookieParser())
app.set("trust proxy", true);
// const corsOptions = {
//           origin: ['http://localhost:5173', 'https://chordchat.dev'],
//           optionsSuccessStatus: 200,
//           credentials: true
//         };
const corsOptions = {
  origin: ['http://localhost:5173',/\.chordchat.dev\.dev$/],    // reqexp will match all prefixes
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,             
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}
app.options('*', cors(corsOptions))
 app.use(cors(corsOptions));

        
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
          cookieSession({
            httpOnly:true,
            signed: false,
            secure: false,
            sameSite: 'none', 
            maxAge: 24 * 60 * 60 * 1000,
            domain: '.chordchat.dev'
          })
        );
        
app.use(currentUser)
app.use(requireAuth)
app.use(rabbitMQ);
app.use(userActionsRouter);
app.use(getProfileRouter);
app.use(adminRouter)
app.use(hireMusicianRouter)
app.use(errorHandler);

module.exports = app;
