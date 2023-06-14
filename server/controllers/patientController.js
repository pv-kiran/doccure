
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');

const { cloudinary } = require('../utils/cloudinaryHelper');

const mongoose = require('mongoose')


const updatePatientProfile = async (req, res) => {

    const { username, gender, phone, houseName, city, state } = req.body;
    // console.log(req.files);
    
    try {

        const patient = await Patient.findOne({ _id: req.userId });
        console.log(patient);

        if(req.files) {
    
            const result = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath , {folder: 'Patients'});
            patient.profilePicture.public_id = result.public_id;
            patient.profilePicture.secure_url = result.secure_url

        }
        
        patient.fullName = username;
        patient.gender = gender;
        patient.phone = phone;
        patient.address = { houseName, city, state };
        
        await patient.save()
        res.status(200).json({
            message: 'Updation success',
            user : patient
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({isAdminVerified: true}).populate('speciality');
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
}

const getMyAppointments = async (req, res) => {
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

}

module.exports = {
    updatePatientProfile,
    getAllDoctors,
    getMyAppointments
}