import * as React from "react";
// import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from '@mui/material/Button';


import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';

// { AppBarProps as MuiAppBarProps } 

import { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../app/features/auth/authSlice';
import { logginPatientReset, logoutPatient } from '../../app/features/patient/patientSlice';



import { logginDoctorReset, logoutDoctor } from '../../app/features/doctor/doctorSlice';
import { adminLoginStateReset, logoutAdmin } from "../../app/features/admin/adminSlice";


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


function Navbar(props) {

  const { page, bgColor, color , handleDrawerOpen , open  } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  // patient logout logic
  let patientLogoutStatus = useSelector((state) => {
        return state.patient;
  })

  useEffect(() => {

        if (patientLogoutStatus.success) {
            localStorage.removeItem('user');
            dispatch(clearAuth());
            dispatch(logginPatientReset());
            navigate('/');
        }

  }, [patientLogoutStatus.success])
  


  // doctor logout logic
  let doctorLogoutStatus = useSelector((state) => {
        return state.doctor
  })
  
  useEffect(() => {

    if (doctorLogoutStatus.success) {
            localStorage.removeItem('user');
            dispatch(clearAuth());
            dispatch(logginDoctorReset());
            navigate('/');
        }

  }, [doctorLogoutStatus.success])
  

  // doctor logout logic
  let adminLogoutStatus = useSelector((state) => {
        return state.admin
  })
  
  useEffect(() => {

    if (adminLogoutStatus.success) {
            localStorage.removeItem('user');
            dispatch(clearAuth());
            dispatch(adminLoginStateReset());
            navigate('/');
        }

  }, [adminLogoutStatus.success])


  // logout trigger
  const handleClick = () => {
      if (role === 'patient') {
        dispatch(logoutPatient()); 
      }  else if (role === 'doctor') {
        dispatch(logoutDoctor());
      } else {
        dispatch(logoutAdmin());
      }       
  }

  const [anchorEl, setAnchorEl] = useState(null);
    
  const authState = useSelector((state) => {
      return state?.auth?.authState;
  })
  

  // role based navigation logic
  let profileUrl;
  let navLink;
  let role = authState?.role;

  if (page === 'home') {
    if (role) {
        navLink = 'Dashboard'
        profileUrl = `/${role}/dashboard`;
    }
  } else {
    navLink = 'Home';
    profileUrl = '/';
  }
  

  // if (role === 'doctor') {
  //   profileUrl = '/doctor/dashboard';
  // }
  // else if (role === 'patient') {
  //   profileUrl = '/patient/dashboard';
  // } else {
  //   profileUrl = '/admin/dashboard'
  // }

  let profilePic = authState?.profilePicture ? authState?.profilePicture.secure_url : '/static/images/avatar/2.jpg';
  

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box sx={{ flexGrow: 1 }} width="100%">
      <AppBar
        position="fixed"
        open={open} 
        sx={{
          backgroundColor: bgColor,
          color: color,
          height: "5rem",
          display: "flex",
          justifyContent: 'center' ,
          width: '100%'
        }}
        elevation={1}
      >
        <Toolbar>
          {
            page !== 'home' && <IconButton
                color="inherit"
                aria-label="open drawer"
                // onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: 'none' }),
              }}
              onClick={handleDrawerOpen}
              >
                 <MenuIcon />
              </IconButton> 
          }
          <Typography variant="h4" component="div" sx={{
            flexGrow: 1,
            textAlign: 'left',
            textTransform: 'uppercase'
          }} >
            {
               page === 'home' ? <img
                style={{ marginTop: "1.75rem" }}
                alt="logo"
                src="https://doccure.dreamguystech.com/laravel/template/public/assets/img/logo.png"
              /> : `${authState?.role} Dashboard`
            }
            
          </Typography>
                  {
                      authState ? (
                            <Box>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar alt="Remy Sharp" src= {profilePic}  />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                vertical: "top",
                                horizontal: "right"
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                              <MenuItem
                                onClick={handleClose}
                                component={Link} 
                                to = {profileUrl}
                              >
                                {navLink}
                              </MenuItem>
                              <MenuItem
                    onClick={() => {
                      handleClick()
                      handleClose()
                    }}
                              >
                                Logout
                              </MenuItem>
                            </Menu>
                            </Box>
                      ) :
                      <Button
                              component={Link} 
                              to = '/signin'
                              sx={{
                                border: '1px #0AE4B3 solid',
                                color: "#0AE4B3",
                                backgroundColor: "white",
                                borderColor: "#0AE4B3",
                                padding: '.6rem',
                                fontWeight: '200',
                                "&:hover": {
                                backgroundColor: "#0AE4B3",
                                color: "white" ,
                                }
                         }}
                         >
                        Sign up / Login
                    </Button>
                 }
      
                  
                  
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export default Navbar













{/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { lg: "none", md: "none" } }}
          >
            <MenuIcon />
          </IconButton> */}