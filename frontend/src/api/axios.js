import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/authSlice';
import { userLogout } from '../redux/userSlice';
import { persistor } from '../redux/store';
import { toast } from 'react-toastify'; // Optional: for showing logout messages

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Dispatch actions to handle authentication failure
      store.dispatch(logout());
      store.dispatch(userLogout());

      // Clear the persisted state
      persistor.purge();

      // Remove the token from local storage
      localStorage.removeItem('access_token');

      // Optionally show a logout message
      toast.info('Session expired. Please log in again.');

      // Redirect to login page
      window.location.href = '/'; // Consider handling redirection more elegantly in a React component
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
