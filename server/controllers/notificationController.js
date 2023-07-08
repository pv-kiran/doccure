const Notification = require('../models/notification');

const adminGetNotification = async (req, res) => {
    try {

        const notification = await Notification.find({ recipient: req.userId , read: false });

        if (notification.length === 0) {
            return res.status(400).json({ errorInfo: 'No Notifications' });
        } 

        res.status(200).json({ notification });

    } catch (err) {
        res.status(200).json({
            errorInfo:'Internal Server Error'
        })
    }
}

const doctorGetNotification = async (req, res) => {
    try {

        const notification = await Notification.find({ recipient: req.userId , read: false });

        if (notification.length === 0) {
            return res.status(400).json({ errorInfo: 'No Notifications' });
        } 

        res.status(200).json({ notification });

    } catch (err) {
        res.status(200).json({
            errorInfo:'Internal Server Error'
        })
    }
}

const patientGetNotifcation = async (req, res) => {
    try {

        const notification = await Notification.find({ recipient: req.userId  , read: false});

        if (notification.length === 0) {
            return res.status(400).json({ errorInfo: 'No Notifications' });
        } 

        res.status(200).json({ notification });

    } catch (err) {
        res.status(200).json({
            errorInfo:'Internal Server Error'
        })
    }
}

const readNotification = async (req, res) => {
  try {
    // Find notifications to be marked as read
    const notificationsToUpdate = await Notification.find({ recipient: req.userId , read: false });

    // Update the notifications to mark them as read
    await Notification.updateMany({ recipient: req.userId , read: false }, { read: true });

    // Fetch the updated notifications
      const notification = await Notification.find({ _id: req.userId  }).populate('sender')
          ;

    res.status(200).json({ message: 'Notifications marked as read.', notification });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while marking notifications as read.' });
  }
}
    
module.exports = {
    adminGetNotification,
    doctorGetNotification,
    patientGetNotifcation,
    readNotification
}