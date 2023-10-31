import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import VideoChatIcon from "@mui/icons-material/VideoChat";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import DashboardDrawer from "../DashboardDrawer/DashboardDrawer";
import DashboardContent from "../DashboardContent/DashboardContent";

import LockClockIcon from "@mui/icons-material/LockClock";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MessageIcon from "@mui/icons-material/Message";
import io from "socket.io-client";
import { useSelector } from "react-redux";
// import { lightBlue } from "@mui/material/colors";

function PatientDashboard() {
  const [socket, setSocket] = useState(null);
  const [call, setCall] = useState("");

  const authState = useSelector((state) => {
    return state.auth?.authState;
  });

  useEffect(() => {
    const socket = io("https://furnstore.shop/");
    // const socket = io("http://localhost:4000/");

    setSocket(socket);
    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      // Event listeners for socket events
      socket.on("connect", () => {
        console.log("Connected to server");
        // Send the user ID to the server for setup
        socket.emit("setup", authState._id);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("doctor call", (link) => {
        console.log("doctor is calling ......!!!");
        console.log(link);
        setCall(link);
      });
    }
  }, [socket]);

  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen((prev) => {
      return !prev;
    });
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigationLinks = [
    // {
    //   navItem: 'Doctors',
    //   navLink: '/patient/dashboard',
    //   icon: <MedicationIcon sx={{color: '#579ab5'}}/>
    // },
    {
      navItem: "Appointments",
      navLink: "/patient/appointments",
      icon: <LockClockIcon sx={{ color: "#579ab5" }} />,
    },
    {
      navItem: "Notifications",
      navLink: "/patient/notifications",
      icon: <CircleNotificationsIcon sx={{ color: "#579ab5" }} />,
    },
    {
      navItem: "Messages",
      navLink: "/patient/messages",
      icon: <MessageIcon sx={{ color: "#579ab5" }} />,
    },
  ];

  const appBarProps = {
    page: "patient",
    color: "#fff",
    // open ,
    bgColor: "#496b78",
    handleDrawerOpen,
    setOpen,
  };

  const drawerProps = {
    open,
    theme,
    handleDrawerClose,
    setOpen,
    navigationLinks,
  };

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <CssBaseline />
      <Navbar {...appBarProps}></Navbar>
      <DashboardDrawer {...drawerProps}></DashboardDrawer>
      <DashboardContent></DashboardContent>
      {call && (
        <a
          onClick={() => {
            setCall("");
          }}
          href={call}
          target="_blank"
          rel="noreferrer"
          style={{
            position: "absolute",
            right: "3rem",
            top: "10rem",
            width: "10rem",
            backgroundColor: "lightgreen",
            textDecoration: "none",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            color: "#1b4366",
            borderRadius: ".5rem",
          }}>
          <VideoChatIcon></VideoChatIcon>
          <span>Join Call</span>
        </a>
      )}
    </Box>
  );
}

export default PatientDashboard;
