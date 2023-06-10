import React, { useState } from 'react';
import { Button, Box, Modal } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

import Stack from '@mui/material/Stack';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import './DoctorSchedulings.css'


import { useEffect } from 'react';
import instance from '../../api/axiosInstance';
import { doctorAddSlots, doctorDeleteSlots, doctorGetSlots, doctorUpdateSlots } from '../../app/features/appointment/appointmentSlice';
import { useDispatch, useSelector } from 'react-redux';


import AppointmentModal from '../AppointmentModal/AppointmentModal';

// todo : remove
// import Slider from "react-slick";
// import DateButton from '../Shared/DateButton';
// import TimeButton from '../Shared/TimeButton';


import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import SchedulingCard from '../Shared/SchedulingCard';




const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0AE4B3',
  fontsize: '2rem',
  marginTop: '.5rem',
  marginLeft: '1rem',
  borderRadius: '0 .8rem .8rem 0',
  padding: '.8rem',
  position:'relative' ,
  color: 'white',
  height: '2.5rem',
  letterSpacing: '2px' ,
  '&:hover': {
    backgroundColor: '#2CE1FE',
  }
}));


const DoctorSchedulings = () => {
 
  const appointmentState = useSelector((state) => {
    return state.appointment
  })

  console.log(appointmentState.availableSlots);

  let dateArray = [];

  if (appointmentState.availableSlots.length > 0) {
     dateArray = appointmentState.availableSlots.map(slot => {
      return {
        date: slot.date,
        _id: slot._id
      };
     });
    dateArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateA - dateB;
    });

    console.log(dateArray);
  }

  

  const [selectedId, setSelectedId] = useState(dateArray.length > 0 ? dateArray[0]._id : null);
  const [slotId, setSlotId] = useState(null);

  useEffect(() => {
    if (dateArray.length > 0) {
      setSelectedId(dateArray[0]._id);
    }
  }, [dateArray.length]);




  // const [selectedId, setSelectedId] = useState(dateArray[0]);


  // todo - move to date button component
  const onClickDate = (_id) => {
     console.log('hello');
     console.log(_id);
    //  dispatch(setSelectedDate(_id));
     setSelectedId(_id);
  };


  const dateSlotes = appointmentState.availableSlots.filter(data => data._id === selectedId) || [];

  // console.log(dateSlots);

  const dispatch = useDispatch();

  useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
    }
  }, [])

  useEffect(() => {
    dispatch(doctorGetSlots());
  } , [])
 
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([{ startTime: null, endTime: null }]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setRows([{ startTime: null, endTime: null }]);
    setIsOpen(false);
  };

  const addRow = () => {
    if (rows.length < 10) {
      setRows((prevRows) => [
        ...prevRows,
        { startTime: null, endTime: null },
      ]);
    }
  };

  const handleTimeChange = (index, fieldName, time) => {
    const newRows = [...rows];
    newRows[index][fieldName] = time;

    if (fieldName === 'startTime') {
      const endTime = time ? dayjs(time).add(30, 'minute') : null;
      newRows[index].endTime = endTime;
    }

    setRows(newRows);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const isAddButtonDisabled = rows.length > 9;


  const [date, setValue] = useState(dayjs());


  const handleSubmit = (event) => {
        event.preventDefault();
        const timeValues = rows.map((row) => ({
          startTime: row.startTime ? row.startTime.format('hh:mm A') : null,
          endTime: row.endTime ? row.endTime.format('hh:mm A') : null,
        }));
    
        const slotDetails = {
          date: date.format('YYYY-MM-DD'),
          slots: timeValues
        }
    
        dispatch(doctorAddSlots(slotDetails));
    
        // console.log(slotDetails);
    
        // console.log(date.format('YYYY-MM-DD'));
        // console.log(timeValues);
        closeModal();
  };


  // edit slots - logic 
  // todo - move to time button
  const [editTimings, setEditTimings] = useState({});

  const editSlot = (id ,timings) => {
    setEditTimings(timings);
    setSlotId(id);
    handleEditModalOpen();
  }

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
 
  const handleEditSubmit = (updatedTimings) => {
    // selectedId - selected date Id
    // slotId - selectedTimeId
    // console.log(updatedTimings);
    // console.log(selectedId);
    // console.log(slotId)
    const slotDetials = {
      mainSlotId: selectedId,
      details: {
        slotId,
        startTime: updatedTimings.startTime,
        endTime: updatedTimings.endTime
      }
    }
    dispatch(doctorUpdateSlots(slotDetials));
  }


  const deleteSlot = (id) => {
      let slotIdDetails = {
        mainSlotId: selectedId,
        slotId: id
      }
    dispatch(doctorDeleteSlots(slotIdDetails));
  }

  const schedulingCardProps = {
    dateArray,
    dateSlotes,
    selectedId,
    onClickDate,
    editSlot,
    deleteSlot,
    role: 'doctor'
  }


  return (
    <Box sx={{
      marginLeft: { lg: '-3rem', md: '-15rem', sm: "-9rem", xs: "1rem" },
      marginTop: '5rem',
      width: '50rem',
      minHeight: '23rem',
      borderRadius: '.5rem',
      padding: '1.5rem'
    }}>
      <Typography variant='h6'>Shedule Timings</Typography>
      <Stack direction= 'row'>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']} sx={{overflow: 'hidden'}}>
                <DatePicker
                  defaultValue={dayjs()}
                  date={date}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  disablePast
                  className="custom-date-picker"
                />
              </DemoContainer>
          </LocalizationProvider>
          <ColorButton onClick={openModal}>
            Add Slots
          </ColorButton>
      </Stack>
       
          <SchedulingCard {...schedulingCardProps}></SchedulingCard>

    
            
      <Modal sx={{paddingTop: '2rem' }}  open={isOpen} onClose={closeModal}>
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            zIndex: 9999,
            maxHeight: '85vh',
            overflowY: 'scroll'
          }}
        >
          <Box
            component="form"
            sx={{
              '& .MuiButton-root': { mr: 1 },
              '& .MuiTextField-root': { mb: 1 },
            }}
            onSubmit={handleSubmit}
          >
            {rows.map((row, index) => (
              <div key={index}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Start Time"
                    value={row.startTime}
                    onChange={(time) =>
                      handleTimeChange(index, 'startTime', time)
                    }
                    sx={{
                      marginRight: '.5rem'
                    }}
                  />
                  <TimePicker
                    label="End Time"
                    value={row.endTime}
                    onChange={(time) =>
                      handleTimeChange(index, 'endTime', time)
                    }
                    minTime={
                      row.startTime
                        ? dayjs(row.startTime).add(30, 'minute')
                        : null
                    }
                  />
                </LocalizationProvider>
                {index > 0 && (
                  <DeleteForeverIcon
                    sx={{
                      color: 'red',
                      margin: '1rem .3rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeRow(index)}
                  />
                )}
              </div>
            ))}
           
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size='small'
              onClick={addRow}
              disabled={isAddButtonDisabled}
            >
              Add New
            </Button>


            <Button type="submit">Submit</Button>
          </Box>
        </Box>
      </Modal>
      <AppointmentModal
        editModalOpen={editModalOpen}
        editTimings={editTimings}
        handleEditSubmit = {handleEditSubmit}
        setEditModalOpen = {setEditModalOpen}
      >
        
      </AppointmentModal>
    </Box>
  );
};

export default DoctorSchedulings;
