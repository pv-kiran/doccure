
const Patient = require('../models/patient');
const { cloudinary } = require('../utils/cloudinaryHelper');

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

module.exports = {
    updatePatientProfile
}