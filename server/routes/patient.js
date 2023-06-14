const express = require('express');
const router = express.Router();

const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');
// const mongoose = require('mongoose')
// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors, getMyAppointments } = require('../controllers/patientController');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

router.get('/appointments', isLoggedIn, isPatient, getMyAppointments)

module.exports = router