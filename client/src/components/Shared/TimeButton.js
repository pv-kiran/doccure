import React from 'react'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TimeButton({startTime , endTime , editTimings , editSlot , deleteSlot , _id}) {
  return (
    <Button
        key={_id}
        sx={{
            margin: '.5rem 1.1rem',
            backgroundColor: '#F3F9FF',
            color: '#878180',
            padding: '.3rem .75rem',
            cursor: 'default'
           }}
    >
        {startTime} - {endTime}
        <EditIcon
                  onClick={() => { editSlot(_id ,{ startTime, endTime })}}
                  sx={{ fontSize: '.9rem', marginLeft: '.5rem', cursor: 'pointer' }}
        />
        <DeleteIcon
            onClick = {() => {deleteSlot(_id)}}
            sx={{ fontSize: '.9rem', marginLeft: '.5rem', cursor: 'pointer' }}
        />
    </Button>
  )
}

export default TimeButton