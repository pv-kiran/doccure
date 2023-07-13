import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://furnstore.shop/api',
  // timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Add other headers if needed
    withCredentials: true
  },
});


// instance.interceptors.request.use(config => {
//   let user = JSON.parse(localStorage.getItem('user'));
//   config.headers['Authorization'] = `Bearer ${user.token}`;
//   config.withCredentials = true;
//   return config;
// });

export default instance;