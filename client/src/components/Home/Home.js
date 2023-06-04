import React from 'react';
import Navbar from '../Navbar/Navbar';
import HeroSection from '../HeroSection/HeroSection';
import FindDoctor from '../FindDoctor/FindDoctor';



function Home() {
  const navBarProps = {
    page: 'home',
    bgColor: '#fff',
    color: 'green'
  }
  return (
    <>
      <Navbar {...navBarProps}></Navbar>
      <HeroSection></HeroSection>
      <FindDoctor></FindDoctor>
    </>
   
  );
}

export default Home;
