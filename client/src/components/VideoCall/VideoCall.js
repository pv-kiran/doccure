import React, { useState, useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import instance from '../../api/axiosInstance';




function randomID(len) {

  

  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

function VideoCall() {

  const { id } = useParams();
  console.log(id , 'my id ............!!!!!!!');

  const roomID = getUrlParams().get('roomID') || randomID(5);
  const containerRef = useRef(null);
  const [personalLink, setPersonalLink] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callEnd, setCallEnd] = useState(false);
  const [patientId, setPatientId] = useState(null);

  // const [zp, setZp] = useState(null);

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])
  
    useEffect(() => {
      
      const fetchAppointmetDetails = async () => {
        const { data } = await instance.get(`/appointment/${id}`)
        setPatientId(data?.appointment?.patientId)
      }

      fetchAppointmetDetails();

    } , [])

    useEffect(() => {
      if (containerRef.current) {
        myMeeting(containerRef.current);
      }
    }, []);

  const authState = useSelector((state) => {
      return state.auth?.authState
    })

  const [socket, setSocket] = useState(null);


  useEffect(() => {
        const socket = io('http://localhost:4000');
        setSocket(socket);
        // Cleanup on component unmount
        return () => {
                socket.disconnect();
        };
  }, []);

  useEffect(() => {
        if (socket) {
            // Event listeners for socket events
            socket.on('connect', () => {
                console.log('Connected to server');
                // Send the user ID to the server for setup
                socket.emit('setup', authState._id);
            });
          
            

            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });
            
        }
  }, [socket]);

  useEffect(() => {
    if (socket && personalLink && patientId) {
      socket.emit('new call', {
        personalLink,
        patientId  
      })
    }
  },[personalLink])

  useEffect(() => {
    if (callEnd) {
      socket.emit('new call' , {
        personalLink: null,
        patientId: null
      })
    }
  } , [callEnd])


  let myMeeting = async (element) => {
    // Check if a call is already in progress
    if (callInProgress) {
      console.log('Call already in progress');
      return;
    }

    // Step 1: Install the Zego Cloud SDK using NPM

    // Step 2: Generate a Kit Token
    const appID = 687232081;
    const serverSecret = "c4764442de7e52179a737a106f8b60d1";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    );

    // Step 3: Create an instance object from the Kit Token
    const zpInstance = ZegoUIKitPrebuilt.create(kitToken);
    // setZp(zpInstance);

    // Generate personal link
    const link =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?roomID=' +
      roomID;
     console.log(link , 'jsdkjksjdskjd');
     setPersonalLink(link);
    // socket.emit('new call' , link);


    // Step 4: Start a call
    zpInstance.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url: link,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      onLeaveRoom: () => {
        console.log('User left room , heloooooooooooooo');
        setCallEnd(true);
        window.close();
      },
      Complete: () => {
        console.log('Call started successfully');
        setCallInProgress(true);
      },
    });
  };
  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}

export default VideoCall;
