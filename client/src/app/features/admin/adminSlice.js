import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from './../../../api/axiosInstance';



const initialState = {
  loading: false,
  success: false,
  user: [] ,
  error: ''
}

// todo : move the api call to the respective component
export const loginAdmin = createAsyncThunk('admin/loginAdmin', async (admin, { rejectWithValue }) => {
  
    console.log(admin);
    try {
      const response = await instance.post("/auth/admin/login", admin);
      console.log(response);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

// todo : move the api call to the respective component
export const logoutAdmin = createAsyncThunk('admin/logoutAdmin', async (admin , {rejectWithValue}) => {
  try {
    let response = await instance.get('/auth/admin/logout');
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})


export const adminGetAllDoctors = createAsyncThunk('admin/getAllDoctors', async (doctor , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('/admin/get/doctors');
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})

export const adminGetAllPatients = createAsyncThunk('admin/getAllPatients', async (patient , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('/admin/get/patients');
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})


export const adminGetSpecialities = createAsyncThunk('admin/getSpecialities', async ( speciality, {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get(`admin/get/specialities`);
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})




const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginStateReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
    }  ,
    addSpecialaity: (state, action) => {
      console.log(action.payload);
       state.user.specialities = [...state.user.specialities, action.payload];
    }, 
    updateSpeciality: (state, action) => {
      console.log(state);
        state.user.specialities = state.user.specialities.map((obj) => {
           if (obj._id === action.payload._id) {
                return action.payload; 
           }
           return obj;
       })
    },
    updateDoctors: (state, action) => {
        state.user.doctors = state.user.doctors.map((obj) => {
           if (obj._id === action.payload._id) {
                return action.payload; 
           }
           return obj;
       })
    },
    updatePatients: (state, action) => {
        state.user.patients = state.user.patients.map((obj) => {
           if (obj._id === action.payload._id) {
                return action.payload; 
           }
           return obj;
       })
    },
  },
  
  extraReducers: builder => {
        builder.addCase(loginAdmin.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(loginAdmin.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload
            state.error = '';
        })
      
    builder.addCase(loginAdmin.rejected, (state, action) => {
          console.log(action.payload)
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    
        builder.addCase(logoutAdmin.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(logoutAdmin.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload
            state.error = '';
        })
      
        builder.addCase(logoutAdmin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(adminGetAllDoctors.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(adminGetAllDoctors.fulfilled, (state , action) => {
            state.loading = false;
            state.actionSuccess = true;
            state.user = action.payload
            state.error = '';
            console.log(action.payload);
        })
      
        builder.addCase(adminGetAllDoctors.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(adminGetAllPatients.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(adminGetAllPatients.fulfilled, (state , action) => {
            state.loading = false;
            state.actionSuccess = true;
            state.user = action.payload
            state.error = '';
        })
      
        builder.addCase(adminGetAllPatients.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(adminGetSpecialities.pending, state => {
          state.loading = true;
          state.actionSuccess = false
        })
      
        builder.addCase(adminGetSpecialities.fulfilled, (state , action) => {
            state.loading = false;
            state.actionSuccess = true;
            state.user = action.payload
            state.error = '';
        })
      
        builder.addCase(adminGetSpecialities.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
  }
  
})



export default adminSlice.reducer
export const { adminLoginStateReset , addSpecialaity , updateSpeciality , updateDoctors , updatePatients} = adminSlice.actions;
