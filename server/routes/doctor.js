const express = require('express');
const router = express.Router();

// const { cloudinary } = require('../utils/cloudinaryHelper');


// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');
// const Speciality = require('../models/speciality');


const { isLoggedIn, isDoctor } = require('../middlewares/authMiddleware');
const { updateDoctorProfile, getSpecialities, getAvailableSlots, addAvailableSlot, updateAvailbleSlot, deleteSlot, deleteDateSlots, getAppointments, getProfile } = require('../controllers/doctorController');


router.get('/profile', isLoggedIn, isDoctor , getProfile)

router.put('/profile/update', isLoggedIn, isDoctor, updateDoctorProfile)

router.get('/specialities', getSpecialities);

router.get('/slots', isLoggedIn, isDoctor, getAvailableSlots);

router.post('/slots', isLoggedIn, isDoctor, addAvailableSlot);

router.put('/:mainSlotId/slots', isLoggedIn, isDoctor, updateAvailbleSlot);

router.delete('/:mainSlotId/slots/:slotId', isLoggedIn, isDoctor, deleteSlot);

router.delete('/:mainSlotId/slots', isLoggedIn , isDoctor , deleteDateSlots)

router.get('/appointments', isLoggedIn, isDoctor, getAppointments)



module.exports = router






























