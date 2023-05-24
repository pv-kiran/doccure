import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authState: JSON.parse(localStorage.getItem('user')) ?  JSON.parse(localStorage.getItem('user')) : null 
}


const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
     setAuth : (state) => {
         state.authState = JSON.parse(localStorage.getItem('user'))
     } ,
     clearAuth: (state) => {
        state.authState = null
     }
   }
})



export default authSlice.reducer
export const { setAuth , clearAuth } = authSlice.actions;