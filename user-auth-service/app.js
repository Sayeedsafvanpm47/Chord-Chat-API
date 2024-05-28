const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");




const router = require("./src/routes/userRouter");

const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')
const cors = require("cors");

app.use(cookieParser())
app.set("trust proxy", true);

// const corsOptions = {
//           origin: ['http://localhost:5173', 'https://chordchat.dev'],
//           optionsSuccessStatus: 200,
//           credentials: true
//         };
        const corsOptions = {
          origin: ['http://localhost:5173','www.chordchat.site'],    // reqexp will match all prefixes
          methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
          credentials: true,                // required to pass
          allowedHeaders: "Content-Type, Authorization, X-Requested-With",
        }
        // intercept pre-flight check for all routes
        // app.options('*', cors(corsOptions))
        app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
          cookieSession({
            httpOnly:true,
            signed: false,
            secure: true,
            sameSite: 'none',  
            maxAge: 24 * 60 * 60 * 1000 
          })
        );

app.use(router);

app.use(errorHandler);

module.exports = app;
