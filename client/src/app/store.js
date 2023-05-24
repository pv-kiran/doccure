import { configureStore } from '@reduxjs/toolkit';

import doctorReducer from './features/doctor/doctorSlice';
import patientReducer from './features/patient/patientSlice';
import authReducer from './features/auth/authSlice';


const store = configureStore({
  reducer: {
    // Add your reducers here
    doctor: doctorReducer,
    patient: patientReducer,
    auth: authReducer
  },
});

export default store;