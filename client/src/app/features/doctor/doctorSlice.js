import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from './../../../api/axiosInstance';



const initialState = {
  loading: false,
  success: false ,
  user: {} ,
  error: ''
}


export const registerDoctor = createAsyncThunk('doctor/registerDoctor', async (doctor , { rejectWithValue }) => {

    try {
      const response = await instance.post("/auth/doctor/register", doctor);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


export const loginDoctor = createAsyncThunk('doctor/loginDoctor', async (doctor , { rejectWithValue }) => {

    try {
      const response = await instance.post("/auth/doctor/login", doctor);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
     registerDoctorReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
     } ,
     logginDoctorReset : (state) => {
         state.loading = false;
         state.success = false;
         state.user = {};
         state.error = '';
     } 
   } ,
  extraReducers: builder => {
        builder.addCase(registerDoctor.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(registerDoctor.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
        })
      
        builder.addCase(registerDoctor.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
        builder.addCase(loginDoctor.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(loginDoctor.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload
            state.error = '';
        })
      
        builder.addCase(loginDoctor.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
  }
})

export default doctorSlice.reducer
export const { registerDoctorReset, logginDoctorReset } = doctorSlice.actions;












 // return await instance.post('/auth/doctor/register', doctor)
    //     .then(response => response.data)
    //     // .catch(err => console.log(err));