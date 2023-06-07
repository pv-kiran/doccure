import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import instance from '../../api/axiosInstance';
import { Box } from '@mui/material';
import Navbar from '../Navbar/Navbar';
import DoctorCard from '../DoctorCard/DoctorCard';



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
                console.log(doctor);
            } catch (err) {
                console.log(err);
            }
        }

        fetchDoctor(id);

    } , [])

    const navBarProps = {
        page: 'home',
        bgColor: '#fff',
        color: 'green'
    }

    console.log(id);
    return (
      <>
        <Navbar {...navBarProps}></Navbar>    
        <Box sx={{
                marginTop: '5rem',
                height: '50vh',
                padding: '2rem 1rem'
            }}>
          {
                doctor.length > 0  && doctor.map((doctor) => 
                    <DoctorCard key={doctor._id} doctor={doctor}></DoctorCard>
                )
          }       
        </Box>
        <Box>
                
        </Box>    
      </>
    )
}

export default SlotBooking