const express = require('express');
const router = express.Router();

const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');
// const mongoose = require('mongoose')
// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors, getMyAppointments } = require('../controllers/patientController');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

router.get('/appointments', isLoggedIn, isPatient, getMyAppointments)

router.put('/doctor/:id/like', isLoggedIn, isPatient, async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findOne({
            doctorId: id,
            patientId: req.userId,
            isApprovedByDoctor: true
        }).populate('doctorId');

        if (appointment) {

            const doctor = await Doctor.findOne({ _id: id }).populate('speciality');
            if (doctor.likes.user.includes(req.userId)) {
                console.log('User already liked');
                return res.status(404).json({
                    success: false,
                    errorInfo: 'User already liked'
                })
            } else {
                doctor.likes.number = (doctor.likes.number || 0) + 1;
                doctor.likes.user.push(req.userId);

                await doctor.save();

                return res.status(200).json({
                    success: true,
                    message: 'Thanks for like',
                    doctor
                })

            }

        }

        else {
            res.status(400).json({
                success: false,
                errorInfo : 'Only patient who got an appointment can like'
            })
        }
    
       
        
        
        
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})

router.put('/doctor/:id/rating', isLoggedIn, isPatient, async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    console.log(rating);
    try {
        const appointment = await Appointment.findOne({
            doctorId: id,
            patientId: req.userId,
            isApprovedByDoctor: true
        }).populate('doctorId');

        if (appointment) {

            const doctor = await Doctor.findOne({ _id: id }).populate('speciality');
            console.log(doctor);
            if (doctor.ratings.user.includes(req.userId)) {
                console.log(doctor.ratings.user);
                console.log('User already rated');
                return res.status(404).json({
                    success: false,
                    errorInfo: 'User already rated'
                })
            } else {
                console.log(typeof rating)
                console.log(doctor.ratings);

                if (doctor.ratings.user.length === 0) {
                    console.log(doctor.ratings.user.length)
                    doctor.ratings.user.push(req.userId);
                    doctor.ratings.number = rating;
                } else {
                    console.log(doctor.ratings.number) 
                    doctor.ratings.user.push(req.userId);
                    const doctorRating = Math.floor((doctor.ratings.number + rating) / doctor.ratings.user.length);
                    doctor.ratings.number = doctorRating;
                }
                
                await doctor.save();

                return res.status(200).json({
                    success: true,
                    message: 'Thanks for like',
                    doctor
                })

            }

        }

        else {
            res.status(400).json({
                success: false,
                errorInfo : 'Only patient who got an appointment can like'
            })
        }
    
       
        
        
        
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})

module.exports = router