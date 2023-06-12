import React , {useState} from 'react'
import Slider from "react-slick";

import { Box } from '@mui/material';


import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import DateButton from '../Shared/DateButton';
import TimeButton from '../Shared/TimeButton';
import { useDispatch } from 'react-redux';
import { setSelectedSlot } from '../../app/features/appointment/appointmentSlice';

const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
};



function SchedulingCard({ dateArray, dateSlotes, selectedId, onClickDate, editSlot, deleteSlot, role }) {
    
  const [selectedSlotId, setSelectedSlotId] = useState(null);
    
  const dispatch = useDispatch();

  const handleSelect = (id , startTime , endTime) => {
      // setSelectedSlotId(id);
    dispatch(setSelectedSlot({ id, startTime, endTime }));
  };

  return (
    <Box sx={{
        // width: '94%',
        border: '1px gray dotted',
        borderRadius: '.5rem' ,
        margin: 'auto',
        marginTop: '2rem',
      }}>
        <Box sx={{
          borderBottom: '1px gray dotted',
          padding: '1.5rem 1rem'
        }}>
          <Slider {...settings}>
            {dateArray.length && dateArray.map(({ date, _id }) => (
              <DateButton
                 key={_id}
                date={date}
                _id={_id}
                selectedId={selectedId}
                onClickDate={onClickDate}
              />
            ))}
          </Slider>
        </Box>
        <Box textAlign='justify' sx={{ padding: '.5rem 0' }}>
          {dateSlotes[0]?.slots && dateSlotes[0]?.slots.map(({ startTime, endTime, status ,_id }) => 
             {
                  const data = { startTime , status , endTime , editSlot , deleteSlot , _id , role , handleSelect , selectedSlotId }
                  return <TimeButton key={_id} {...data}></TimeButton>
             }
          )}
        </Box>
      </Box>
  )
}

export default SchedulingCard