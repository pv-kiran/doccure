import React from 'react'
import './DoctorDashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../app/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { logoutDoctor } from '../../app/features/doctor/doctorSlice';




function DoctorDashboard() {
  
    let user = useSelector((state) => {
        return state.auth?.authState
    })

    // let newUser = useSelector((state) => {
    //     return state.doctor?.user
    // })

    // console.log(user);

    // console.log(newUser)
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(user);

    const handleClick = () => {

        localStorage.removeItem('user');
        dispatch(clearAuth());
        dispatch(logoutDoctor());
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

export default DoctorDashboard