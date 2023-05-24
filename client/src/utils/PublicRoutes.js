import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PublicRoutes() {
    const authState = useSelector((state) => {
    return state.auth.authState;
   })
   console.log(authState);
   return (
     !authState ? <Outlet/> : <Navigate to='/'/>
   )
}

export default PublicRoutes