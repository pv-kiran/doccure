const mongoose = require('mongoose');

mongoose.set('strictQuery', true);


async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
}

module.exports = {
    connectDB
}