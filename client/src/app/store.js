import { configureStore } from '@reduxjs/toolkit';

import doctorReducer from './features/doctor/doctorSlice';
import patientReducer from './features/patient/patientSlice';
import authReducer from './features/auth/authSlice';
import adminReducer from './features/admin/adminSlice';
import appointmentReducer from './features/appointment/appointmentSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    doctor: doctorReducer,
    patient: patientReducer,
    auth: authReducer,
    admin: adminReducer,
    appointment: appointmentReducer
  },
});

export default store;