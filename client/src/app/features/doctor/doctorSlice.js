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

export const updateDoctor = createAsyncThunk('patient/updateDoctor', async (form, { rejectWithValue }) => {
  
  try {
    let response = await instance.put('/doctor/profile/update', form, {
                headers: {
                     'Content-Type': 'multipart/form-data'
                 },
                // withCredentials: true
    })
    
    // console.log(response.data);
    return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

})

export const logoutDoctor = createAsyncThunk('patient/logoutDoctor', async (patient , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('/auth/doctor/logout');
    console.log(response.data);
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
         state.error = '';
    } ,
    updateDoctorReset : (state) => {
         state.loading = false;
         state.success = false;
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
    
        builder.addCase(updateDoctor.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(updateDoctor.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            state.user = action.payload.user
            console.log(action);
        })
      
        builder.addCase(updateDoctor.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
    
        builder.addCase(logoutDoctor.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(logoutDoctor.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            state.user =  {}
        })
      
        builder.addCase(logoutDoctor.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
  }
})

export default doctorSlice.reducer
export const { registerDoctorReset, logginDoctorReset , updateDoctorReset } = doctorSlice.actions;












