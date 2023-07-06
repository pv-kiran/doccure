const express = require('express');
const router = express.Router();

const { isDoctor, isLoggedIn, isPatient, isAdmin } = require('../middlewares/authMiddleware');



const { initiateAppointment, completeAppointment, getAppointmentDetails, approveAppointment, cancelAppointment, getDoctorDetails, getDetails } = require('../controllers/appointmentController');


router.get('/doctor/:id', isLoggedIn, getDoctorDetails);

router.post('/initiate', isLoggedIn, isPatient, initiateAppointment)

router.post('/create', isLoggedIn, isPatient, completeAppointment)

router.get('/:id', isLoggedIn, isDoctor, getDetails)

router.get('/:id/details', isLoggedIn, isPatient, getAppointmentDetails)

router.put('/:id/approve', isLoggedIn, isDoctor, approveAppointment)

router.put('/:id/cancel', isLoggedIn , cancelAppointment);

// router.put('/:id/refund', isLoggedIn, isAdmin, async (req, res) => {
//     const { id } = req.params;
//     try {

//         const appointment = await Appointment.aggregate([
//                 {
//                     $match: { _id: new mongoose.Types.ObjectId(id) }
//                 },
//                 {
//                     '$lookup': {
//                     'from': 'patients', 
//                     'localField': 'patientId', 
//                     'foreignField': '_id', 
//                     'as': 'patient'
//                     }
//                 },
//                 {
//                     '$unwind': {
//                     'path': '$patient'
//                     }
//                 },
//                 {
//                     '$lookup': {
//                     'from': 'doctors', 
//                     'localField': 'doctorId', 
//                     'foreignField': '_id', 
//                     'as': 'doctor'
//                     }
//                 },
//                 {
//                     '$unwind': {
//                     'path': '$doctor'
//                     }
//                 }, 
//                 {
//                     '$project': {
//                         'patient.password': 0,
//                         'doctor.passowrd': 0
//                     }
//                 }
//         ]);

//         console.log(appointment);

//         await razorpay.payments.refund(appointment[0].paymentId,{
//             "amount": appointment[0].fees * 100,
//             "speed": "normal",
//         })

//         appointment[0].isRefund = true;
        

//         await Appointment.findOneAndUpdate({ _id: id }, { $set: appointment[0] })
        
//         res.status(200).json({ appointment });

        

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             errorInfo: 'Internal Server Error'
//         })
//     }
// })




module.exports = router;