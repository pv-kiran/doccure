import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from './../DashboardContent/DashboardContent';

import GridViewIcon from '@mui/icons-material/GridView';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LockClockIcon from '@mui/icons-material/LockClock';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import MessageIcon from '@mui/icons-material/Message';


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
    // {
    //   navItem: 'Dashboard',
    //   navLink: '/doctor/dashboard',
    //   icon: <GridViewIcon sx={{color: '#579ab5'}}/>
    // } ,
    // {
    //   navItem: 'Patients',
    //   navLink: '/doctor/mypatients',
    //   icon: <EscalatorWarningIcon sx={{color: '#579ab5'}}/>

    // },
    {
      navItem: 'Appointments',
      navLink: '/doctor/appointments' ,
      icon: <LockClockIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Schedule Timings',
      navLink: '/doctor/schedulings' ,
      icon: <ScheduleIcon sx={{color: '#579ab5'}}/>

    } ,
    {
      navItem: 'Notifications',
      navLink: '/doctor/notifications' ,
      icon: <CircleNotificationsIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Messages',
      navLink: '/doctor/messagges' ,
      icon: <MessageIcon sx={{color: '#579ab5'}}/>
    }
  ]


  const appBarProps = {
    page: 'doctor',
    color: '#fff',
    // open ,
    bgColor: '#496b78',
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
