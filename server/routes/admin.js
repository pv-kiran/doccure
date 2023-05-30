const express = require('express');
const router = express.Router();


const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');



router.get('/get/doctors',isLoggedIn , isAdmin , async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if (doctors.length > 0) {
            res.status(200).json({
                success: true,
                doctors: doctors
            })
        } else {
            res.status(404).json({
               errorInfo: 'No Doctors are found'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})
router.put('/doctor/status/:id', isLoggedIn, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
         
        const doctor = await Doctor.findOne({_id : id});
        if (doctor) {
            doctor.isAdminVerified = !doctor.isAdminVerified;
            await doctor.save();
        }

        res.status(200).json({
            success: true ,
            doctor: doctor,
            message: 'Doctor status is updated'
        })

       
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server Error',
            error: err
        })
    }
})


router.get('/get/patients',isLoggedIn , isAdmin , async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients.length > 0) {
            res.status(200).json({
                success: true,
                patients: patients
            })
        } else {
            res.status(404).json({
               errorInfo: 'No Patients are found'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})

router.put('/patient/status/:id', isLoggedIn ,isAdmin, async (req, res) => {

    const { id } = req.params;

    try {

        const patient = await Patient.findOne({_id : id});
        if (patient) {
            patient.isAdminVerified = !patient.isAdminVerified;
            await patient.save();
        }

        res.status(200).json({
            success: true ,
            patient: patient,
            message: 'Doctor status is updated'
        })

       
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server Error',
            error: err
        })
    }
})


module.exports = router;