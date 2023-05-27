import React from 'react'
import './PatientDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../app/features/auth/authSlice';
import { logoutPatient } from '../../app/features/patient/patientSlice';
import { useNavigate } from 'react-router-dom';




function PatientDashboard() {
  
    let user = useSelector((state) => {
        return state.auth?.authState
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleClick = () => {

        localStorage.removeItem('user');
        dispatch(clearAuth());
        dispatch(logoutPatient());
        navigate('/');

    }
    
    return (
        <div className="container">
            <h1>Welcome , { user?.name }</h1>
            <button
                className="logout-btn"
                onClick={() => {handleClick()}}
            >
                Logout
            </button>
        </div>
    )
}

export default PatientDashboard