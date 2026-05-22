import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/authSlice';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send session cookies along with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept 401 responses to automatically clear local storage and log out user
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default client;
