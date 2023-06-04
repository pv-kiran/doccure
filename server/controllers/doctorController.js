
const { cloudinary } = require('../utils/cloudinaryHelper');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');


const updateDoctorProfile = async (req, res) => {

    const { username, gender, speciality ,phone, houseName, city, state , services } = req.body;
    console.log(username);
    console.log(gender);
    console.log(req.files);
    console.log(speciality);

    console.log(services.split(','));
    
    try {

        const doctor = await Doctor.findOne({ _id: req.userId });
        console.log(doctor);

        if(req.files) {
    
            const result = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath , {folder: 'Patients'});
            doctor.profilePicture.public_id = result.public_id;
            doctor.profilePicture.secure_url = result.secure_url

            const pdfResponse = await cloudinary.uploader.upload(req.files.certificate.tempFilePath, { folder: 'Patients' });
            doctor.certificate.public_id = pdfResponse.public_id;
            doctor.certificate.secure_url = pdfResponse.secure_url;

        }
        
        doctor.fullName = username;
        doctor.gender = gender;
        doctor.phone = phone;
        doctor.services = services.split(',');
        doctor.address = { houseName, city, state };
        doctor.speciality = speciality;

        
        
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

const getSpecialities = async (req, res) => {
    try {

        const specialities = await Speciality.find({isAdminVerified: true});
        if (specialities.length > 0) {
            res.status(200).json({
                success: true,
                specialities: specialities
            })
        } else {
            res.status(404).json({
                success: false,
                errorInfo: 'No specialities are available'
            })
        }

    } catch (err) {
        res.status(500).json({
             errorInfo: 'Internal server error'
         })
    }
}


module.exports = {
    updateDoctorProfile,
    getSpecialities
}