import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../../../api/axiosInstance';


export const doctorGetSlots = createAsyncThunk('doctor/getAllSlots', async (slots , {rejectWithValue}) => {
  try {
    let response = await instance.get('doctor/slots');
    return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
})

export const doctorAddSlots = createAsyncThunk('doctor/addSlots', async (slots , { rejectWithValue }) => {
    try {
        const response = await instance.post('doctor/slots', slots);
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})


export const doctorUpdateSlots = createAsyncThunk('doctor/updateSlots', async ({mainSlotId , details}, { rejectWithValue }) => {
  
    try {
        const response = await instance.put(`doctor/${mainSlotId}/slots`, details);
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

export const doctorDeleteSlots = createAsyncThunk('doctor/deleteSlots', async ({mainSlotId , slotId}, { rejectWithValue }) => {
    try {
        const response = await instance.delete(`doctor/${mainSlotId}/slots/${slotId}`);
        return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }   
})

const initialState = {
  loading: false,
  success: false,
  availableSlots: [],
  selectedDateId: null,
  selectedDate: null ,
  selectedSlotId: null,
  startTime: '',
  endTime: '',
  bookedSlot: JSON.parse(localStorage.getItem('bookedSlot')) ?  JSON.parse(localStorage.getItem('bookedSlot')) : null,
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
          const { _id, date } = action.payload;
          state.selectedDateId = _id;
          state.selectedDate = date;
        } ,
        setSelectedSlot: (state, action) => {
          const { id, startTime, endTime } = action.payload;
          state.selectedSlotId = id;
          state.startTime = startTime;
          state.endTime = endTime;
       },
       saveSelectedSlot: (state) => {
         state.bookedSlot = JSON.parse(localStorage.getItem('bookedSlot'));
       },
       clearSelectedSlot: (state) => {
         state.bookedSlot = null;
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
export const { appointmentStateReset , setSelectedSlot , setSelectedDateId  , clearSelectedSlot , saveSelectedSlot} = appointmentSlice.actions;
