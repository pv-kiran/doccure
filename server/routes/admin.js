const express = require('express');
const router = express.Router();


const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');


// const Patient = require('../models/patient');
// const Doctor = require('../models/doctor');
// const Speciality = require('../models/speciality');
// const { cloudinary } = require('../utils/cloudinaryHelper');



const { adminGetAllDoctors, adminDoctorApproval, adminGetAllPatients, approvePatients, adminAddSpeciality, adminEditSpeciality, adminRemoveSpeciality, getSpeciality, getAllAppointments , getChartDetails , getDashboardDetails } = require('../controllers/adminController');

router.get('/get/doctors', isLoggedIn , isAdmin , adminGetAllDoctors)

router.put('/doctor/status/:id', isLoggedIn, isAdmin, adminDoctorApproval)

router.get('/get/patients', isLoggedIn, isAdmin, adminGetAllPatients);

router.put('/patient/status/:id', isLoggedIn ,isAdmin, approvePatients)

router.post('/add/speciality', isLoggedIn , isAdmin , adminAddSpeciality)

router.put('/edit/speciality/:id', isLoggedIn , isAdmin , adminEditSpeciality)

router.put('/speciality/status/:id', isLoggedIn , isAdmin , adminRemoveSpeciality)

router.get('/get/specialities', isLoggedIn , isAdmin , getSpeciality);

router.get('/get/appointments', isLoggedIn, isAdmin, getAllAppointments);

router.get('/get/dashboard',isLoggedIn , isAdmin , getDashboardDetails)

router.get('/get/chartdetails',isLoggedIn , isAdmin, getChartDetails)

module.exports = router;


