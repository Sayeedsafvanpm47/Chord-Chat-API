function ioConfig(io){
let users = []
const addUser = (userId,socketId)=>{
          !users.some(user=>user.userId == userId) && users.push({userId,socketId})
}
const removeUser = (socketId)=>{
users = users.filter(user=>user.socketId !== socketId)
}
const getUser = (userId)=>{
          return users.find(user=>user.userId == userId)
}
io.on('connection',(socket)=>{
          
         socket.on('addUser',userId=>{
          console.log(`A user has connected ${userId}`)
           addUser(userId,socket.id)
           io.emit('getUsers',users)
         }) 
         socket.on('sendMessage',({senderId,receiverId,text})=>{
          console.log(senderId,'sender')
          console.log(receiverId,'receiver')
          console.log(text,'text')
          console.log(users)
            const user = getUser(receiverId)
            console.log(user,'got user')
              console.log(user?.socketId,'socket id user')
                              io.to(user?.socketId).emit('getMessage',{
                                        senderId,
                                        text
                                     })
                    
           
         })
         socket.on('videoCallInitiated',(data)=>{
          console.log(data.receiverId)
          const user = getUser(data.receiverId)
          io.to(user?.socketId).emit('videoCallAccept',{username:data.username,profilePic:data.profilePic,roomId:data.roomId})
          console.log('emmitted the call event to',user?.socketId)
         })
         socket.on('disconnect',()=>{
          console.log('A user disconnected!')
          removeUser(socket.id)
          io.emit('getUsers',users)     
         })

})
}

module.exports = ioConfig