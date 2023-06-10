import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../api/axiosInstance';


export const doctorGetSlots = createAsyncThunk('doctor/getAllSlots', async (slots , {rejectWithValue}) => {
  // console.log(user);
  try {
    let response = await instance.get('appointment/slots');
    console.log(response.data);
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})

export const doctorAddSlots = createAsyncThunk('doctor/addSlots', async (slots , { rejectWithValue }) => {
    try {
        const response = await instance.post('appointment/slots', slots);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


export const doctorUpdateSlots = createAsyncThunk('doctor/updateSlots', async ({mainSlotId , details}, { rejectWithValue }) => {
  
    try {
        const response = await instance.put(`appointment/${mainSlotId}/slots`, details);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

export const doctorDeleteSlots = createAsyncThunk('doctor/deleteSlots', async ({mainSlotId , slotId}, { rejectWithValue }) => {
    try {
        const response = await instance.delete(`appointment/${mainSlotId}/slots/${slotId}`);
        console.log(response.data); 
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

const initialState = {
  loading: false,
  success: false,
  availableSlots: [],
  selectedDateId: null ,
  selectedSlotId: null,
  startTime: '',
  endTime: '',
  bookedSlot: JSON.parse(localStorage.getItem('bookedSlot')) ?  JSON.parse(localStorage.getItem('user')) : null,
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
        setSelectedDateId: (state, action) => {
            state.selectedDateId = action.payload;
        } ,
        setSelectedSlot: (state, action) => {
          // state.selectedSlotId = action.payload.id;
          // state.startTime = action.payload.startTime;
          // state.endTime = action.payload.endTime
          const { id, startTime, endTime } = action.payload;
          state.selectedSlotId = id;
          state.startTime = startTime;
          state.endTime = endTime;
       },
       saveSelectedSlot: (state) => {
         state.bookedSlot = JSON.parse(localStorage.getItem('bookedSlot'));
       }
    } ,
    extraReducers: builder => {
        builder.addCase(doctorGetSlots.pending, state => {
          state.loading = true;
        })
      
        builder.addCase(doctorGetSlots.fulfilled, (state , action) => {
            state.loading = false;
            state.success = true;
            state.availableSlots = action.payload.availableSlots
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
            state.availableSlots = action.payload.availableSlots
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
            state.availableSlots = action.payload.availableSlots
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
            state.availableSlots = action.payload.availableSlots
            state.error = '';
        })
      
        builder.addCase(doctorDeleteSlots.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload.errorInfo;
        })
    }
})



export default appointmentSlice.reducer
export const { appointmentStateReset , setSelectedSlot , setSelectedDateId } = appointmentSlice.actions;
