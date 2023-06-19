const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patient = require('../models/patient');
const transporter = require('../utils/emailHelper');


const registerPatient = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const patient = await Patient.findOne({ email: email });
        if (!name || !email || !password) {
            return res.status(400).json({
                errorInfo: 'Please provide all required fields'
            })
        }
        if (patient) {
            return res.status(400).json({ errorInfo: "user already exist with this email" });
        } else {
            const hashPassword = await bcrypt.hash(password, 10);

            // for verify the email link
            const token = jwt.sign(
                { name: name, email: email },
                process.env.SECRET_KEY,
                {
                    expiresIn: "5m"
                }
            );


            // creating a new patient in the db
            const newPatient = await Patient.create({
                name: name,
                email: email,
                password: hashPassword,
                verifyToken: token
            })

            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Email Verification',
                text: `Hi! There, You have recently visited our website and entered your email.Please follow the given link to verify your email http://localhost:3000/patient/verify/${token}
                Link will expire in 5 minutes`
            };


            await transporter.sendMail(mailOptions);

            newPatient.password = undefined;
            newPatient.verifyToken = undefined;

            return res.status(201).json({
                user: newPatient,
                message: 'Please check your email and verify'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            errorInfo: `Internal server error`
       })
    }
    
}

const emailVerifcationPatient = async (req, res) => {
    const { token } = req.params;
    try {
        let decodeInfo = jwt.verify(token, process.env.SECRET_KEY)
        const email = decodeInfo.email;
        const patient = await Patient.find({ email: email });
        if (patient[0].isVerified) {
            console.log('Hello');
            return res.status(409).json({
                message: 'Email is alredy verified'
            })
        } else {
            if (patient[0].verifyToken === token) {

            patient[0].isVerified = true;
            patient[0].verifyToken = undefined;
            await patient[0].save();
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
            error: 'Token expired'
        })
    }
    
}

const loginPatient  = async (req, res) => {
    const { email, password } = req.body;

    try {

        const patient = await Patient.findOne({ email: email });
        if (patient) {


            if (!patient.isVerified) {
                return res.status(401).json({
                    errorInfo: 'Email is not verified'
                }) 
            }

            if (!patient.isAdminVerified) {
                return res.status(401).json({
                    errorInfo: 'Admin verification required'
                })
            }

            let isCorrectPassword = await bcrypt.compare(password, patient.password);
            if (isCorrectPassword) {

                const token = jwt.sign(
                
                    {
                        userId: patient._id,
                        email: email
                    },
                    
                    process.env.SECRET_KEY,
                    
                    {
                        expiresIn: "2h"
                    }

                );

                console.log(token);

            
                patient.password = undefined;
            
                const options = {
                    expires: new Date(
                        Date.now() + 3 * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true,
                };

                patient.token = token;

                return res.status(200).cookie('token', token, options).json({
                    success: true,
                    user: patient
                });

                
            } else {
                return res.status(400).json({
                    errorInfo: 'Incorrect password'
                })
            }
            
        } else {
            return res.status(404).json({
                errorInfo: `We didn't recoganize this email`
            })
        }

    } catch (err) {
        res.status(500).json({
            message: 'Internal Server error'
        })
    }

}

const resetPasswordPatient = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const patient = await Patient.findOne({ email: email });
        if (patient) {

            const token = jwt.sign(
                { email: email },
                
                process.env.SECRET_KEY,
                {
                    expiresIn: "5m"
                }
            );

            patient.forgotPasswordToken = token;
            await patient.save();

            const mailOptions = {
                from: 'admin@gmail.com',
                to: `${email}`,
                subject: 'Password reset',
                text: `Hi! Please follow the given link to change your password http://localhost:3000/patient/reset/password/${token}`
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

const newPasswordPatient = async (req, res) => {
    const { password, confirmPassword, passwordToken } = req.body;
    console.log(req.body);
    console.log(password);
    if (password === confirmPassword) {
        
        try {
        
            let decodeInfo = jwt.verify(passwordToken, process.env.SECRET_KEY)
            const email = decodeInfo.email;
            const patient = await Patient.findOne({ email: email });
            if (patient) {
        
                if (patient.forgotPasswordToken === passwordToken) {


                    const hashPassword = await bcrypt.hash(password, 10);

                    patient.password = hashPassword;
                    patient.forgotPasswordToken = undefined;

                    await patient.save();

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

const logoutPatient = (req, res) => {
    res.status(200).cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: 'Logout Success'
    })
}

module.exports = {
    registerPatient,
    emailVerifcationPatient,
    loginPatient,
    resetPasswordPatient,
    newPasswordPatient,
    logoutPatient
}