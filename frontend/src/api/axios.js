import axiosDefault from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

let defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

if (isProduction) {
  defaultOptions = {
    baseURL: 'http://localhost:5000',
    ...defaultOptions,
  };
}

const axios = axiosDefault.create(defaultOptions);

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token || '';
  return config;
});

export default axios;
