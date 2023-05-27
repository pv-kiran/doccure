
const { cloudinary } = require('../utils/cloudinaryHelper');
const Doctor = require('../models/doctor');


const updateDoctorProfile = async (req, res) => {

    const { username, gender, phone, houseName, city, state } = req.body;
    console.log(username);
    console.log(gender);
    // console.log(req.files);
    
    try {

        const doctor = await Doctor.findOne({ _id: req.userId });
        console.log(doctor);

        if(req.files) {
    
            const result = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath , {folder: 'Patients'});
            doctor.profilePicture.public_id = result.public_id;
            doctor.profilePicture.secure_url = result.secure_url

        }
        
        doctor.fullName = username;
        doctor.gender = gender;
        doctor.phone = phone;
        doctor.address = { houseName, city, state };
        
        await doctor.save()
        res.status(200).json({
            message: 'Updation success',
            user : doctor
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
} 


module.exports = {
    updateDoctorProfile
}