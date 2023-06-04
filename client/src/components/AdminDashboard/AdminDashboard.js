import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';


import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../Navbar/Navbar';
import { useState } from 'react';
import DashboardDrawer from '../DashboardDrawer/DashboardDrawer';
import DashboardContent from '../DashboardContent/DashboardContent';

import GridViewIcon from '@mui/icons-material/GridView';
import MedicationIcon from '@mui/icons-material/Medication';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import PaidIcon from '@mui/icons-material/Paid';

function AdminDashboard() {
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


  const appBarProps = {
    page: 'admin',
    color: '#fff',
    // open ,
    bgColor: '#496b78',
    handleDrawerOpen,
    setOpen,
  }

  const navigationLinks = [
    {
      navItem: 'Dashboard',
      navLink: '/admin/dashboard',
      icon: <GridViewIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Doctors',
      navLink: '/admin/doctors',
      icon: <MedicationIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Patients',
      navLink: '/admin/patients',
      icon: <EscalatorWarningIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Appointments',
      navLink: '/admin/appointments',
      icon: <ScheduleIcon sx={{color: '#579ab5'}}/>
    },
    {
      navItem: 'Specialities',
      navLink: '/admin/specialities',
      icon: <FolderSpecialIcon sx={{color: '#579ab5'}}/>
    } ,
    {
      navItem: 'Transactions',
      navLink: '/admin/transactions',
      icon: <PaidIcon sx={{color: '#579ab5'}}/>
    }
  ]

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


export default AdminDashboard
