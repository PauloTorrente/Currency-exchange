import axios from 'axios';

const authInterceptor = axios.create({
  baseURL: 'https://backend-crypto-swap.onrender.com/api', // URL Base
  headers: {
    'Content-Type': 'application/json',
  },
});

authInterceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authInterceptor;
