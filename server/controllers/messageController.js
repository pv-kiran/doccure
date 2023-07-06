const Message = require('../models/message');
const Conversation = require('../models/conversation');

const sentMessage = async (req, res) => {
    const { content , role } = req.body;
    try {
        const { chatId  } = req.params;
        const sender = req.userId
       
        const chat = await Conversation.findById(chatId);
        if (!chat) { 
            return res.status(404).json({ error: 'Chat not found' });
        }
        const newMessage = new Message({
            conversation: chatId,
            sender: sender,
            senderModel: role ,
            content: content
        });

        const latestMessage = await newMessage.save()

        const savedMessage = await Message.findById(latestMessage._id)
            .populate({
                    path: 'sender',
                    select: 'name email profilePicture',
            })
            .populate({
                    path: 'conversation',
                    populate: {
                        path: 'participants.doctor participants.patient',
                        select: 'name email profilePicture',
                    }
            })
            


        chat.latestMessage = savedMessage._id;
        await chat.save();
        

        
        return res.status(201).json(savedMessage);
        

    } catch (err) {
        console.log(err);
    }
}

const recieveMessage = async (req, res) => {
    try {

        const { chatId } = req.params;
        console.log(chatId);
 
        const messages = await Message.find({ conversation: chatId })
                .sort({updatedAt: 1})
                .populate({
                    path: 'conversation',
                    populate: {
                        path: 'latestMessage',
                        populate: {
                            path: 'sender',
                            select: 'name email profilePicure'
                        }
                    }
                })
                .populate({
                    path: 'conversation',
                    populate: {
                        path: 'participants.doctor participants.patient',
                        select: 'name email profilePicture',
                    },
                })
                .populate({
                    path: 'sender',
                    select: 'name email profilePicture',
                })
                
            
               
        if (messages.length === 0) {
                return res.status(200).json({ message: 'No messages found in the conversation' });
        }
        
        return res.status(200).json(messages);

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    sentMessage,
    recieveMessage
}