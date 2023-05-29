import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from './../../../api/axiosInstance';



const initialState = {
  loading: false,
  success: false,
  actionSuccess: true ,
  user: {} ,
  error: ''
}


export const loginAdmin = createAsyncThunk('admin/loginAdmin', async (admin , { rejectWithValue }) => {


    try {
      const response = await instance.post("/auth/admin/login", admin);
        return response.data;
        
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


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




const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
     adminLoginStateReset : (state) => {
         state.loading = false;
         state.success = false;
         state.error = '';
    } 
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
  }
})



export default adminSlice.reducer
export const { adminLoginStateReset } = adminSlice.actions;
