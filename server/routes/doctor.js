const express = require('express');
const router = express.Router();
// const { cloudinary } = require('../utils/cloudinaryHelper');
// const Doctor = require('../models/doctor');

const { isLoggedIn, isDoctor } = require('../middlewares/authMiddleware');
const { updateDoctorProfile } = require('../controllers/doctorController');


router.put('/profile/update', isLoggedIn, isDoctor, updateDoctorProfile)


module.exports = router