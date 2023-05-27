const express = require('express');
const router = express.Router();

const { isLoggedIn, isPatient, isDoctor } = require('../middlewares/authMiddleware');

// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile } = require('../controllers/patientController');



router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile )


module.exports = router