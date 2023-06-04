import './App.css';

import AppRoutes from './routes';




import { useLocation } from 'react-router-dom'
import { useEffect } from 'react';

function App() {

  const location = useLocation()
  useEffect(() => {
    console.log(`${location.pathname} ... testing`);
  } , [location.pathname])

  return (
      <AppRoutes/>
  );
}

export default App;
