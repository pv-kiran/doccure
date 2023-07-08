const express = require('express');
const router = express.Router();


// auth controllers for doctor
const { registerDoctor, verifyDoctorEmail, loginDoctor, resetPasswordDoctor, newPasswordDoctor, logoutDoctor , getDoctorDetails} = require('../controllers/authDoctor');

//auth controller for patients
const { registerPatient, emailVerifcationPatient, loginPatient, resetPasswordPatient, newPasswordPatient, logoutPatient, getPatientDetails } = require('../controllers/authPatient');


// auth controllers for admin
const { adminLogin, adminLogout } = require('../controllers/authAdmin');
const { isLoggedIn, isDoctor, isPatient } = require('../middlewares/authMiddleware');


// doctor authentication related routes
router.post('/doctor/register', registerDoctor);
router.put('/doctor/verify/:token', verifyDoctorEmail);
router.post('/doctor/login', loginDoctor);
router.put('/doctor/password/reset', resetPasswordDoctor);
router.put('/doctor/password/new', newPasswordDoctor);
router.get('/doctor/logout', logoutDoctor);
router.get('/doctor/details', isLoggedIn, isDoctor, getDoctorDetails)


// patient authentication and related routes
router.post('/patient/register', registerPatient);
router.put('/patient/verify/:token', emailVerifcationPatient );
router.post('/patient/login', loginPatient);
router.put('/patient/password/reset', resetPasswordPatient);
router.put('/patient/password/new', newPasswordPatient);
router.get('/patient/logout', logoutPatient);
router.get('/patient/details', isLoggedIn, isPatient, getPatientDetails)


// admin authentication routes
router.post('/admin/login' , adminLogin)
router.get('/admin/logout', adminLogout)

module.exports = router;