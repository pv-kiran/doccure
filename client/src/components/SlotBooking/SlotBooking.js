import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import { Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import DoctorCard from '../DoctorCard/DoctorCard';
import SchedulingCard from '../Shared/SchedulingCard';
import DoctorVerticalCard from '../Shared/DoctorVerticalCard';
import  Stack  from '@mui/material/Stack';



function SlotBooking() {
    
    const { id } = useParams();
 
    const [doctor, setDoctors] = useState([]);


    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

    useEffect(() => {
        const fetchDoctor = async (id) => {

            try {
                let { data } = await instance.get(`patient/doctor/${id}`);
                setDoctors(data.doctor);
                // console.log(doctor);
            } catch (err) {
                console.log(err);
            }
        }
        fetchDoctor(id);
    }, [])
    

    let dateArray = [];
    console.log(doctor[0]?.availableSlots);

    if (doctor[0]?.availableSlots) {
        dateArray = doctor[0].availableSlots?.map(slot => {
        return {
            date: slot.date,
            _id: slot._id
        };
        });

        console.log(dateArray)
    }
        
    const [selectedId, setSelectedId] = useState(dateArray.length > 0 ? dateArray[0]._id : null);

    useEffect(() => {
        if (dateArray.length > 0) {
        setSelectedId(dateArray[0]._id);
        }
    }, [dateArray.length]);

    const onClickDate = (_id) => {
        console.log(_id);
        setSelectedId(_id);
    };


  const dateSlotes = doctor[0]?.availableSlots?.filter(data => data._id === selectedId) || [];

    console.log(selectedId);
    console.log(dateSlotes);


    const navBarProps = {
        page: 'home',
        bgColor: '#fff',
        color: 'green'
    }

    const schedulingCardProps = {
        dateArray,
        dateSlotes,
        selectedId,
        onClickDate,
    }

    // console.log(id);
    return (
      <>
        <Navbar {...navBarProps}></Navbar>  
        <Stack direction= 'row'>
            <Box sx={{
                    marginTop: '4rem',
                    height: '50vh',
                    padding: '2rem 1rem',
                    width: '30%'
            }}>
                {
                        doctor.length > 0  && doctor.map((doctor) => 
                            <DoctorVerticalCard key={doctor._id} doctor={doctor}/>
                        )
                }       
            </Box>
                

            <Box sx={{width: '65%' , margin: 'auto' , marginTop: '4rem'}}>
                <SchedulingCard {...schedulingCardProps} />
            </Box> 
                

        </Stack>    
            
      </>
    )
}

export default SlotBooking