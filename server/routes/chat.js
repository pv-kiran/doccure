const express = require('express');
const { isLoggedIn, isPatient, isDoctor } = require('../middlewares/authMiddleware');

const router = express.Router();

const Appointment = require('../models/appointment');
const mongoose = require('mongoose');


router.get('/getPatients', isLoggedIn, isDoctor, async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
       query = {
                 '$or': [
                        {
                            'patient.fullName': {
                                '$regex': search, 
                                '$options': 'i'
                            }
                        }
                  ]
               }
    }
    const myPatients = await Appointment.aggregate(
        [
            {
               $match: { doctorId: new mongoose.Types.ObjectId(req.userId) }
            } ,
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
                '$lookup': {
                'from': 'patients', 
                'localField': 'patientId', 
                'foreignField': '_id', 
                'as': 'patient'
                }
            },
            {
                '$unwind': {
                'path': '$patient'
                }
            },
            {
                '$project': {
                'doctor': 1, 
                'patient': 1, 
                'doctorId': 1, 
                'patientId': 1
                }
            },
            {
                '$match': query
            } ,
            {
                $project: {
                    doctorId: 1,
                    patientId: 1,
                    patient: 1,
                    patient: {
                        name: 1,
                        fullName: 1
                    }
                }
            }
        ]
    )
    res.status(200).json({ myPatients });
})

router.get('/getDoctors' , isLoggedIn , isPatient , async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = {
                    '$or': [
                        {
                        'doctor.fullName': {
                            '$regex': search, 
                            '$options': 'i'
                        }
                        }
                    ]
        }
    }
    const myDoctors = await Appointment.aggregate(
        [
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
                '$match': query
            },
            {
                $project: {
                    doctorId: 1,
                    patientId: 1,
                    patient: 1,
                    doctor: {
                        name: 1,
                        fullName: 1
                    }
                }
            }
        ]
    )
    res.json({ myDoctors });
})


module.exports = router;