// express config
const express = require('express');
const app = express();


// dot env config
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mongodb connection
let { connectDB } = require('./db/connection');

// cors
const cors = require('cors');
app.use(cors({credentials: true , origin: 'http://localhost:3000'}));


const PORT = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('Hello');
})

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);






// establishing connestion to database
connectDB()
.then(() => {
    app.listen(PORT,() => {
      console.log(`App is running @ ${PORT}`);
    })
})
.catch(err => {
  console.log(err);
  console.log('Server is down')
})



