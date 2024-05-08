// const socketIo_Config =  (io) => {
//           let users = []; // Array to store connected users
          
//           // Event listener for new client connection
//           io.on("connect", async (socket) => {
//               console.log("A client connected");
             
        
//               // Event listener for client disconnection
//               socket.on("disconnect", () => {
//                   console.log("A client disconnected");
          
//                   removeUser(socket.id);
//                   io.emit('getUsers', users);
//               });
        
//               // Function to remove user from users array
//               const removeUser = (socketId) => {
//                   users = users.filter(user => user.socketId !== socketId);
//               };
        
//               // Function to add user to users array
//               const addUser = (userId, socketId) => {
//                   !users.some(user => user.userId === userId) &&
//                       users.push({ userId, socketId });
//               };
        
//               // Function to get user from users array
//               const getUser = (userId) => {
//                   return users.find(user => user.userId === userId);
//               };
         
                   
             
        
//               // Event listener for adding user
//               socket.on('addUser', (userId) => {
//                   addUser(userId, socket.id);
//                   console.log('userererer',users);
//                   io.emit('getUsers', users);
                  
//               });
        
//               // Event listener for sending message
            
                        
//                         const orderPlacedStatus = await consumer.ConsumerMessages('notification-queue', 'order-placed-success');
//                         console.log(orderPlacedStatus)
                      
//                           socket.on('check-notification',(message)=>{
                                    
//                                 console.log('inside check notification emitting the thing')
//                                 console.log('emitting the order placed event', orderPlacedStatus);
//                                 io.emit('order-placed-success', orderPlacedStatus); 
                              
//                           })
                           
                  
            
              
             
           
//           });
//         }; 