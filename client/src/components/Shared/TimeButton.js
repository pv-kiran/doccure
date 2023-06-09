import React  from 'react'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useSelector } from 'react-redux';

function TimeButton({ startTime, endTime, editSlot, deleteSlot, _id, role , handleSelect }) {
  
  const appointmentState = useSelector((state) => {
    return state.appointment
  })

  const { selectedSlotId } = appointmentState;

  return (
    <Button
        key={_id}
        sx={{
            margin: '.5rem 1.1rem',
            // backgroundColor: '#F3F9FF',
            backgroundColor: selectedSlotId === _id ? '#2CE1FE' : '#F3F9FF' ,
          // color: '#878180',
            color: selectedSlotId === _id ? '#fff' : '#878180' ,
            padding: role === 'patient' ? '.5rem 1.3rem' : '.2rem .8rem',
            cursor: 'default'
           }}
    >
      {startTime} - {endTime}

      {
        role === 'doctor' && <>
            <EditIcon
                      onClick={() => { editSlot(_id ,{ startTime, endTime })}}
                      sx={{ fontSize: '.9rem', marginLeft: '.5rem', cursor: 'pointer' }}
            />
            <DeleteIcon
                onClick = {() => {deleteSlot(_id)}}
                sx={{ fontSize: '.9rem', marginLeft: '.5rem', cursor: 'pointer' }}
            />
            </>
      }
      {
        role === 'patient' && <LockOpenIcon
              fontSize='small'
              sx={{
                marginLeft: '1rem',
                cursor: 'pointer'
              }} 
              onClick={() => {handleSelect(_id)}}
          />
      }
        
    </Button>
  )
}

export default TimeButton