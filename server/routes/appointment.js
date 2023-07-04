const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor');
const { isDoctor, isLoggedIn, isPatient } = require('../middlewares/authMiddleware');
const { razorpay } = require('../utils/razorpay');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose');


const { initiateAppointment, completeAppointment, getAppointmentDetails, approveAppointment, cancelAppointment, getDoctorDetails } = require('../controllers/appointmentController');


router.get('/doctor/:id', isLoggedIn, getDoctorDetails);

router.post('/initiate', isLoggedIn, isPatient, initiateAppointment)

router.post('/create', isLoggedIn, isPatient, completeAppointment)

router.get('/:id', isLoggedIn, isDoctor, async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(400).json({errorInfo: 'No appointment found'})
        }
        res.status(200).json({ appointment})
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server error'
        })
    }
})

router.get('/:id/details', isLoggedIn, isPatient, getAppointmentDetails)

router.put('/:id/approve', isLoggedIn, isDoctor, approveAppointment)

router.put('/:id/cancel', isLoggedIn, isPatient, cancelAppointment);








module.exports = router;