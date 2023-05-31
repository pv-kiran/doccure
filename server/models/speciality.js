const mongoose = require('mongoose');

const specialitySchema = new mongoose.Schema({
  
    name: {
        type: String,
        reuired: true
    },

    fees: {
        type: String,
        reuired: true
    },

    specialityImg: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    
    isAdminVerified: {
        type: Boolean,
        default: true
    }
  
});

const Speciality = mongoose.model('Speciality', specialitySchema);

module.exports = Speciality;