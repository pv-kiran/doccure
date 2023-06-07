const express = require('express');
const router = express.Router();


const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


const Doctor = require('../models/doctor');
// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors } = require('../controllers/patientController');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

router.get('/doctor/:id', isLoggedIn , async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.find({ _id: id }).populate('speciality');
        if (doctor.length > 0) {
            res.status(200).json({
                doctor: doctor
            })
        } else {
            res.status(404).json({errorInfo: 'Doctor not found'})
        }
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
})

module.exports = router