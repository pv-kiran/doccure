const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, 
    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;