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
  profilePicture: {
        public_id: {
          type: String
        } , 
        secure_url: {
          type: String
        }
  } ,
  isVerified: {
    type: Boolean ,
    default: false
  },
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
  gender: {
      type: String
  },
  phone: {
      type: String,
  } ,
  fullName: {
      type: String, 
  },
  forgotPasswordToken: {
    type: String
  },
  role: {
    type: String,
    default: 'doctor'
  } ,
  token: {
    type:  String
  }
  
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;