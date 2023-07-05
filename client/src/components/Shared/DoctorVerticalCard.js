import React, {  useState } from 'react'
import  Box  from '@mui/material/Box';
import  Stack  from '@mui/material/Stack';
import  Typography  from '@mui/material/Typography';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import Rating from '@mui/material/Rating';






function DoctorVerticalCard({ doctor , handleLike , handleRatings }) {

  console.log(doctor);
  
    const {
        fullName, 
        speciality,
        services,
        profilePicture,
        likes,
        ratings, 
        comments
    } = doctor

    // const [likes, setLikes] = useState(0);
    // const [liked, setLiked] = useState(false);
  

    
 
    // const navigate = useNavigate();
 
    const [value, setValue] = useState(2);

        return (
                    <Box
                      // direction='row'
                      // spacing={1}
                      sx={{
                      border: '1px #d4d3d2 dotted',
                      borderRadius: '.3rem' ,
                      padding: '1rem',

                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    //   marginBottom: '1.5rem'
                    }}>
                      <Box sx={{width: '17rem'  , height: '15rem' , marginTop: '.1rem' }}>
                        <img src={profilePicture?.secure_url}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'contain'
                          }} alt="profile" />    
                      </Box>
                      
                      <Stack spacing={1} sx={{width: '100%', padding: '0 .2rem'}}>
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
                          <Box>
                                <Rating
                                      sx={{
                                        marginLeft: '.7rem',
                                      }}
                                      name="simple-controlled"
                                      value={(ratings.number || 0)}
                                      onChange={(event, newValue) => {
                                        handleRatings(newValue);
                                        setValue(newValue);
                                  }}
                                />
                          </Box>
                          <Box sx={{
                                width: '100%',
                                color: '#424240',
                                padding: '.5rem .3rem',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                marginBottom: '1rem',
                                // border: '2px red solid'
                              }}>
                                <Stack direction="row" color= 'gray' marginRight={2} spacing={1}> 
                                    <ThumbUpOffAltIcon fontSize='small' onClick={handleLike}/>
                                    <Typography variant='subtitle2'>
                                      {(likes?.number || 0)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" color= 'gray'  spacing={1}> 
                                    <ChatBubbleOutlineIcon fontSize='small'/>
                                    <Typography variant='subtitle2' sx={{ fontsize: '.7rem' }} >
                                        {
                                           `${comments.length || 0} comments` 
                                        }
                                    </Typography>
                                </Stack>
                          </Box> 
                      </Stack>
                      
                      <Box sx={{ margin: '.5rem 0', display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ marginLeft: '.5rem' , color: 'gray' }}>
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
                    </Box>
            )
}

export default DoctorVerticalCard