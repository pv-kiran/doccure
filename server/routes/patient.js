const express = require('express');
const router = express.Router();

const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');
// const mongoose = require('mongoose')
// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors, getMyAppointments, likeHandler, ratingHandler, commentHandler } = require('../controllers/patientController');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

router.get('/appointments', isLoggedIn, isPatient, getMyAppointments)

router.put('/doctor/:id/like', isLoggedIn, isPatient, likeHandler)

router.put('/doctor/:id/rating', isLoggedIn, isPatient, ratingHandler)

router.put('/doctor/:id/comment', isLoggedIn , isPatient , commentHandler)

// router.get('/doctor/:id/comment', isLoggedIn, isPatient, async (req, res) => {
//     const { id } = req.params;
//     try {

//         const doctor = await Doctor.findOne({ _id: id }).populate({
//             path: 'comments.user',
//             select: '-password'
//         }).select('-password -comments.user.password')
//             ;
//         if (!doctor) {
//             return res.status(400).json({ errorInfo: 'No doctor found'})
//         } 
        
//         res.status(200).json({doctor})

//     } catch (err) {
        
//     }
// })

module.exports = router