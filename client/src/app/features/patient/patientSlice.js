import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from './../../../api/axiosInstance';




const initialState = {
  loading: false,
  success: false ,
  user: {} ,
  editSuccess: false ,
  error: ''
}


export const registerPatient = createAsyncThunk('doctor/registerPatient', async (patient, { rejectWithValue }) => {
  
  try {
      const response = await instance.post("/auth/patient/register", patient);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }

})

export const loginPatient = createAsyncThunk('doctor/loginPatient', async (patient, { rejectWithValue }) => {
  
  try {
      const response = await instance.post("/auth/patient/login", patient);
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
         state.user = {};
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

  }
})

export default patientSlice.reducer
export const { registerPatientReset , logginPatientReset  } = patientSlice.actions;