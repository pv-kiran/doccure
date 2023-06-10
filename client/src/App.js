import './App.css';

import AppRoutes from './routes';




import { useLocation } from 'react-router-dom'
import { useEffect } from 'react';



function App() {

  console.log(process.env.REACT_APP_RZP_KEY)

  const location = useLocation()

  // todo: remove
  useEffect(() => {
    console.log(`${location.pathname} ... testing`);
  } , [location.pathname])

  return (
      <AppRoutes/>
  );
}

export default App;
