const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const { isLoggedIn, isPatient } = require('../middlewares/authMiddleware');


const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

// const Patient = require('../models/patient');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const { updatePatientProfile, getAllDoctors } = require('../controllers/patientController');


router.put('/profile/update', isLoggedIn, isPatient, updatePatientProfile)

router.get('/doctors/all', getAllDoctors)

router.get('/appointments', isLoggedIn, isPatient, async (req, res) => {
    console.log(req.userId);
        try {
            const appointments = await Appointment.aggregate([
                {
                    $match: { patientId: new mongoose.Types.ObjectId(req.userId) }
                },
                {
                    '$lookup': {
                    'from': 'doctors', 
                    'localField': 'doctorId', 
                    'foreignField': '_id', 
                    'as': 'doctor'
                    }
                },
                {
                    '$unwind': {
                    'path': '$doctor'
                    }
                },
                {
                    '$project': {
                        'doctor.availableSlots': 0 ,
                        'doctor.password': 0,
                        'doctor.services': 0
                    }
                }
            ]);

            console.log(appointments);
            // if (appointments.length === 0) {
            //   return res.status(404).json({
            //       success: false ,
            //       errorInfo: 'No Appointments were found'
            //   })
            // }

            res.status(200).json({ appointments:appointments })

        } catch (err) {
            console.log(err)
            res.status(500).json({
            errorInfo: 'Inernal Server Error'
        })
  }

})

module.exports = router