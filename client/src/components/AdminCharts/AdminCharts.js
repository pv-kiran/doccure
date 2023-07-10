import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import instance from '../../api/axiosInstance';
import  Typography  from '@mui/material/Typography';
import MedicationIcon from '@mui/icons-material/Medication';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import Box from '@mui/material/Box';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import './AdminChart.css'

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Button } from '@mui/material';

function AdminCharts() {

  const [detailsCount, setDetaisCount] = useState([]);
  const [specialityCount, setSpecialityCount] = useState([]);
  const [revenueDoctor, setRevenueDoctor] = useState([]);
  const [specialityAppointment, setSpecicalityAppointment] = useState([]);
  const [revenueMonthly, setRevenueMonthly] = useState([]);
  const [revenueYearly, setRevenueYearly] = useState([]);

  let specialityLabel, specialityData;
  let revenueLabel, revenueData;
  let specialityAppointmentData, specialityAppointmentLabel
  let revenueMonthlyLabel, revenueMonthlyData;
  let revenueYearlyLabel, revenueYearlyData;


  useEffect(() => {
      let user = JSON.parse(localStorage.getItem('user')) ;
           instance.defaults.headers.common = {
           Authorization : `Bearer ${user.token}`
      }
  }, [])


    const fetchDashboardDetails = async () => {
        try {
            const { data }  = await instance.get('/admin/get/dashboard');
            setDetaisCount(data.count);
        } catch (err) {
        }
    }
    const fetchChartDetails = async () => {
       try {
         const { data } = await instance.get('/admin/get/chartdetails');
         setSpecialityCount(data.specialityCount);
         setRevenueDoctor(data.revenueByDoctor);
         setSpecicalityAppointment(data.appointmentsBySpeciality);
         setRevenueMonthly(data.monthlyRevenue)
         setRevenueYearly(data.yearlyRevenue)

       } catch (err) {
       }
    }

    useEffect(() => {
      fetchDashboardDetails();
      fetchChartDetails();

    }, [])


  if (specialityCount.length > 0) {
    specialityData = specialityCount.map(item => item.total);
    specialityLabel = specialityCount.map(item => item._id);
  }

  if (revenueDoctor.length > 0) {
    revenueData = revenueDoctor.map(item => item.total);
    revenueLabel = revenueDoctor.map(item => item._id);
  }

  if (specialityAppointment.length > 0) {
    specialityAppointmentLabel = specialityAppointment.map(item => item._id);
    specialityAppointmentData = specialityAppointment.map(item => item.total);
  }
  if (revenueMonthly.length > 0) {
    revenueMonthlyLabel = revenueMonthly.map(item => item.month);
    revenueMonthlyData = revenueMonthly.map(item => item.fees);
  }
  if (specialityAppointment.length > 0) {
    revenueYearlyLabel = revenueYearly.map(item => item._id);
    revenueYearlyData = revenueYearly.map(item => item.fees);
  }

  const specialityChart = {
      labels: specialityLabel,
      datasets: [
        {
          backgroundColor: [
            '#496b78',
            '#77a395',
            '#8bc9b5' ,
            '#00A6B4',
            '#6800B4'
          ],
          data: specialityData,
          label: "Number of Doctors"
        }
      ]
  };


  const revenueChart = {
    labels: revenueLabel,
    datasets: [
      {
        label: "Revenue by Doctor",
        backgroundColor: "#496b78",
        borderColor: "#496b78",
        data: revenueData,
      },
    ],
  };

  const appointmentBySpeciality = {
  labels: specialityAppointmentLabel,
  datasets: [
    {
      label: "Number of appointments",
      backgroundColor: [
            '#496b78',
            '#77a395',
            '#72e0df',
            '#00A6B4',
            '#6800B4'
      ],
      data: specialityAppointmentData,
    },
  ],
  };

  const monthlyRevenue = {
    labels: revenueMonthlyLabel,
    datasets: [
      {
        label: "Monthly Revenue",
        backgroundColor: "#496b78",
        borderColor: "#496b78",
        data: revenueMonthlyData,
      },
    ],
  };

  const yearlyRevenue = {
    labels: revenueYearlyLabel,
    datasets: [
      {
        label: "Yearly Revenue",
        backgroundColor: "#496b78",
        borderColor: "#496b78",
        data: revenueYearlyData,
      },
    ],
  };

  // docwnloading 
  const printMonthlyDocument = () => {
    const input = document.getElementById('divToPrintMonthly');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("downloadMonthly.pdf");
      });
  }

  const printYearlyDocument = () => {
    const input = document.getElementById('divToPrintYearly');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("downloadYearly.pdf");
      });
  }


  return (
    <>
      <Stack
        direction='row' 
        spacing={3}
        sx={{
            width: {lg: '100%' , md: '100%', sm : '100%' , xs: '17.5rem'} ,
            marginTop: '4rem',
            marginLeft: { lg: '-4rem', md: '1rem', sm: '4rem', xs: '.5rem' },
            '& > :not(style)': {
            width: '13rem',
            height: '5rem',
          }
      }}>
        {
          detailsCount.length > 0 && detailsCount.map((count, index) => {
              let icon;
              if (Object.keys(count)[0] === 'doctors') {
                icon = <MedicationIcon sx={{color: '#579ab5' , fontSize: '2.5rem'}} />
              }
              if (Object.keys(count)[0] === 'pateints') {
                  icon =  <EscalatorWarningIcon sx={{color: '#579ab5' , fontSize: '2.5rem'}}/>
              }
              if (Object.keys(count)[0] === 'specialities') {
                  icon =  <FolderSpecialIcon sx={{color: '#579ab5' , fontSize: '2.5rem'}}/>
              }
              if (Object.keys(count)[0] === 'appointments') {
                icon = <ScheduleIcon sx={{color: '#579ab5' , fontSize: '2.5rem'}}/>
              }
            return (
              <Paper key={index} sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '.5rem'
              }}>
                {
                    icon
                }
                <Stack>
                  <Typography sx={{
                    textTransform: 'capitalize',
                    fontSize: '1.2rem',
                    color: '#579ab5'
                  }}>
                     {Object.keys(count)[0]}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.2rem',
                      color: '#579ab5'
                    }}>
                    {Object.values(count)[0]}
                  </Typography>
                </Stack>
              </Paper>
            )
          })
        }
        
      </Stack>
      <Stack
        direction='row'
        spacing={10}
        sx = {{
            marginLeft: '-4rem',
            width: '95%',
            padding: '1rem 0'
        }}
      >
         <Box sx={{width: '24rem' , padding: '2rem' , overflow: 'hidden'}}>
            <Pie width= '100%' data={specialityChart} />
          </Box>
          <Box sx={{width: '24rem' , height: '25rem' , padding: '2rem' , overflow: 'hidden'}}>
            <Bar width= '100%' data={revenueChart} />
        </Box>
        
      </Stack>
      <Stack
        direction='row'
        spacing={10}
        sx = {{
              marginLeft: '-4rem',
              width: '95%',
              padding: '1rem 0'
        }}
      >
         <Box sx={{width: '24rem'  , padding: '2rem' , overflow: 'hidden'}}>
            <Doughnut width= '100%' data={appointmentBySpeciality} />
         </Box>
         <Box sx={{width: '20rem' , height: '25rem' , padding: '2rem' , overflow: 'hidden'}}>
            <Bar width= '100%' data={monthlyRevenue} />
        </Box>
      </Stack>
      <Stack direction= 'row'>
          <Box sx={{width: '20rem' , height: '25rem' , padding: '2rem' , overflow: 'hidden'}}>
               <Bar width= '100%' data={yearlyRevenue} />
          </Box>
      </Stack>
      <Box sx={{ width: '85%' }}> 

        <Stack direction= 'row' spacing={5} marginBottom={3}>
          <Typography variant='h5'>Monthly Revenue</Typography>
          <Button variant='outline' onClick={printMonthlyDocument}>
            Download
          </Button>
        </Stack>
        <Box id="divToPrintMonthly" sx={{marginBottom: '3rem'}}>
            <table className='table'>
              <tr>
                <th className='th'>Month</th>
                <th className='th'>Revenue</th>
              </tr>
              {
                  revenueMonthly && revenueMonthly.map((revenue) => {
                    return (
                        <tr>
                          <td className='td'>{revenue.month}</td>
                          <td className='td'>{revenue.fees}</td>
                        </tr>
                        
                      )
                  })
              }
            </table>
        </Box>
        

        <Stack direction= 'row' spacing={5} marginBottom={3}>
          <Typography variant='h5'>Yearly Revenue</Typography>
          <Button variant='outline' onClick={printYearlyDocument}>
            Download
          </Button>
        </Stack>
        <Box id="divToPrintYearly">
            <table className='table'>
              <tr>
                <th className='th'>Year</th>
                <th className='th'>Revenue</th>
              </tr>
              {
                  revenueYearly && revenueYearly.map((revenue) => {
                    return (
                        <tr>
                          <td className='td'>{revenue._id}</td>
                          <td className='td'>{revenue.fees}</td>
                        </tr>
                      )
                  })
              }
            </table>
        </Box>


      </Box>
    </>
    
  );
}

export default AdminCharts;
