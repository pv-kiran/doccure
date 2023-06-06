import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../api/axiosInstance';


export const doctorGetSlots = createAsyncThunk('doctor/getAllSlots', async (slots , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('doctor/slots');
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})

export const doctorAddSlots = createAsyncThunk('doctor/addSlots', async (slots , { rejectWithValue }) => {
    try {
        const response = await instance.post('doctor/slots', slots);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


export const doctorUpdateSlots = createAsyncThunk('doctor/updateSlots', async ({mainSlotId , details}, { rejectWithValue }) => {
  
    try {
        const response = await instance.put(`doctor/${mainSlotId}/slots`, details);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

export const doctorDeleteSlots = createAsyncThunk('doctor/deleteSlots', async ({mainSlotId , slotId}, { rejectWithValue }) => {
    try {
        const response = await instance.delete(`doctor/${mainSlotId}/slots/${slotId}`);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

const initialState = {
  loading: false,
  success: false,
  appointments: [] ,
  error: ''
}



const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
    reducers: {
        appointmentStateReset: (state) => {
            state.loading = false;
            state.success = false;
            state.error = '';
        },
    } ,
    extraReducers: builder => {
        builder.addCase(doctorGetSlots.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(doctorGetSlots.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.appointments = action.payload.availableSlots
            state.error = '';
        })
      
        builder.addCase(doctorGetSlots.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(doctorAddSlots.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(doctorAddSlots.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.appointments = action.payload.availableSlots
            state.error = '';
        })
      
        builder.addCase(doctorAddSlots.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(doctorUpdateSlots.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(doctorUpdateSlots.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.appointments = action.payload.availableSlots
            state.error = '';
        })
      
        builder.addCase(doctorUpdateSlots.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
        builder.addCase(doctorDeleteSlots.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(doctorDeleteSlots.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.appointments = action.payload.availableSlots
            state.error = '';
        })
      
        builder.addCase(doctorDeleteSlots.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    }
})



export default appointmentSlice.reducer
export const { appointmentStateReset } = appointmentSlice.actions;
