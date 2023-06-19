const express = require('express');
const router = express.Router();


const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');


// const Patient = require('../models/patient');
// const Doctor = require('../models/doctor');
// const Speciality = require('../models/speciality');
// const { cloudinary } = require('../utils/cloudinaryHelper');

const Appointments = require('../models/appointment');


const { adminGetAllDoctors, adminDoctorApproval, adminGetAllPatients, approvePatients, adminAddSpeciality, adminEditSpeciality, adminRemoveSpeciality, getSpeciality, getAllAppointments } = require('../controllers/adminController');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Speciality = require('../models/speciality');
const Appointment = require('../models/appointment');


router.get('/get/doctors', isLoggedIn , isAdmin , adminGetAllDoctors)

router.put('/doctor/status/:id', isLoggedIn, isAdmin, adminDoctorApproval)

router.get('/get/patients', isLoggedIn, isAdmin, adminGetAllPatients);

router.put('/patient/status/:id', isLoggedIn ,isAdmin, approvePatients)

router.post('/add/speciality', isLoggedIn , isAdmin , adminAddSpeciality)

router.put('/edit/speciality/:id', isLoggedIn , isAdmin , adminEditSpeciality)

router.put('/speciality/status/:id', isLoggedIn , isAdmin , adminRemoveSpeciality)

router.get('/get/specialities', isLoggedIn , isAdmin , getSpeciality);

router.get('/get/appointments', isLoggedIn, isAdmin, getAllAppointments);

router.get('/get/dashboard',isLoggedIn , isAdmin , async (req, res) => {
    try {
        const doctors = await Doctor.find();
        const patients = await Patient.find();
        const specialities = await Speciality.find();
        const appointments = await Appointment.find();

        res.status(200).json({
            count: [
                {
                    doctors: doctors.length 
                },
                {
                    pateints: patients.length
                },
                {
                    specialities: specialities.length
                },
                {
                    appointments: appointments.length 
                }
            ]
            
        })
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})

router.get('/get/chartdetails',isLoggedIn , isAdmin, async (req, res) => {
    try {

         const specialityCount = await Doctor.aggregate(
            [
                    {
                        '$lookup': {
                        'from': 'specialities', 
                        'localField': 'speciality', 
                        'foreignField': '_id', 
                        'as': 'specialities'
                        }
                    }, {
                        '$unwind': {
                        'path': '$specialities'
                        }
                    }, {
                        '$group': {
                            '_id': '$specialities.name', 
                            'total': {
                                '$sum': 1
                            }
                        }
                    }
            ]
         )
        
         const revenueByDoctor = await Appointment.aggregate([
                {
                    '$lookup': {
                    'from': 'doctors', 
                    'localField': 'doctorId', 
                    'foreignField': '_id', 
                    'as': 'doctor'
                    }
                }, {
                    '$unwind': {
                    'path': '$doctor'
                    }
                }, {
                    '$group': {
                    '_id': '$doctor.fullName', 
                    'total': {
                        '$sum': {
                        '$toDouble': '$fees'
                        }
                    }
                    }
                }
         ])
        
         const appointmentsBySpeciality = await Appointment.aggregate(
            [
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
                    'from': 'specialities', 
                    'localField': 'doctor.speciality', 
                    'foreignField': '_id', 
                    'as': 'specialities'
                    }
                },
                {
                    '$unwind': {
                    'path': '$specialities'
                    }
                },
                {
                    '$group': {
                    '_id': '$specialities.name', 
                    'total': {
                        '$sum': 1
                    }
                    }
                }
            ]
         )

        const yearlyRevenue = await Appointment.aggregate(
                [
                    {
        '$project': {
        'year': {
            '$year': {
            'date': '$selectedDate', 
            'timezone': '+00:00'
            }
        }, 
        'month': {
            '$month': {
            'date': '$selectedDate', 
            'timezone': '+00:00'
            }
        }, 
        'day': {
            '$dayOfMonth': {
            'date': '$selectedDate', 
            'timezone': '+00:00'
            }
        }, 
        'fees': '$fees'
        }
                    },
                    {
                        '$group': {
                        '_id': '$year', 
                        'fees': {
                            '$sum': {
                            '$toDouble': '$fees'
                            }
                        }
                        }
                    }
                ]
        ) 

        const monthlyRevenue = await Appointment.aggregate(
            [
                {
                    '$group': {
                    '_id': {
                        '$month': {
                        'date': '$selectedDate', 
                        'timezone': '+00:00'
                        }
                    }, 
                    'fees': {
                        '$sum': {
                        '$toDouble': '$fees'
                        }
                    }
                    }
                },
                {
                    '$project': {
                    '_id': 0, 
                    'month': {
                        '$switch': {
                        'branches': [
                            {
                            'case': {
                                '$eq': [
                                '$_id', 1
                                ]
                            }, 
                            'then': 'January'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 2
                                ]
                            }, 
                            'then': 'February'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 3
                                ]
                            }, 
                            'then': 'March'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 4
                                ]
                            }, 
                            'then': 'April'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 5
                                ]
                            }, 
                            'then': 'May'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 6
                                ]
                            }, 
                            'then': 'June'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 7
                                ]
                            }, 
                            'then': 'July'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 8
                                ]
                            }, 
                            'then': 'August'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 9
                                ]
                            }, 
                            'then': 'September'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 10
                                ]
                            }, 
                            'then': 'October'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 11
                                ]
                            }, 
                            'then': 'November'
                            }, {
                            'case': {
                                '$eq': [
                                '$_id', 12
                                ]
                            }, 
                            'then': 'December'
                            }
                        ], 
                        'default': 'Unknown'
                        }
                    }, 
                    'fees': 1
                    }
                }
            ]
        )
        
        
        res.status(200).json({
            specialityCount,
            revenueByDoctor,
            appointmentsBySpeciality,
            yearlyRevenue,
            monthlyRevenue
        })

    } catch (err) {

    }
})

module.exports = router;


