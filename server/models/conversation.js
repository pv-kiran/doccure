const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
      participants: [
          {
            doctor: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Doctor'
            },
            patient: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'Patient'
            }
          } 
          
      ],
      // chatName: {
      //     type: String,
      // },
      latestMessage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",   
      }
  }, 
  {
    timestamps : true
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;