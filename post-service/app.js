const express = require("express");
const app = express();
require("express-async-errors");
const errorHandler = require("chordchat-common/src/middlewares/error-handler");

const getCreatePost = require('./src/routes/createPost')
const getPosts = require('./src/routes/getPosts')
const postActions = require('./src/routes/postActions')
const editPost = require('./src/routes/editPost')
const deletePost = require('./src/routes/deletePost')
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const {currentUser,requireAuth} = require('chordchat-common')

app.use(cookieParser())
app.set("trust proxy", true);
// const corsOptions = {
//           origin: ['http://localhost:5173', 'https://chordchat.dev'],
//           optionsSuccessStatus: 200,
//           credentials: true
//         };
const corsOptions = {
  origin: ['http://localhost:5173'],    // reqexp will match all prefixes
  methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
  credentials: true,             
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}
app.options('*', cors(corsOptions))
 app.use(cors(corsOptions));

        
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

        
app.use(currentUser)
app.use(requireAuth)

app.use(getCreatePost)
app.use(postActions)
app.use(editPost)
app.use(getPosts)
app.use(deletePost)

app.use(errorHandler)
module.exports = app;
