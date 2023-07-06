const express = require('express');
const router = express.Router();

const { isLoggedIn, isPatient, isDoctor } = require('../middlewares/authMiddleware');

const { getMyPatients, getMyDoctors, createDoctorConversation, createPatientConversation, getMyChat } = require('../controllers/chatController');


router.get('/getPatients', isLoggedIn, isDoctor, getMyPatients )

router.get('/getDoctors' , isLoggedIn , isPatient , getMyDoctors)

router.post('/patient/create/:doctorId' , isLoggedIn ,isPatient , createDoctorConversation)

router.post('/doctor/create/:patientId' , isLoggedIn ,isDoctor ,createPatientConversation)

router.get('/mychat', isLoggedIn , getMyChat)

module.exports = router;




