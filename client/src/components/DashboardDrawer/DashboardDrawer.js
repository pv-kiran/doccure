import React, { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import  Toolbar  from '@mui/material/Toolbar';


import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import { Link, NavLink } from 'react-router-dom';


import './DashboardDrawer.css'
import { useSelector } from 'react-redux';
import instance from '../../api/axiosInstance';


export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme)=> ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const drawerWidth = 225;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function DashboardDrawer(props) {

  const [notification, setNotification] = useState([])

  const auth = useSelector((state) => {
    return state?.auth?.authState
  })


  useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])

  const fetchNotification = async (role) => {
    const { data } = await instance.get(`/notification/${role}`);
    setNotification(data.notification)
  }

  useEffect(() => {
    fetchNotification(auth.role);
  } , [])

  const { open, handleDrawerClose, theme, navigationLinks } = props;

  return (
    <Drawer
      variant="permanent"
      open={open}
    >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {/* <Toolbar/>
        <Toolbar/> */}

        <List sx={{
          marginTop: '1rem'
        }}>
          {navigationLinks.map((text, index) => (
            <ListItem key={text.navItem}
              disablePadding 
              sx={{ display: 'block', color: '#579ab5' , 
                  '&.active-link': {
                    backgroundColor: '#eaf6ff',
                  }
              }}
              onClick={() => {
                if (text.navItem === 'Notifications') {
                  setNotification([]);
                }
              }}
              component={NavLink}
              to={text.navLink}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  { text.icon}
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                
                <ListItemText primary={text.navItem} sx={{ opacity: open ? 1 : 0 }} />
                {
                  text.navItem === 'Notifications' &&
                    notification.length > 0 ?
                    <ListItemText primary={notification.length}
                      sx={{
                        opacity: open ? 1 : 0 ,
                        backgroundColor: 'lightgreen',
                        textAlign: 'center',
                        borderRadius: '.4rem'
                      }} />
                    :
                    ''
                }
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
  );
}

export default DashboardDrawer;
