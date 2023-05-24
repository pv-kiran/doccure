import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
   const authState = useSelector((state) => {
    return state.auth?.authState;
   })
   return (
     authState ? <Outlet/> : <Navigate to='/signin'/>
   )
}

export default ProtectedRoutes