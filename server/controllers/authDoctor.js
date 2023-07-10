const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor');
const transporter = require('../utils/emailHelper');
const Notification = require('../models/notification');
const Admin = require('../models/admin');


const registerDoctor = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email: email });
        if (!name || !email || !password) {
            return res.status(400).json({
                errorInfo: 'Please provide all required fields'
            })
        }
        if (doctor) {

            return res.status(409).json({ errorInfo: "user already exist with this email" });

        } else {

            const hashPassword = await bcrypt.hash(password, 10);

            const token = jwt.sign(
                { name: name, email: email },
                
                process.env.SECRET_KEY ,
                {
                    expiresIn: "5m"
                }
            );

            const newDoctor = await Doctor.create({
                name: name,
                email: email,
                password: hashPassword ,
                verifyToken: token
            })

            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Email Verification',
                text: `Hi! There, You have recently visited our website and entered your email.Please follow the given link to verify your email https://doccure-rouge.vercel.app/doctor/verify/${token}
                Link will expire in 5 minutes`
            };


            await transporter.sendMail(mailOptions);

            newDoctor.password = undefined;
            newDoctor.verifyToken = undefined;

            const admin = await Admin.findOne({});

            const newNotification = await Notification.create({
                    recipient: admin._id,
                    recipientType: 'Admin' ,
                    sender: newDoctor._id,
                    senderType: 'Doctor',
                    message: 'New Doctor registered' 
            });

            return res.status(201).json({
                user: newDoctor,
                notification:newNotification
            })

        }
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal server error'
        })
    }
}

const verifyDoctorEmail = async (req, res) => {
    const { token } = req.params;
    try {
        let decodeInfo = jwt.verify(token, process.env.SECRET_KEY)
        const email = decodeInfo.email;
        const doctor = await Doctor.find({ email: email });

        if (doctor[0].isVerified) {
            return res.status(409).json({
              message: 'Email is alredy verified'
            })
        } else {


            if (doctor[0].verifyToken === token) {

                doctor[0].isVerified = true;
                doctor[0].verifyToken = undefined;
                await doctor[0].save();
                return res.status(200).json({
                message: 'Email is succesfully verified'
                })
            
            } else {
                return res.status(400).json({
                    errorInfo: 'Token expired or wrong token'
                })
            }

        }

       
    } catch (err) {
        res.status(400).json({
            error: 'Token expired wrong token'
        })
    }
}

const loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {

        const doctor = await Doctor.findOne({ email: email });
        if (doctor) {



            if (!doctor.isVerified) {
                return res.status(401).json({
                    errorInfo: 'Email is not verified'
                })
            }

            if (!doctor.isAdminVerified) {
                return res.status(401).json({
                    errorInfo: 'Admin verification required'
                })
            }

            let isCorrectPassword = await bcrypt.compare(password, doctor.password);
            if (isCorrectPassword) {

                const token = jwt.sign(
                
                    { userId: doctor._id, email: email },
                    
                    process.env.SECRET_KEY,
                    
                    {
                        expiresIn: "2h"
                    }

                );

            
                doctor.password = undefined;
                doctor.token = token;
            
            const options = {
                expires: new Date(
                    Date.now() + 3*24*60*60*1000
                ) ,
                httpOnly: true
            }

            return res.status(200).cookie('token' , token , options).json({
                success: true ,
                user: doctor
            });


                
            } else {
                return res.status(400).json({
                    errorInfo : 'Incorrect password'
                })
            }
            
        } else {
            return res.status(404).json({
                errorInfo: `We didn't recoganize this email`
            })
        }

    } catch (err) {
        res.status(500).json({
            errorInfo :'Internal server error'
        })
    }

}

const resetPasswordDoctor = async (req, res) => {
    const { email } = req.body;
    try {
        const doctor = await Doctor.findOne({ email: email });
        if (doctor) {

            const token = jwt.sign(
                { email: email },
                
                process.env.SECRET_KEY ,
                {
                    expiresIn: "5m"
                }
            );

            doctor.forgotPasswordToken = token;
            await doctor.save();

            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Password reset',
                text: `Hi! Please follow the given link to change your password http://localhost:3000/doctor/reset/password/${token}`
            };

            await transporter.sendMail(mailOptions);     


            res.status(200).json({
                message: 'Check the email for resetting password'
            })

        } else {
            res.status(404).json({
                errorInfo: `User doesn't exist with this email`
            })
        }
    } catch (err) {
        res.status(500).json({
            errorInfo: 'Internal Server error'
        })
    }
    
}

const newPasswordDoctor = async (req, res) => {
    const { password, confirmPassword , passwordToken} = req.body;
    if (password === confirmPassword) {
        
        try {
        
        let decodeInfo = jwt.verify(passwordToken, process.env.SECRET_KEY)
        const email = decodeInfo.email;
        const doctor = await Doctor.findOne({ email: email });
        if (doctor) {
        
            if (doctor.forgotPasswordToken === passwordToken) {


                const hashPassword = await bcrypt.hash(password, 10);

                doctor.password = hashPassword;
                doctor.forgotPasswordToken = undefined;

                await doctor.save();

                return res.status(200).json({
                    message: 'Password updated success'
                })
                    
            } else {
                return res.status(400).json({
                    errorInfo: 'Token expired or wrong token'
                })
            }
            
        } else {
            return res.status(404).json({
                errorInfo: 'User Not found'
            })
        }
            
        } catch (err) {
            return res.status(400).json({
                error: 'Token expired or wrong token'
            })
        }

    } else {
        return res.status(400).json({
            errorInfo: `Please confirm your password`
        })
    }
}

const logoutDoctor = (req,res) => {
    res.status(200).cookie('token' , null , {
        expires: new Date(Date.now()) ,
        httpOnly: true
    }).json({
        success: true ,
        message : 'Logout Success'
    })
}

const getDoctorDetails = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ _id: req.userId });
        res.status(200).json({ doctor });
    } catch (err) {
        res.status(400).json({
            errorInfo: 'Internal Server Error'
        })
    }
}

module.exports = {
    registerDoctor,
    verifyDoctorEmail,
    loginDoctor,
    resetPasswordDoctor,
    newPasswordDoctor,
    getDoctorDetails,
    logoutDoctor
} 