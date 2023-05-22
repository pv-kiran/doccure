const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor');
const transporter = require('../utils/emailHelper');






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

            return res.status(400).json({ errorInfo: "user already exist with this email" });

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
                password: hashPassword
            })

            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Email Verification',
                text: `Hi! There, You have recently visited our website and entered your email.Please follow the given link to verify your email http://localhost:3000/api/auth/doctor/verify/${token}`
            };

            await transporter.sendMail(mailOptions);

            return res.status(201).json({
                user: newDoctor
            })

        }
    } catch (err) {
        res.status(502).json({
            errorInfo : err
        })
    }
}


const verifyDoctorEmail = async (req, res) => {
    const { token } = req.params;
    try {
        let decodeInfo = jwt.verify(token, process.env.SECRET_KEY)
        const email = decodeInfo.email;
        const doctor = await Doctor.find({ email: email });
        if (doctor[0].verifyToken === token) {

             if (doctor[0].isVerified) {
                return res.status(400).json({
                message: 'Email is alredy verified'
                })
            } else {
                doctor[0].isVerified = true;
                doctor[0].verifyToken = undefined;
                await doctor[0].save();
                return res.status(200).json({
                message: 'Email is succesfully verified'
                })
            }
            
        } else {
            return res.status(400).json({
                errorInfo: 'Token expired or wrong token'
            })
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

            let isCorrectPassword = await bcrypt.compare(password, doctor.password);
            if (isCorrectPassword) {

                const token = jwt.sign(
                
                    { patient_id: doctor._id, email: email },
                    
                    process.env.SECRET_KEY,
                    
                    {
                        expiresIn: "2h"
                    }

                );

            
            doctor.password = undefined;
            
            const options = {
                expires: new Date(
                    Date.now() + 3*24*60*60*1000
                ) ,
                httpOnly: true
            }

            return res.status(200).cookie('token' , token , options).json({
                success: true ,
                doctor: doctor
            });


                
            } else {
                return res.status(400).json({
                    errorInfo : 'Incorrect password'
                })
            }
            
        } else {
            return res.status(404).json({
                errorInfo: `User doesn't exist`
            })
        }

    } catch (err) {
        res.status(502).json({
            errorInfo :'Something went wrong'
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
                text: `Hi! Please follow the given link to change your password http://localhost:3000/patient/password/reset/${token}`
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
        res.status(502).json({
            errorInfo: 'Internal Server error'
        })
    }
    
}

const newPasswordDoctor = async (req, res) => {
    const { password, confirmPasssword , passwordToken} = req.body;
    if (password === confirmPasssword) {
        
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
    res.cookie('token' , null , {
        expires: new Date(Date.now()) ,
        httpOnly: true
    })
    res.status(200).json({
        success: true ,
        message : 'Logout Success'
    })
}


module.exports = {
    registerDoctor,
    verifyDoctorEmail,
    loginDoctor,
    resetPasswordDoctor,
    newPasswordDoctor,
    logoutDoctor
} 