const socketIO = require('socket.io');



  
const socketConnect = (server) => {
    
    const io = socketIO(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
  
    io.on('connection', (socket) => {
    
                socket.on('setup', (userId) => {
                    socket.join(userId);
                })
            
                socket.on('join chat', (room) => {
                  socket.join(room);
                })
            
                socket.on('new message', (newMessage) => {
                        if (!newMessage.conversation.participants) {
                        return;
                        }
                        newMessage.conversation.participants.forEach((participant) => {
                            if (newMessage.senderModel === 'Doctor') {
                            socket.in(participant.patient._id).emit('message recieved' , newMessage );
                            } else {
                            socket.in(participant.doctor._id).emit('message recieved' , newMessage );
                        }
                    })
                })
        
                socket.on('new call', (callLink) => {
                    console.log(callLink);
                    socket.in(callLink.patientId).emit('doctor call' , callLink.personalLink);
                }); 

                socket.on('disconnect', () => {
                     console.log('Hello');
                     console.log('A user disconnected');
                });
            
    });
}

module.exports = socketConnect