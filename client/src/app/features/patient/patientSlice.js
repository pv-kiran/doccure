import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from './../../../api/axiosInstance';
import axios from 'axios';


const initialState = {
  loading: false,
  success: false ,
  user: {} ,
  error: ''
}


export const registerPatient = createAsyncThunk('patient/registerPatient', async (patient, { rejectWithValue }) => {
  
  try {
      const response = await instance.post("/auth/patient/register", patient);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

})

export const loginPatient = createAsyncThunk('patient/loginPatient', async (patient, { rejectWithValue }) => {
  
  try {
      // const response = await instance.post("/auth/patient/login", patient);
      //   return response.data;
    const response = await axios.post('http://localhost:4000/api/auth/patient/login', patient );

    return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

})

export const updatePatient = createAsyncThunk('patient/updatePatient', async (form, { rejectWithValue }) => {
  
  try {
    let response = await instance.put('/patient/profile/update', form, {
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

export const logoutPatient = createAsyncThunk('patient/logoutPatient', async (patient , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('/auth/patient/logout');
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})






const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
     registerPatientReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
     } ,
     logginPatientReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
     },
     updatePatientReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
     }
   } ,
  extraReducers: builder => {


        builder.addCase(registerPatient.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(registerPatient.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            console.log(state);
            console.log(action);

        })
      
        builder.addCase(registerPatient.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
    
        builder.addCase(loginPatient.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(loginPatient.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            state.user = action.payload

        })
      
        builder.addCase(loginPatient.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
        builder.addCase(updatePatient.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(updatePatient.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            state.user = action.payload.user
        })
      
        builder.addCase(updatePatient.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
        builder.addCase(logoutPatient.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(logoutPatient.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true ;
            state.error = '';
            state.user =  {}
        })
      
        builder.addCase(logoutPatient.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })

  }
})

export default patientSlice.reducer
export const { registerPatientReset , logginPatientReset , updatePatientReset  } = patientSlice.actions;