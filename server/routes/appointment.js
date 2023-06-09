const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor');
const { isDoctor, isLoggedIn, isPatient } = require('../middlewares/authMiddleware');
const { razorpay } = require('../utils/razorpay');
const Appointment = require('../models/appointment');




router.get('/slots', isLoggedIn, isDoctor, async (req, res) => { 
  try {
    const doctor = await Doctor.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ errorInfo: 'Doctor not found' });
    }

    const availableSlots = doctor.availableSlots.sort((a, b) => new Date(a.date) - new Date(b.date));
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
      console.log(result);

    return res.status(201).json({ message: 'Slots added successfully', availableSlots: doctor.availableSlots });
      
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

    return res.json({ message: 'Slot updated successfully' , availableSlots: doctor.availableSlots});
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

router.post('/new', isLoggedIn, isPatient, async (req, res) => {
    
    const patientId = req.userId;

    try {

        const { doctorId, dateId, slotId, startTime, endTime } = req.body;

        const appointmentExists = await Appointment.findOne({
            doctorId,
            patientId,
            dateId,
            slotId,
         });

        if (appointmentExists) {
              return res.status(400).json({ errorInfo: 'This slot s already booked' });
        }

        // Create a new appointment
        const appointment = new Appointment({
            doctorId,
            patientId,
            dateId,
            slotId,
            startTime,
            endTime
        });

        // Save the appointment to the database
        await appointment.save();



        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: 100, // Replace with the actual appointment amount
            currency: 'INR',
            receipt: "receipt#1"
        });

        console.log(order);

        // Return the order ID to the client
        res.json({ order });
        
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
})
















module.exports = router;