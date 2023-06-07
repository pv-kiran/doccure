import React, { useState } from 'react'
import  Box  from '@mui/material/Box';
import  Stack  from '@mui/material/Stack';
import  Typography  from '@mui/material/Typography';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Rating from '@mui/material/Rating';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#2CE1FE',
  fontsize: '2rem',
//   marginTop: '-3rem',
  borderRadius: '5px',
  padding: '.4rem .8rem',
  width: '100%',
  position:'relative' ,
  color:'white' ,
  letterSpacing: '2px' ,
  '&:hover': {
      backgroundColor: '#0AE4B3',
      
  }
}));


function DoctorVerticalCard({ doctor }) {

  console.log(doctor);
  
    const {
       _id ,
        fullName, 
        speciality,
        services,
        profilePicture,
        address
    } = doctor

    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        if (liked) {
        setLikes(likes - 1);
        setLiked(false);
        } else {
        setLikes(likes + 1);
        setLiked(true);
        }
    };
 
    const navigate = useNavigate();
 
    const [value, setValue] = useState(2);

        return (
                    <Box
                      // direction='row'
                      // spacing={1}
                      sx={{
                      border: '1px gray dotted',
                      borderRadius: '.3rem' ,
                      padding: '1rem',

                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    //   marginBottom: '1.5rem'
                    }}>
                      <Box sx={{width: '12rem'  , height: '15rem' , marginTop: '.4rem' }}>
                        <img src={profilePicture?.secure_url}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'contain'
                          }} alt="" />    
                      </Box>
                      
                      <Stack spacing={1} sx={{width: '100%', padding: '0 .5rem'}}>
                        <Typography variant='h6' color='#2CE1FE'>Dr. { fullName}</Typography>
                            <Typography variant='subtitle2' sx={{color: 'gray' , paddingLeft: '.4rem' }}>
                                BDS, MDS - Oral & Maxillofacial Surgery
                            </Typography> 
                             <Typography variant='subtitle2' sx={{ color: 'gray', paddingLeft: '.4rem' }}>
                                <span style={{display: 'flex' , alignItems: 'space-between' }}>
                                  <img
                                    src={speciality?.specialityImg?.secure_url}
                                    style={{ width: '1.2rem', marginRight: '.6rem' }} alt=""   
                                  />
                                  { speciality?.name}
                                </span>
                            </Typography>
                          <Box sx={{ paddingLeft: '.5rem' }}>
                                <Rating
                                  name="simple-controlled"
                                  value={value}
                                  onChange={(event, newValue) => {
                                    setValue(newValue);
                                  }}
                                />
                            </Box>
                            <Box sx={{ margin: '.2rem 0', display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ marginLeft: '0.5rem' , color: 'gray' }}>
                                  {services.map((service, index) => (
                                      <span
                                      key={index}
                                      style={{
                                          display: 'inline-block',
                                          padding: '0.2rem 0.4rem',
                                          marginRight: '0.5rem',
                                          border: '1px solid #a3a3a3',
                                          borderRadius: '4px',
                                      }}
                                      >
                                      {service}
                                      </span>
                                  ))}
                            </Box>
                          </Box>
                      </Stack>
                      <Box sx={{
                        width: '100%',
                        color: '#424240',
                        padding: '.5rem 1rem',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginTop: '.4rem'
                      }}>
                            <Stack direction="row" color= 'gray' marginRight={2} spacing={1}> 
                                <ThumbUpOffAltIcon fontSize='small' onClick={handleLike}/>
                                <Typography variant='subtitle2'>{ likes}</Typography>
                            </Stack>
                            <Stack direction="row" color= 'gray'  spacing={1}> 
                                <ChatBubbleOutlineIcon fontSize='small'  onClick={handleLike}/>
                                <Typography variant='subtitle2' sx={{fontsize: '.7rem'}} >17 Comments</Typography>
                            </Stack>
                            {/* <Stack direction="row" marginBottom={1} spacing={2}> 
                                <FmdGoodOutlinedIcon fontSize='small'  onClick={handleLike}/>
                                <Typography variant='subtitle2' sx={{ fontsize: '.7rem' }} >
                                 {address.city} , {address.state}
                                </Typography>
                            </Stack>

                            <Stack direction="row" marginBottom={1} spacing={2}  > 
                               <CurrencyRupeeIcon fontSize='small'  onClick={handleLike}/>
                                <Typography variant='subtitle2' sx={{ fontsize: '.7rem' }} >
                                    {speciality?.fees}
                                </Typography>
                            </Stack>                   */}
                      </Box> 
                    </Box>
            )
}

export default DoctorVerticalCard