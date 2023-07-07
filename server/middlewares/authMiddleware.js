const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Admin = require('../models/admin');


const isLoggedIn = (req,res , next) => {
    const authToken =  req.cookies.token || req.headers['authorization']?.replace('Bearer ' , '') ;
    // console.log(authToken);
    if(!authToken) {
        return res.status(401).json({
            message: 'Token is missing'
        })
    }
    try {

        const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next()

    } catch(e) {
        return res.status(401).json({
            message: 'Invalid Token'
        })
    }

}

const isDoctor = async (req , res , next) => {
    try {
        const user = await Doctor.findOne({_id: req.userId}) ;
        if (user) {
            next();
        } else {
            return res.status(401).json({
                errorInfo: 'You are not authorized to access this resource'
            })
        }
    } catch(e) {
        return res.status(401).json({
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
            return res.status(401).json({
            message: 'You are not authorized to access this resource'
        })
        }

    } catch(e) {
        return res.status(500).json({
            message: 'Internal Server error'
        })
    }

}

const isAdmin = async (req , res , next) => {
    try {
        const user = await Admin.findOne({_id: req.userId}) ;
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
    isPatient,
    isAdmin
}