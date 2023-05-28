import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from './../DashboardContent/DashboardContent';




function DoctorDashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen((prev) => {
      return !prev
    });
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
    

  const navigationLinks = [
    {
      navItem: 'Dashboard',
      navLink: '/doctor/dashboard'
    } ,
    {
      navItem: 'Patients',
      navLink: '/doctor/mypatients'
    },
    {
      navItem: 'Appointments',
      navLink: '/doctor/appointments'
    },
    {
      navItem: 'Schedule Timings',
      navLink: '/doctor/schedulings'
    } ,
    {
      navItem: 'Notifications',
      navLink: '/doctor/notifications'
    },
    {
      navItem: 'Messages',
      navLink: '/doctor/messagges'
    }
  ]


  const appBarProps = {
    page: 'doctor',
    color: '#fff',
    // open ,
    bgColor: '#424e82',
    handleDrawerOpen,
    setOpen
  }
  

  const drawerProps = {
    open,
    theme,
    handleDrawerClose,
    setOpen,
    navigationLinks
    
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar {...appBarProps}></Navbar>
      <DashboardDrawer { ...drawerProps }></DashboardDrawer>
      <DashboardContent></DashboardContent>
    </Box>
  );
}


export default DoctorDashboard
