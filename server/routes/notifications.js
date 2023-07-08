const express = require('express');
const router = express.Router();


const { isAdmin, isLoggedIn, isDoctor, isPatient } = require('../middlewares/authMiddleware');

const { adminGetNotification, doctorGetNotification, readNotification, patientGetNotifcation } = require('../controllers/notificationController');

router.get('/admin', isLoggedIn , isAdmin , adminGetNotification)

router.get('/doctor' , isLoggedIn , isDoctor , doctorGetNotification)

router.get('/patient' , isLoggedIn , isPatient , patientGetNotifcation)

router.put('/mark-read' , isLoggedIn, readNotification);

module.exports = router;