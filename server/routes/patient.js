const express = require('express');
const router = express.Router();


const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


// const Doctor = require('../models/doctor');
// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors } = require('../controllers/patientController');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

module.exports = router