const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel', 
      },
      senderModel: {
        type: String,
        enum: ['Doctor', 'Patient'], 
        required: true,
      },
      // recipient: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   refPath: 'recipientModel', 
      // },
      // recipientModel: {
      //   type: String,
      //   enum: ['Doctor', 'Patient'], 
      //   required: true,
      // },
      content: { type: String, required: true },
  },
  {
     timestamps : true
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
