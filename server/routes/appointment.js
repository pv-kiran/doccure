const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor');
const { isDoctor, isLoggedIn, isPatient } = require('../middlewares/authMiddleware');
const { razorpay } = require('../utils/razorpay');
const Appointment = require('../models/appointment');

const mongoose = require('mongoose');



router.get('/slots', isLoggedIn, isDoctor, async (req, res) => { 
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
    console.error(error);
    return res.status(500).json({ errorInfo: 'Server error' });
  }
});


router.post('/slots', isLoggedIn, isDoctor, async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:mainSlotId/slots', isLoggedIn, isDoctor, async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:mainSlotId/slots/:slotId', isLoggedIn, isDoctor, async (req, res) => {
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

    return res.json({ message: 'Slot deleted successfully' , availableSlots: doctor.availableSlots});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:mainSlotId/slots', isLoggedIn , isDoctor , async (req, res) => {
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
    console.log(mainSlotIndex);
    console.log(doctor.availableSlots[mainSlotIndex]);
    doctor.availableSlots.splice(mainSlotIndex, 1);

    await doctor.save();

    return res.status(200).json({ message: 'Slots deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
})


router.get('/doctor/:id', isLoggedIn , async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.find({ _id: id }).populate('speciality');
        if (doctor.length > 0) {
            res.status(200).json({
                doctor: doctor
            })
        } else {
            res.status(404).json({errorInfo: 'Doctor not found'})
        }
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
})

router.post('/initiate', isLoggedIn, isPatient, async (req, res) => {
    
  const patientId = req.userId;   
  
  // todo -check for the slot is booked or not

  

    try {

        // const { doctorId, dateId, slotId, startTime, endTime , fees } = req.body;
      
        const { doctorId, dateId, slotId, startTime, endTime, fees } = req.body;
      

        const appointmentExists = await Appointment.findOne({
            doctorId,
            patientId,
            dateId , 
            slotId,
            startTime,
            endTime
         });

        if (appointmentExists) {
              return res.status(400).json({ errorInfo: 'This slot s already booked' });
      }
      
        const order = await razorpay.orders.create({
            amount: fees * 100, 
            currency: 'INR',
            receipt: "receipt#1"
        });

        console.log(order);

        res.json({ order });
        
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
})

router.post('/create', isLoggedIn, isPatient, async (req, res) => {
    
    const patientId = req.userId;

    try {

        // const { doctorId, dateId, slotId, startTime, endTime , fees } = req.body;
      console.log(req.body);
      
      const { doctorId, dateId, slotId, startTime, endTime, fees, paymentId, orderId } = req.body;
      // const { selectedDateId, selectedSlotId, startTime, endTime, doctorId, fees, paymentId, orderId } = req.body;
      
      const doctor = await Doctor.findById(doctorId);
      console.log(doctor);

      const slot = doctor.availableSlots.find((slot) => slot._id.toString() === dateId);

      console.log(dateId);
      console.log(slot.date);

      if (!slot) {
        return res.status(400).json({ message: 'Slot not available' });
      }

      const selectedSlot = slot.slots.find((slot) => slot._id.toString() === slotId);
      console.log(selectedSlot);

      if (!selectedSlot || selectedSlot.status === true) {
        return res.status(400).json({ message: 'Slot not available' });
      }

      // Mark the slot as booked
      selectedSlot.status = true;

      // Save the changes to the doctor's availableSlots
      await doctor.save();

        const appointmentExists = await Appointment.findOne({
            doctorId,
            patientId,
            dateId , 
            slotId 
         });

        if (appointmentExists) {
              return res.status(400).json({ errorInfo: 'This slot s already booked' });
        }

        // Create a new appointment
        const appointment = new Appointment({
            doctorId,
            patientId,
            dateId ,
            slotId,
            startTime,
            endTime, 
            fees,
            orderId,
            paymentId
        });

        await appointment.save();

        res.status(200).json({ appointment });
        
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
})


router.get('/:id/details', isLoggedIn, isPatient, async (req, res) => {

     const { id } = req.params;
  
     try {
       
        const appointment = await Appointment.findById(id).populate('doctorId');
        console.log(appointment);

        const details = {
          doctorName: appointment?.doctorId?.fullName,
          startTime: appointment?.startTime,
          endTime: appointment?.endTime
        }

        res.status(200).json({ details });
          
     } catch (err) {
        console.log(err);
     }
})

router.put('/:id/approve', isLoggedIn, isDoctor, async (req, res) => {
  const { id } = req.params;
  try {



    const appointments = await Appointment.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
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
    
    if (appointments[0].isApprovedByDoctor) {
      return res.status(400).json({
        errorInfo: 'Already approved by doctor'
      })
    }

    appointments[0].isApprovedByDoctor = true;
    await Appointment.findOneAndUpdate({ _id: id }, { $set: appointments[0] })
    res.status(200).json({success: true , appointment: appointments[0]})

    } catch (err) {
      console.log(err);
      res.status(500).json({
        errorInfo : 'Internal Server Error'
      })
    }
})


router.put('/:id/cancel', isLoggedIn, isPatient, async (req, res) => {
  try {
    const {id} = req.params;

     const appointments = await Appointment.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
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
                        'doctor.password': 0,
                    }
                }
    ]);

    if (appointments.length === 0 ) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointments[0].isCancelled) {
      return res.status(400).json({ error: 'Appointment is already canceled' });
    }

    if (appointments[0].isApprovedByDoctor) {
      return res.status(400).json({ error: 'Appointment is already approved. Cancellation is not allowed' });
    }

    const doctor = await Doctor.findById(appointments[0].doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const dateSlot = doctor.availableSlots.find(slot => slot._id.toString() === appointments[0].dateId.toString());

    if (!dateSlot) {
      return res.status(404).json({ error: 'Date slot not found' });
    }

    console.log(dateSlot);

    const timeSlot = dateSlot.slots.find(slot => slot._id.toString() === appointments[0].slotId.toString());


    if (!timeSlot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }


    console.log(timeSlot);

    timeSlot.status = false;

    await doctor.save();

    console.log(timeSlot);

    appointments[0].isCancelled = true;
    await Appointment.findOneAndUpdate({ _id: id }, { $set: appointments[0] })

    res.json({ success: true , appointment : appointments[0]  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while canceling the appointment' });
  }
});








module.exports = router;