const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;