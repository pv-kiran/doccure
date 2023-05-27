const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');



const isLoggedIn = (req,res , next) => {
    console.log(req.cookies)
    const authToken =  req.cookies.token || req.headers['authorization']?.replace('Bearer ' , '') ;
    // console.log(authToken);
    if(!authToken) {
        return res.status(400).json({
            message: 'Token is missing'
        })
    }
    try {

        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        console.log(req.userId);
        next()

    } catch(e) {
        return res.status(400).json({
            message: 'Invalid Token'
        })
    }

}

const isDoctor = async (req , res , next) => {
    console.log(req.userId);
    try {
        const user = await Doctor.findOne({_id: req.userId}) ;
        if (user) {
            next();
        } else {
            return res.status(400).json({
                errorInfo: 'You are not authorized to access this resource'
            })
        }
    } catch(e) {
        return res.status(400).json({
            message: 'Internal Server error'
        })
    }

}

const isPatient = async (req , res , next) => {
    try {
        const user = await Patient.findOne({_id: req.userId}) ;
        if (user) {
            next();
        } else {
            return res.status(400).json({
            message: 'You are not authorized to access this resource'
        })
        }

    } catch(e) {
        return res.status(500).json({
            message: 'Internal Server error'
        })
    }

}

module.exports = {
    isLoggedIn ,
    isDoctor,
    isPatient
}