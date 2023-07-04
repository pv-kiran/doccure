// express config
const express = require('express');
const app = express();
const socketIO = require('socket.io');

// dot env config
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mongodb connection
let { connectDB } = require('./db/connection');

// cors
const cors = require('cors');
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// parsing the cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// handling files
const fileupload = require('express-fileupload');
app.use(fileupload({ useTempFiles: true, tempFileDir: '/temp/' }));


const PORT = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('Hello');
})

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const adminRoutes = require('./routes/admin');
const appointmemntRoutes = require('./routes/appointment');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointment', appointmemntRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);




// establishing connestion to database


const connect = async () => {
  try {
    await connectDB();
    let server = app.listen(PORT, () => {
      console.log(`App is running @ ${PORT}`)
    })
    return server;
  } catch (err) {
    console.log(err);
  }
}

connect().then((server) => {
  console.log('Hello')
  // console.log(server);
  const io = socketIO(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
  });
  
  io.on('connection', (socket) => {
 
            socket.on('setup', (userId) => {
              console.log('hello' ,userId);
              console.log('Logged in user', userId);
              socket.join(userId);
            })
        
            socket.on('join chat', (room) => {
              console.log('Joined room' , room);
              socket.join(room);
            })
        
            socket.on('new message', (newMessage) => {
              console.log(newMessage);
                if (!newMessage.conversation.participants) {
                  return;
                }
                newMessage.conversation.participants.forEach((participant) => {
                  if (newMessage.senderModel === 'Doctor') {
                      console.log('sender doctor-->> patient reciever' ,participant.patient._id)
                      socket.in(participant.patient._id).emit('message recieved' , newMessage );
                  } else {
                      console.log('sender patient-->> doctor reciever' ,participant.doctor._id)
                      socket.in(participant.doctor._id).emit('message recieved' , newMessage );
                    }
                })
            })
    
            socket.on('new call', (callLink) => {
              console.log(callLink)
              socket.in(callLink.patientId).emit('doctor call' , callLink.personalLink);
            }); 

        
            socket.on('disconnect', () => {
              console.log('A user disconnected');
            });
        
  });





})
.catch(err => console.log(err));

// connectDB()
// .then(() => {
//    server = app.listen(PORT,() => {
//       console.log(`App is running @ ${PORT}`);
//     })
// })
// .catch(err => {
//   console.log(err);
//   console.log('Server is down')
// })





