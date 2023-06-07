import React from 'react'
import { Button, Box } from '@mui/material';

function DateButton({date , _id , selectedId , onClickDate}) {
  return (
    <Box key={_id}>
        <Button
            key={_id}
            sx={{
                border: '1px gray dotted',
                color: selectedId === _id ? '#fff' : '#878180',
                width: '9.7rem',
                marginRight: '1.2rem',
                padding: '.5rem 1.5rem',
                backgroundColor: selectedId === _id ? '#FF4877' : 'initial',
            '&:hover': {
                    backgroundColor: selectedId === _id ? '#FF4877' : 'initial',
                }
            }}
            onClick={() => onClickDate(_id)}
        >
            {date.split('T')[0]}
        </Button>
    </Box>
  )
}

export default DateButton