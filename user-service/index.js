const app = require('./app')
require('dotenv').config()
const mongoose = require('mongoose')
const {NotFoundError} = require('chordchat-common')




const User = require('./src/models/user')

          // let user = new User({email:'sayd'})
          // await user.save()
          // return user
 

let connection = process.env.MONGO_URI

mongoose.connect(connection)

const db_connect = mongoose.connection
db_connect.once('open',()=>{
          console.log('Database connected successfully!')
    
        try {
          app.listen(3001,()=>{
                    console.log('User service listening to port 3001')
          })
        } catch (error) {
          console.log('error occured in app',error)
        }
})