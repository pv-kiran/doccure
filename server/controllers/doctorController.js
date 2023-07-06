
const { cloudinary } = require('../utils/cloudinaryHelper');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose')


const updateDoctorProfile = async (req, res) => {

    const { username, gender, speciality ,phone, houseName, city, state , services , qualification } = req.body;
    
    
    try {

        const doctor = await Doctor.findOne({ _id: req.userId });

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
        doctor.qualification = qualification;
        
        
        await doctor.save()
        res.status(200).json({
            message: 'Updation success',
            user : doctor
        })

    } catch (err) {
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

const getAvailableSlots = async (req, res) => { 
  try {
    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ errorInfo: 'Doctor not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredSlots = doctor.availableSlots.filter(slot => new Date(slot.date) >= today);

    const availableSlots = filteredSlots.sort((a, b) => new Date(a.date) - new Date(b.date));
;

    return res.json({ availableSlots });
  } catch (error) {
    return res.status(500).json({ errorInfo: 'Server error' });
  }
}

const addAvailableSlot = async (req, res) => {
  try {
    const { date, slots } = req.body;

    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const slotIndex = doctor.availableSlots.findIndex(slot => slot.date.toISOString() === new Date(date).toISOString());
    if (slotIndex === -1) {
      // No slots exist for this date, create a new entry
      doctor.availableSlots.push({ date, slots });
    } else {
      // Slots already exist for this date
      const existingSlots = doctor.availableSlots[slotIndex].slots;

      // Check for duplicate start times
      const existingStartTimes = new Set(existingSlots.map(slot => slot.startTime));
      const hasDuplicateStart = slots.some(newSlot => existingStartTimes.has(newSlot.startTime));

      if (hasDuplicateStart) {
        return res.status(400).json({ message: 'Duplicate start time is not allowed' });
      }

      const existingSlotsCount = existingSlots.length;
      const totalSlotsCount = existingSlotsCount + slots.length;

      if (totalSlotsCount > 10) {
        return res.status(400).json({ message: 'Only 10 slots are allowed per day' });
      }

      // Add the new slots to the existing slots
      existingSlots.push(...slots);
    }

    const result = await doctor.save();

     const today = new Date();
     today.setHours(0, 0, 0, 0);
     const filteredSlots = doctor.availableSlots.filter(slot => new Date(slot.date) >= today);

     const availableSlots = filteredSlots.sort((a, b) => new Date(a.date) - new Date(b.date));
      

    return res.status(201).json({ message: 'Slots added successfully', availableSlots: availableSlots });
      
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

const updateAvailbleSlot = async (req, res) => {
  try {
    const { mainSlotId } = req.params;
    const { slotId, startTime, endTime, status } = req.body;

    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const mainSlot = doctor.availableSlots.find(slot => slot._id.toString() === mainSlotId);

    if (!mainSlot) {
      return res.status(404).json({ message: 'Main slot not found' });
    }

    const slotToUpdate = mainSlot.slots.find(slot => slot._id.toString() === slotId);

    if (!slotToUpdate) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slotToUpdate.startTime = startTime;
    slotToUpdate.endTime = endTime;
    slotToUpdate.status = status || false;

    await doctor.save();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredSlots = doctor.availableSlots.filter(slot => new Date(slot.date) >= today);

     const availableSlots = filteredSlots.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.json({ message: 'Slot updated successfully' , availableSlots: availableSlots});
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

const deleteSlot = async (req, res) => {
  try {
    const { mainSlotId, slotId } = req.params;

    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const mainSlot = doctor.availableSlots.find(slot => slot._id.toString() === mainSlotId);

    if (!mainSlot) {
      return res.status(404).json({ message: 'Main slot not found' });
    }

    const slotIndex = mainSlot.slots.findIndex(slot => slot._id.toString() === slotId);

    if (slotIndex === -1) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    const slotToDelete = mainSlot.slots[slotIndex];

    if (slotToDelete.status) {
      return res.status(400).json({ message: 'Slot deletion is only allowed if status is false' });
    }

    mainSlot.slots.splice(slotIndex, 1);

    await doctor.save();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredSlots = doctor.availableSlots.filter(slot => new Date(slot.date) >= today);

     const availableSlots = filteredSlots.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.json({ message: 'Slot deleted successfully' , availableSlots: availableSlots});
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

const deleteDateSlots = async (req, res) => {
  try {
    const { mainSlotId } = req.params;

    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

     const mainSlotIndex = doctor.availableSlots.findIndex(slot => slot._id.toString() === mainSlotId);

    if (mainSlotIndex === -1) {
      return res.status(404).json({ message: 'Main slot not found' });
    }

    //   doctor.availableSlots[mainSlotIndex].slots = [];
    doctor.availableSlots.splice(mainSlotIndex, 1);

    await doctor.save();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filteredSlots = doctor.availableSlots.filter(slot => new Date(slot.date) >= today);

     const availableSlots = filteredSlots.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.status(200).json({ message: 'Slots deleted successfully' , availableSlots: availableSlots });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
}

const getAppointments = async (req, res) => {

        const { status } = req.query;
        const query = {
          doctorId: new mongoose.Types.ObjectId(req.userId),
          isCancelled: false
        };
  
        if (status === 'pending') {
          query.isApprovedByDoctor = false;
        }
        if (status === 'approved') {
          query.isApprovedByDoctor = true;
        }
   
        if (status === 'cancelled') {
          query.isCancelled = true;
        }
  
        if (status === 'upcoming') {
            const currentDate = new Date();
            const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
            query.selectedDate = { $gte: formattedDate };
        }
        if (status === 'past') {
            const currentDate = new Date();
            const formattedDate = new Date(currentDate.toISOString().split('T')[0]);
            query.selectedDate = { $lt: formattedDate };
        }
        

        try {
            const appointments = await Appointment.aggregate([
                {
                    $match: query
                },
                {
                    '$lookup': {
                    'from': 'patients', 
                    'localField': 'patientId', 
                    'foreignField': '_id', 
                    'as': 'patient'
                    }
                },
                {
                    '$unwind': {
                    'path': '$patient'
                    }
                },
                {
                    '$project': {
                        'patient.password': 0,
                    }
                }
            ]);


            res.status(200).json({ appointments })

        } catch (err) {
            res.status(500).json({
            errorInfo: 'Inernal Server Error'
        })
  }

}

module.exports = {
    updateDoctorProfile,
    getSpecialities,
    getAvailableSlots,
    addAvailableSlot,
    updateAvailbleSlot,
    deleteSlot,
    deleteDateSlots,
    getAppointments
}