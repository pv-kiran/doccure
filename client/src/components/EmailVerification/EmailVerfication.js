import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import { useEffect, useState } from 'react';

import confirmEmail from '../../assets/confirm-email.webp'
import emailFailure from '../../assets/emailFailure.webp'
import emailLogo from '../../assets/emailLogo.png'

import { Typography } from '@mui/material';

import './EmailVerification.css';

function EmailVerification() {
    const { usertype, token } = useParams();

    const [verificationStatus, setVerificationStatus] = useState('verifying');

    const navigate = useNavigate();

    const emailVerify = async () => {
        try {

            let response;

            if (usertype === 'patient') {
                response = await instance.put(`auth/patient/verify/${token}`)
                setVerificationStatus('success');
                return response.data;
            } else {
                response = await instance.put(`auth/doctor/verify/${token}`)
                setVerificationStatus('success');
                return response.data;
            }

           
        } catch (err) {
            if (err.response.status === 409) {
                navigate('/signin');
            } else {
                setVerificationStatus('failure');
            }
        }
    }

    useEffect(() => {

        const timer = setTimeout(() => {
            emailVerify();   
        }, 3000);

        return () => clearTimeout(timer);
      
      
    } , [token])
    



    return (
        <>
            {
                verificationStatus === 'verifying' &&
                <div className="container">
                    <div className="verification-icon">
                         <img src= {confirmEmail} alt="Verification Icon"/> 
                    </div>
                    <h2>Email Verification</h2>
                        <p className="verification-message">Verifying your email, please wait...
                        </p>
                        <span className="spinner"></span>

                </div>
            }

            {
                verificationStatus === 'failure' && 
                <div className="container">
                    <div className="error-icon">
                    <img src= {emailFailure} alt="Error Icon" />
                    </div>

                    <h2>Email Verification Failed</h2>

                    <p className="error-message">
                        Sorry, unable to verify your email. Please try again or contact support.
                    </p>
                </div>
            }
            {

                verificationStatus === 'success' && 
                <div className="container">
                    <div className="success-icon">
                    <img src={emailLogo} alt="Success Icon"/>
                    </div>

                    <h2>Email Verified Successfully!</h2>

                    <p className="success-message">
                            Thank you for verifying your email. You can now proceed to the login page.
                    </p>


                        <Typography
                            className="login-button"
                            component={Link}
                            to={'/signin'}
                        >
                            Go to Login
                        </Typography>
                </div>

            }
        </>
    )
}

export default EmailVerification