const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
      },
      date: Date,
      startTime: String,
      endTime: String,
      dateId: {
        type: mongoose.Schema.Types.ObjectId
      },
      slotId: {
        type: mongoose.Schema.Types.ObjectId
      },
      paymentId: {
        type: String,
        required: true
      },
      orderId: {
        type: String,
        required : true
      } ,
      isApprovedByDoctor: {
        type: Boolean,
        default: false
      } ,
      isCancelled: {
        type: Boolean,
        default: false
      }
});


const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
