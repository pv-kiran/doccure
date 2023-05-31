const express = require('express');
const router = express.Router();
const { cloudinary } = require('../utils/cloudinaryHelper');


const { isLoggedIn, isAdmin } = require('../middlewares/authMiddleware');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');



router.get('/get/doctors', isLoggedIn, isAdmin, async (req, res) => {
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

router.post('/add/speciality', isLoggedIn , isAdmin , async (req, res) => {
    const { name, fees } = req.body;
    try {

        const speciality = await Speciality.findOne({ name: name });
        console.log(speciality);
        let specialityImg;
        if(req.files) {
            const result = await cloudinary.uploader.upload(req.files.specialityImg.tempFilePath , {folder: 'Patients'});
            specialityImg = result
        }
        
        const newSpeciality = await Speciality.create({
            name,
            fees,
            specialityImg
        })
        
        res.status(200).json({
            message: 'Speciality added',
            specialities : newSpeciality
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
})

router.put('/edit/speciality/:id', isLoggedIn , isAdmin , async (req, res) => {
    const { id } = req.params;
    try {

        const speciality = await Speciality.findByIdAndUpdate(id, req.body, {
            new: true,
            upsert: true
        });

        res.status(200).json({
            message: 'Update Success',
            specialities: speciality
        })

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
})

router.put('/speciality/status/:id', isLoggedIn , isAdmin , async (req, res) => {
    const { id } = req.params;
    try {

        const speciality = await Speciality.findOne({ _id: id });
        speciality.isAdminVerified = !speciality.isAdminVerified
        await speciality.save()

        res.status(200).json({
            message: 'Update Success',
            specialities: speciality
        })

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error' ,
            errorInfo: err 
        })
    }
})

router.get('/get/specialities', async (req, res) => {
    try {

        const specialities = await Speciality.find();
        if (specialities.length === 0) {
            return res.status(404).json({
                success: false ,
                errorInfo: 'No specialities are available'
            })
        } else {
            return res.status(200).json({
                success: true,
                specialities: specialities
            })
        }

    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
})


module.exports = router;