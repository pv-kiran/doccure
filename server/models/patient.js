const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    fullName: {
      type: String, 
    },
    gender: {
      type: String
    },
    phone: {
      type: String,
    },
    profilePicture: {
        public_id: {
          type: String
        } , 
        secure_url: {
          type: String
        }
    } ,
    address: {
      houseName: {
        type: String 
      },
      city: {
        type: String
      },
      state: {
        type: String
      }
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
    isAdminVerified: {
      type: Boolean,
      default: false
    } ,
    forgotPasswordToken: {
      type: String
    },
    role: {
      type: String,
      default: 'patient'
  },
  token: {
    type: String
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;