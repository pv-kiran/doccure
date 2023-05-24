import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000/api',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Add other headers if needed
  },
});

export default instance;