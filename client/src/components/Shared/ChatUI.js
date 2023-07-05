import React from 'react'
import  Stack  from '@mui/material/Stack';
import Box  from '@mui/material/Box';
import  TextField  from '@mui/material/TextField';
import Typography  from '@mui/material/Typography';

import SendIcon from '@mui/icons-material/Send';
import  Button  from '@mui/material/Button';
import instance from '../../api/axiosInstance';
import { useState , useEffect , useRef} from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';


import { useSelector } from 'react-redux';

import Chip from '@mui/material/Chip';

import io from 'socket.io-client';
import Toast from './Toast';





function ChatUI({ role }) {
    
    const searchUrl = role === 'doctor' ? `/chat/getPatients` : `/chat/getDoctors` ;
    const createChatUrl = role === 'doctor' ? `chat/doctor/create` : `chat/patient/create`;
    const senderRole = role === 'doctor' ? 'Doctor' : 'Patient';
    // let selectedChatComparer;

    const [socket, setSocket] = useState(null);
    const selectedChatComparer = useRef(null);


    const authState = useSelector((state) => {
      return state.auth?.authState
    })

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
  
    
    

    const [myConversation, setmyConversation] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);

    const [searchValue, setSearchValue] = useState('');
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user')) ;
        instance.defaults.headers.common = {
            Authorization : `Bearer ${user.token}`
        }
    }, [])
  
    // fetches the available chats
    useEffect(() => {
      const fetchConversations = async () => {
        const { data } = await instance.get('/chat/mychat');
        console.log(data);
        setmyConversation(data)
      }
      fetchConversations();
    }, [])
  
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };
  
    // searching the patients
    const fetchUsers = async () => {
     try {
         const { data } = await instance.get(`${searchUrl}?search=${searchValue}`);
         console.log(data);
         role === 'doctor' ?  setMyAppointments(data?.myPatients) : setMyAppointments(data?.myDoctors)
         setSearchValue('')

     } catch (err) {
       console.log(err);
      }
    }
  
    const handleSearch = (event) => {
      event.preventDefault();
      if (searchValue.trim() === '') {
        setShowAlert(true);
      } else {
         fetchUsers()
      }
    }
  
  
    // creating a chat
    const createChat = async (patientId) => {
      console.log(patientId);
      const { data } = await instance.post(`${createChatUrl}/${patientId}`)
      setmyConversation((prev) => {
        return [...prev, data];
      })
      setMyAppointments([]);
      setSearchValue('')

    }
  
    // fetching messages
    const [conversationId, setConversationId] = useState('');
    const [messages, setMessages] = useState([]);
  
    const fetchMessages = async (conversationId) => {
      try {
        const { data } = await instance.get(`/message/${conversationId}`)
        console.log(data);
        setMessages(data)
        socket.emit('join chat' , conversationId)
      } catch (err) {
        console.log(err);
      }
    }
    useEffect(() => {
      if (conversationId) {
          fetchMessages(conversationId);
          selectedChatComparer.current = conversationId;
      }
        
    }, [conversationId])
  
    // sending meassages
  
    const [message, setMessage] = useState('');
  
    const handleMessageSent = async (e) => {
          e.preventDefault()
          const messageDetails = {
            content: message,
            role: `${senderRole}`
          }
          if (conversationId && message) {
            setMessage('');
            const { data } = await instance.post(`/message/${conversationId}`, messageDetails)
            console.log(data);
            socket.emit('new message', data);  
              setMessages((prev) => {
                  if (prev) {
                     return [...prev, data];
                  } else {
                      return [data];
                  }
            })
          }
          
    }
  
  

    
    useEffect(() => {
        if (socket) {
            console.log('hello');
            socket.on('message recieved', (newMessage) => {
                console.log(selectedChatComparer.current);
                console.log(newMessage?.conversation._id)
                if (!selectedChatComparer.current || selectedChatComparer.current !== newMessage?.conversation._id) {
                    console.log(newMessage)
                } else {
                    socket.off('message recieved')
                    setMessages((prev) => {
                        return [...prev, newMessage]
                    })
                }
            })
            
        }
    } , [socket]);

    
    
    
    return (
      <Stack
        direction='row'
        sx={{
          marginTop: '5rem' ,
          marginLeft: '-30rem',
        }}
      >
          {/* Conversation list */}
          <Stack direction='column'
            sx={{
              width: '28%',
              border: '1px #496b78 solid',
              padding: '1rem' ,
              marginRight: '2rem',
              height: '30rem',
              borderRadius: '.4rem'
            }}
          >
            <Box sx={{
              marginBottom: '1rem',
            }}>
              <TextField
                  size='small' 
                  placeholder='Search user and send messages'
                  sx={{
                    width: '100%',
                    border: '1px dotted rgba(14,14,14,0.3)',
                    borderRadius: '.3rem'
                  }} 
                  value={searchValue}
                  onChange={handleSearchChange}
                  InputProps={{
                      endAdornment: (
                      <InputAdornment
                        position="end"
                        
                      >
                        <SearchIcon
                          sx={{ cursor: 'pointer' }}
                          onClick = {handleSearch}
                        />
                      </InputAdornment>
                  )
                  }}
              />
              
              <Toast
                setShowAlert={setShowAlert}
                showAlert={showAlert}
                message={'Please enter a search value'}
              >
              </Toast>
            </Box>
            {
                  myConversation.map((conversation) => {
                    const { participants } = conversation;
                    return (
                        <Stack
                            key={conversation._id}
                            sx={{
                              paddingLeft: '1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              border: '1px gray dotted',
                              padding: '.2rem .4rem',
                              borderRadius: '.3rem',
                              marginBottom: '.5rem' ,
                              backgroundColor: conversationId === conversation._id ? '#a1f59d' : ''
                            }}
                            onClick={() => {
                              setConversationId(conversation._id)
                            }}
                        >
                          <img
                              src={
                                  role === 'doctor'  ? participants[0]?.patient?.profilePicture?.secure_url : participants[0]?.doctor?.profilePicture?.secure_url
                              }
                              alt="pro" 
                              style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                objectFit: 'cover',
                                marginRight: '.5rem',
                                borderRadius: '.2rem'
                              }}
                          />
                        <Box>
                          <Typography
                              sx={{
                                fontSize: '1rem',
                                color: conversationId === conversation._id ? '#162415' : '#496b78'
                              }}
                            >
                              {
                                  role === 'doctor' ?  participants[0]?.patient?.fullName : participants[0]?.doctor?.fullName
                              }
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '.7rem',
                                color: conversationId === conversation._id ? '#162415' : '#496b78'
                              }}
                            >
                              {
                                    role === 'doctor' ?  participants[0]?.patient?.email : participants[0]?.doctor?.email  
                                  
                              }
                            </Typography>
                        </Box>
                          
                        </Stack>
                      )
                  })
            }
            {
              myAppointments.length > 0 && 
              <Typography sx={{ color: 'lightblue' }}>{ 
                  role === 'patient' ? `Dcotor List` : `Patient List`
              }</Typography>
            }
            {
                  myAppointments.map((appointment) => {
                    return (
                        <Stack
                            key={appointment._id}
                            sx={{
                              paddingLeft: '1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              border: '1px gray dotted',
                              padding: '.2rem .4rem',
                              borderRadius: '.3rem',
                              marginBottom: '.5rem'
                            }}
                            onClick={() => {
                                role === 'doctor' ? createChat(appointment?.patientId) : createChat(appointment?.doctorId);
                            }}
                        >
                          <img
                              src={
                                role === 'doctor' ? appointment?.patient?.profilePicture?.secure_url : appointment?.doctor?.profilePicture?.secure_url
                              }
                              alt="pro" 
                              style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                objectFit: 'cover',
                                marginRight: '.5rem',
                                borderRadius: '.2rem'
                              }}
                          />
                        <Box>
                          <Typography
                              sx={{
                                fontSize: '1rem',
                                color:'#496b78'
                              }}
                            >
                              {
                                role === 'doctor' ? appointment.patient?.fullName : appointment.doctor?.fullName 
                              }
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '.7rem',
                                color:'#496b78'
                              }}
                            >
                              {
                                role === 'doctor' ? appointment.patient?.email : appointment.doctor?.email
                              }
                            </Typography>
                        </Box>
                          
                        </Stack>
                      )
                  })
            }
          
          </Stack>

          {/* Sending messages  */}
          <Box
            sx={{
              width: '63%',
              height: '30rem',
              border: '1px #496b78 dotted',
              borderRadius: '.2rem',
              padding: '1rem',
              boxSizing: 'border-box'
            }}>

              <Box>
                  <Stack sx={{
                      height: '24rem',
                      overflow: 'auto',
                      borderRadius: '.2rem',
                      '&::-webkit-scrollbar': {
                          width: '0.5rem', // Width of the scrollbar
                      },
                      '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1', // Background color of the track
                      },
                      '&::-webkit-scrollbar-thumb': {
                          background: '#888', // Color of the thumb
                          borderRadius: '0.25rem', // Border radius of the thumb
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                          background: '#555', // Color of the thumb on hover
                      }
                  }}>
                      {
                          messages.length > 0 && messages.map((message) => {
                                const isSender = authState._id === message.sender?._id;
                                return (
                                  <Chip 
                                      key={message?._id}
                                      label={message?.content} 
                                      sx={{
                                        maxWidth: 'fit-content',
                                        marginBottom: '1rem',
                                        marginRight: '1rem',
                                        marginLeft: isSender ? 'auto' : '0',
                                      }}
                                  />
                            )
                          })
                      }             
                  </Stack>
              
                  <Stack
                    direction='row'
                    sx={{
                        marginTop: '1rem',
                        width: "100%",
                    }}
                    position='relative'
                    component='form'
                    onSubmit={handleMessageSent}
                
                  >
                      {
                         conversationId && <textarea
                          style={{
                              width: '100%',
                              padding: '0.5rem',
                              paddingRight: '2.5rem',
                              outline: 'none',
                              resize: 'none'  ,
                              border: '.5px #496b78 solid',
                              borderRadius: '.3rem' 
                          }}
                          value={ message }
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            console.log(e)
                            if (e.key === 'Enter') {
                              // e.preventDefault();
                              console.log(e);
                              handleMessageSent(e);
                            }
                          }}
                      >
                      </textarea>
                      }
                      <Button
                          type='submit'
                          style={{
                            position: 'absolute',
                            top: '52%',
                            right: '0.2rem',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer'
                          }}
                      >
                          {
                               message &&
                                <SendIcon
                                  sx={{ color: '#8fe876' }} 
                                />
                          }
                      </Button>           
                  </Stack>
              </Box>
          </Box> 
          
      </Stack>
    )
}

export default ChatUI