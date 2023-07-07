import React  from 'react'

import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockClockIcon from '@mui/icons-material/LockClock';


import { useSelector } from 'react-redux';

function TimeButton({ startTime, endTime, status ,editSlot, deleteSlot, _id, role , handleSelect }) {
  
  const appointmentState = useSelector((state) => {
    return state.appointment
  })

  const { selectedSlotId } = appointmentState;
  

  return (
    <Button
        key={_id}
        sx={{
            margin: {lg: '.5rem 1.1rem' , md: '.5rem 1.1rem' , sm:'1rem 1.1rem' , xs: '1rem 1.1rem'},
            backgroundColor: status ? '#889dbf' : selectedSlotId === _id ? '#2CE1FE' : '#F3F9FF' ,
            color: status ? '#fff' : selectedSlotId === _id ? '#fff' : '#878180' ,
            padding: role === 'patient' ? '.5rem 1.3rem' : '.2rem .8rem',
            cursor: 'default' ,
            '&:hover': {
                    backgroundColor: status ? '#889dbf' : selectedSlotId === _id ? '#2CE1FE' : '#F3F9FF' ,
                }
           }}
    >
      {startTime} - {endTime}

      {
        role === 'doctor' && <>
              {
                status ? <LockClockIcon fontSize='small' sx={{marginLeft: '1.5rem'}}></LockClockIcon> : <>
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
            </>
      }
      {
        role === 'patient' && <>
          {
            status ?
              <LockClockIcon fontSize='small' sx={{ marginLeft: '1rem' }}></LockClockIcon> :
              <LockOpenIcon
                  fontSize='small'
                  sx={{
                    marginLeft: '1rem',
                    cursor: 'pointer'
                  }} 
                  onClick={() => {handleSelect(_id , startTime , endTime)}}
              />
          }
        </>
      }
        
    </Button>
  )
}

export default TimeButton