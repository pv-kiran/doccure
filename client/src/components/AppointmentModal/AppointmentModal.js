import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import instance from '../../api/axiosInstance';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function AppointmentModal(props) {
  const { editModalOpen, setEditModalOpen ,handleEditSubmit } = props;

    const [loading, setLoading] = useState(false);
  

    
    const [selectedTimes, setSelectedTimes] = useState({ startTime: null, endTime: null });

    const handleTimeChange = (type, time) => {
        setSelectedTimes((prevSelectedTimes) => ({
        ...prevSelectedTimes,
        [type]: time,
        }));
    };
   

    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
      
    const timeValues = {
        startTime: selectedTimes.startTime ? selectedTimes.startTime.format('hh:mm A') : null,
        endTime: selectedTimes.endTime ? selectedTimes.endTime.format('hh:mm A') : null,
    };
    handleEditSubmit(timeValues) 
    handleEditModalClose();
  };

  

  return (
    <Modal open={editModalOpen} onClose={handleEditModalClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          width: '80%',
          maxWidth: '500px',
        }}
      >
        <Typography
          component="h3"
          sx={{
            textAlign: 'left',
            margin: 0,
            fontSize: '1.2rem',
            marginBottom: '.5rem',
          }}
        >
          Edit your slot
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="Start Time"              
        value={selectedTimes.startTime}
        onChange={(time) => handleTimeChange('startTime', time)}
        sx={{
          marginRight: '.5rem',
          width: '100%',
          marginBottom: '1rem',
        }}
      />
      <TimePicker
        label="End Time"
        value={selectedTimes.endTime}
        onChange={(time) => handleTimeChange('endTime', time)}
        sx={{
          marginRight: '.5rem',
          width: '100%',
        }}
      />
    </LocalizationProvider>
        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            marginTop: '1rem',
            backgroundColor: '#424E82',
            color: '#fff',
          }}
        >
          Save Changes
          {loading && (
            <CircularProgress
              size={28}
              sx={{
                color: '#fff',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Button>
      </Box>
    </Modal>
  );
}

export default AppointmentModal;
