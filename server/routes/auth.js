const express = require('express');
const router = express.Router();


// auth controllers for doctor
const { registerDoctor, verifyDoctorEmail, loginDoctor, resetPasswordDoctor, newPasswordDoctor, logoutDoctor } = require('../controllers/authDoctor');

//auth controller for patients
const { registerPatient, emailVerifcationPatient, loginPatient, resetPasswordPatient, newPasswordPatient, logoutPatient } = require('../controllers/authPatient');


// auth controllers for admin
const { adminLogin, adminLogout } = require('../controllers/authAdmin');

// doctor authentication related routes
router.post('/doctor/register', registerDoctor);
router.put('/doctor/verify/:token', verifyDoctorEmail);
router.post('/doctor/login', loginDoctor);
router.put('/doctor/password/reset', resetPasswordDoctor);
router.put('/doctor/password/new', newPasswordDoctor);
router.get('/doctor/logout', logoutDoctor);


// patient authentication and related routes
router.post('/patient/register', registerPatient);
router.put('/patient/verify/:token', emailVerifcationPatient );
router.post('/patient/login', loginPatient);
router.put('/patient/password/reset', resetPasswordPatient);
router.put('/patient/password/new', newPasswordPatient);
router.get('/patient/logout', logoutPatient);


// admin authentication routes
router.post('/admin/login' , adminLogin)
router.get('/admin/logout', adminLogout)

module.exports = router;