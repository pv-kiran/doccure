import Box from '@mui/material/Box'
import React from 'react'
import  Typography  from '@mui/material/Typography';


function BookingInfo({description , info}) {
  return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '.4rem 1.5rem'
      }}>
          <Typography color='gray' variant='subtitle1'>{description }</Typography>
          <Typography variant='subtitle1'>{ info}</Typography>
      </Box>
  )
}

export default BookingInfo