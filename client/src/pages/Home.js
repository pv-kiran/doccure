import React, { useState } from 'react'
import instance from '../api/axiosInstance'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';


function Home() {

  const authState = useSelector((state) => {
    return state.auth.authState
  })

  console.log(authState);

  // const [posts, setPosts] = useState([]);

  // async function getPosts() {
  //   let res = await instance.get('/posts');
    
  //   setPosts(res.data);

  // }


  useEffect(() => {

    // getPosts();
    
  }, []);

  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}

export default Home