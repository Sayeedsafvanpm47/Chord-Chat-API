const express = require('express')
const app = express()
const {errorHandler, NotFoundError} = require('chordchat-common')
const router = require('./src/routes/routes')



app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(router)
app.use(errorHandler)



module.exports = app