const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {

        const admin = await Admin.findOne({ email: email });
        console.log(admin);

        if (admin) {



            let isCorrectPassword = await bcrypt.compare(password, admin.password);
            if (isCorrectPassword) {

                const token = jwt.sign(
                
                    { userId: admin._id, email: email },
                    
                    process.env.SECRET_KEY,
                    
                    {
                        expiresIn: "2h"
                    }

                );

            
                admin.password = undefined;
                admin.token = token;
            
            const options = {
                expires: new Date(
                    Date.now() + 3*24*60*60*1000
                ) ,
                httpOnly: true
            }

            return res.status(200).cookie('token' , token , options).json({
                success: true ,
                user: admin
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

const adminLogout = (req,res) => {
    res.status(200).cookie('token' , null , {
        expires: new Date(Date.now()) ,
        httpOnly: true
    }).json({
        success: true ,
        message : 'Logout Success'
    })
}

module.exports = {
    adminLogin,
    adminLogout
}