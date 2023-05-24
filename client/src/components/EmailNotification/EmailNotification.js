import React from 'react'
import './EmailNotification.css';
// import registerLogo from '../../assets/login-banner.png';
import emailVerifyLogo from '../../assets/emailverifyLogo.png'

function EmailNotification() {
    return (
      
        <>
            

            <div className="container">
                <div className="notification-icon">
                    <img src={emailVerifyLogo} alt="Notification Icon">
                    </img>
                </div>

                <h2>Email Verification Sent</h2>

                <p>An email with a verification link has been sent to your email address.</p>

                <a href="https://mail.google.com/" rel='noreferrer' target="_blank" className="button">
                    Check Email
                </a>
            </div>

            
        </>

    
    )
}

export default EmailNotification









  
