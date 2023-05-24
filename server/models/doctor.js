const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
  verifyToken: {
    type: String,
  },
  isVerified: {
    type: Boolean ,
    default: false
  },
  forgotPasswordToken: {
    type: String
  },
  role: {
    type: String,
    default: 'doctor'
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;