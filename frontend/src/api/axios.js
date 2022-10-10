import axiosDefault from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const baseURL = isProduction
  ? window.location.hostname
  : 'http://localhost:5000';

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const axios = axiosDefault.create(defaultOptions);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token || '';
  return config;
});

export default axios;
