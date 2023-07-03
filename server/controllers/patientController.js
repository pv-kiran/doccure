const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const Notification = require('../models/notification');


const { cloudinary } = require('../utils/cloudinaryHelper');
const mongoose = require('mongoose');

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
    // let { limit, skip, specialities } = req.query;

    let { limit, skip, specialities, gender, dates } = req.query;
    
    console.log(limit);
    console.log(skip);
    console.log(gender);
    console.log(dates);

    let query = { isAdminVerified: true };

    if (gender) {
        query.gender = gender;
    }
    

    if (specialities) {
        specialities = specialities.split(',');
        query.speciality = { $in: specialities }
    }
    // console.log(req.query);

    console.log(query);

    try {
        let doctors = await Doctor.find(query).skip(parseInt(skip)).limit(parseInt(limit)).populate('speciality');


        if (dates) {

            // formating the dates
            const dateObj = new Date(dates);
            dateObj.setUTCDate(dateObj.getUTCDate() + 1);
            const year = dateObj.getUTCFullYear();
            const month = dateObj.getUTCMonth() + 1; 
            const day = dateObj.getUTCDate() ;
            const formattedDate = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000Z`).toISOString();
            console.log(formattedDate); 

            doctors = doctors.filter(doctor =>
                doctor.availableSlots.some(slot => slot.date.toISOString() === formattedDate)
            );
            
        }


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
        const { status } = req.query;
        const query = {
            patientId: new mongoose.Types.ObjectId(req.userId) ,
            isCancelled: false
        }
        if (status === 'pending') {
            query.isApprovedByDoctor = false
        }
        if (status === 'approved') {
            query.isApprovedByDoctor = true
        }
        if (status === 'cancelled') {
            query.isCancelled = true
        }

        if (status === 'upcoming') {
            // const dateObj = new Date();
            const currentDate = new Date();
            const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
            query.selectedDate = { $gte: formattedDate };
            // query.selectedDate = {$gte : dateObj}
        }
        if (status === 'past') {
            // const dateObj = new Date();
            const currentDate = new Date();
            const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
            query.selectedDate = { $lt: formattedDate };
            // query.selectedDate = {$gte : dateObj}
        }
    
    console.log(query);
    
        try {
            const appointments = await Appointment.aggregate([
                {
                    $match: query
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


            res.status(200).json({ appointments:appointments })

        } catch (err) {
            console.log(err)
            res.status(500).json({
             errorInfo: 'Inernal Server Error'
            })
        }

}

const likeHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findOne({
            doctorId: id,
            patientId: req.userId,
            isApprovedByDoctor: true
        }).populate('doctorId');

        if (appointment) {

            const doctor = await Doctor.findOne({ _id: id }).populate('speciality');
            if (doctor.likes.user.includes(req.userId)) {
                console.log('User already liked');
                return res.status(404).json({
                    success: false,
                    errorInfo: 'User already liked'
                })
            } else {
                doctor.likes.number = (doctor.likes.number || 0) + 1;
                doctor.likes.user.push(req.userId);

                await doctor.save();

                const newNotification = await Notification.create({
                    recipient: doctor._id,
                    recipientType: 'Doctor' ,
                    sender: req.userId,
                    senderType: 'Patient',
                    message: 'Liked by Patient' 
                });
                console.log(newNotification);

                return res.status(200).json({
                    success: true,
                    message: 'Thanks for like',
                    doctor,
                    newNotification
                })

            }

        }

        else {
            res.status(400).json({
                success: false,
                errorInfo : 'Only patient who got an appointment can like'
            })
        }

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
}

const ratingHandler = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    console.log(rating);
    try {
        const appointment = await Appointment.findOne({
            doctorId: id,
            patientId: req.userId,
            isApprovedByDoctor: true
        }).populate('doctorId');

        if (appointment) {

            const doctor = await Doctor.findOne({ _id: id }).populate('speciality');
            console.log(doctor);
            if (doctor.ratings.user.includes(req.userId)) {
                console.log(doctor.ratings.user);
                console.log('User already rated');
                return res.status(404).json({
                    success: false,
                    errorInfo: 'User already rated'
                })
            } else {
                console.log(typeof rating)
                console.log(doctor.ratings);

                if (doctor.ratings.user.length === 0) {
                    console.log(doctor.ratings.user.length)
                    doctor.ratings.user.push(req.userId);
                    doctor.ratings.number = rating;
                } else {
                    console.log(doctor.ratings.number) 
                    doctor.ratings.user.push(req.userId);
                    const doctorRating = Math.floor((doctor.ratings.number + rating) / doctor.ratings.user.length);
                    doctor.ratings.number = doctorRating;
                }
                
                await doctor.save();

                const newNotification = await Notification.create({
                    recipient: doctor._id,
                    recipientType: 'Doctor' ,
                    sender: req.userId,
                    senderType: 'Patient',
                    message: 'Rated by Patient' 
                });

                console.log(newNotification);

                return res.status(200).json({
                    success: true,
                    message: 'Thanks for like',
                    doctor,
                    newNotification
                })

            }

        }

        else {
            res.status(400).json({
                success: false,
                errorInfo : 'Only patient who got an appointment can like'
            })
        }
    
       
        
        
        
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal Server Error'
        })
    }
}

const commentHandler = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        const appointment = await Appointment.findOne({
            doctorId: id,
            patientId: req.userId
        })
        if (!appointment) {
            res.status(400).json({
                errorInfo: 'No appointments found'
            })
        }
        let doctor = await Doctor.findOne({ _id: appointment.doctorId })
            .select('-password')
            .populate({
               path: 'speciality'
            });
        
        
        
        if (!doctor) {
            res.status(400).json({
                errorInfo: 'No doctor found'
            })
        }
        
        if (doctor.comments.some(item => item.user == req.userId)) {
            doctor.comments = doctor.comments.map((item) => {
                if (item.user == req.userId) {
                    return { ...item , comment : comment}
                }
                return item;
            })

            await doctor.save();

            await doctor.populate({
                 path: 'speciality comments.user' 
            })

            const newNotification = await Notification.create({
                    recipient: doctor._id,
                    recipientType: 'Doctor' ,
                    sender: req.userId,
                    senderType: 'Patient',
                    message: 'Commented by Patient' 
            });
           

            return res.status(200).json({
                success: true ,
                doctor,
                newNotification
            })
        }

        doctor.comments.push({ user: req.userId, comment: comment });


        await doctor.save();
       
        await doctor.populate({
            path: 'speciality comments.user' 
        })

        res.status(200).json({
            success: true,
            doctor
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo : "Inernal server error"
        })
    }
}

module.exports = {
    updatePatientProfile,
    getAllDoctors,
    getMyAppointments,
    likeHandler,
    ratingHandler,
    commentHandler
}