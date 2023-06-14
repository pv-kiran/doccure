const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, default: false }
});

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
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speciality'
  } ,
  profilePicture: {
        public_id: {
          type: String
        } , 
        secure_url: {
          type: String
        }
  },
  certificate: {
        public_id: {
          type: String
        } , 
        secure_url: {
          type: String
        }
  },
  services: [
    {
       type: String
    }
  ] ,
  isVerified: {
    type: Boolean ,
    default: false
  },
  isAdminVerified: {
    type: Boolean,
    default: false
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
  gender: {
      type: String
  },
  phone: {
      type: String,
  },
  qualification: {
    type: String
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
  } ,
  availableSlots: [
    {
      date: Date,
      slots: [
        {
          startTime: {
            type: String
          },
          endTime: {
            type: String
          },
          status: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;