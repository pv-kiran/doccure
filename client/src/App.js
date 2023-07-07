import './App.css';
import instance from './api/axiosInstance';
import { clearAuth } from './app/features/auth/authSlice';

import AppRoutes from './routes';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const authState = useSelector((state) => {
    return state.auth?.authState;
  })
  
  const dispatch = useDispatch();

  // getting the details
  const getDetails = async () => {
    try {
      const { data } = await instance.get(`/auth/${authState?.role}/details`);
      console.log(data);
    } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem('user');
          dispatch(clearAuth())
        }
    }
  }

  // handling token expiration
  useEffect(() => {
    if (authState?.token) {
       let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
       getDetails()
    }
  })

  return (
      <AppRoutes/>
  );
}

export default App;
