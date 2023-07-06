const mongoose = require('mongoose');


const { razorpay } = require('../utils/razorpay');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Notification = require('../models/notification');



const getDoctorDetails = async (req, res) => {
    const { id } = req.params;
    try {
      const doctor = await Doctor.find({ _id: id }).populate('speciality')
        .populate(
           {
             path: 'comments.user',
             select: '-password'
           }
        )
        .select('-password');
        
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
}

const initiateAppointment = async (req, res) => {
    
  const patientId = req.userId;   
  
  // todo -check for the slot is booked or not

  

    try {

        // const { doctorId, dateId, slotId, startTime, endTime , fees } = req.body;
      
        const { doctorId, dateId, slotId, startTime, endTime, fees , selectedDate } = req.body;
      

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

        
      

        res.json({ order });
        
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
}

const completeAppointment = async (req, res) => {
    
    const patientId = req.userId;

    try {

      
      const { doctorId, dateId, slotId, startTime, endTime, fees, paymentId, orderId , selectedDate } = req.body;
    
      
      const doctor = await Doctor.findById(doctorId);

      const slot = doctor.availableSlots.find((slot) => slot._id.toString() === dateId);


      if (!slot) {
        return res.status(400).json({ message: 'Slot not available' });
      }

      const selectedSlot = slot.slots.find((slot) => slot._id.toString() === slotId);

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
            selectedDate,
            paymentId
        });

        await appointment.save();
      
        const newNotification = await Notification.create({
            recipient: doctorId,
            recipientType: 'Doctor' ,
            sender: patientId,
            senderType: 'Patient',
            message: 'New Appointment request' 
        });

        res.status(200).json({ appointment , newNotification});
        
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
}

const getAppointmentDetails = async (req, res) => {

     const { id } = req.params;
  
     try {
       
        const appointment = await Appointment.findById(id).populate('doctorId');

        const details = {
          doctorName: appointment?.doctorId?.fullName,
          startTime: appointment?.startTime,
          endTime: appointment?.endTime
        }

        res.status(200).json({ details });
          
     } catch (err) {
       res.status(500).json({
          errorInfo: 'Internal Server Error'
        })
     }
}

const approveAppointment = async (req, res) => {
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

    const newNotification = await Notification.create({
            recipient: appointments[0].patientId,
            recipientType: 'Patient' ,
            sender: appointments[0].doctorId,
            senderType: 'Doctor',
            message: 'Appointment Request has been accepted' 
        });

    res.status(200).json({success: true , appointment: appointments[0] , newNotification})

    } catch (err) {
      res.status(500).json({
        errorInfo : 'Internal Server Error'
      })
    }
}

const cancelAppointment = async (req, res) => {
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


    const timeSlot = dateSlot.slots.find(slot => slot._id.toString() === appointments[0].slotId.toString());


    if (!timeSlot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }



    timeSlot.status = false;

    await doctor.save();


    appointments[0].isCancelled = true;
    await Appointment.findOneAndUpdate({ _id: id }, { $set: appointments[0] })
    
    const newNotification = await Notification.create({
        recipient: appointments[0].doctorId,
        recipientType: 'Doctor' ,
        sender: appointments[0].patientId,
        senderType: 'Patient',
        message: 'Appointment Request has been cancelled' 
    });


    res.json({ success: true , appointment : appointments[0] , newNotification  });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while canceling the appointment' });
  }
}

const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(400).json({errorInfo: 'No appointment found'})
        }
        res.status(200).json({ appointment})
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server error'
        })
    }
}


module.exports = {
    initiateAppointment,
    completeAppointment,
    getAppointmentDetails,
    approveAppointment,
    cancelAppointment,
    getDoctorDetails,
    getDetails
}
