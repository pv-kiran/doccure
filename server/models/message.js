const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel', // Dynamic reference based on the senderModel field
  },
  senderModel: {
    type: String,
    enum: ['Doctor', 'Patient'], // Specify the allowed sender models
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel', // Dynamic reference based on the recipientModel field
  },
  recipientModel: {
    type: String,
    enum: ['Doctor', 'Patient'], // Specify the allowed recipient models
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // Other message fields
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
