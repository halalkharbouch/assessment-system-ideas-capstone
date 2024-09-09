import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import axiosInstance from '../api/axios';
import { loginSuccess, setLoading } from '../redux/authSlice';
import { setUserInfo } from '../redux/userSlice';
import BazeLgo from '../assets/images/logos/baze-logo.png';
import LandingImg from '../assets/images/landing-image.webp';

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFirstLogin, currentUser } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoadingState] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false); // Mobile Warning

  useEffect(() => {
    if (currentUser) {
      navigate(
        currentUser.user.user_type === 'student'
          ? '/my-assessments'
          : '/dashboard/student-performance',
      );
    }

    // Detect if the user is on a mobile device
    if (window.innerWidth <= 768) {
      setShowMobileWarning(true); // Show the warning modal on mobile screens
    }
  }, [currentUser, navigate]);

  const closeWarning = () => {
    setShowMobileWarning(false); // Close the modal
  };

  const handleApiCall = async (
    apiCall,
    successMessage,
    errorMessage,
    callback,
  ) => {
    try {
      setLoadingState(true);
      dispatch(setLoading(true));
      const response = await apiCall();
      setLoadingState(false);
      dispatch(setLoading(false));
      toast.success(successMessage);
      if (callback) callback(response);
    } catch (error) {
      console.error('API call error:', error);
      toast.error(errorMessage);
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingState(true);
      dispatch(setLoading(true));
      const response = await axiosInstance.post(
        '/api/auth/check-user-exists/',
        { email },
      );

      if (response.data.exists) {
        dispatch(
          setUserInfo({
            userId: response.data.id,
            isFirstLogin: !response.data.has_set_password,
            currentUser: response.data.user,
          }),
        );
        toast.success('User found, please proceed!');
      } else {
        toast.error('User does not exist');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error checking user');
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 6 characters long, include a digit, and a special character.',
      );
      return;
    }

    handleApiCall(
      () =>
        axiosInstance.post(`/api/auth/${userId}/set-password/`, { password }),
      'Password set successfully!',
      'Error setting password',
      (response) => {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        dispatch(loginSuccess());
        dispatch(setUserInfo({ currentUser: response.data.user }));
      },
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleApiCall(
      () => axiosInstance.post('/api/auth/login/', { email, password }),
      'Logged in successfully!',
      'Error logging in',
      (response) => {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        dispatch(loginSuccess());
        dispatch(setUserInfo({ currentUser: response.data.user }));
      },
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white lg:flex-row">
      {/* Mobile Warning Modal */}
      {showMobileWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md text-center">
            <h2 className="text-lg font-bold mb-4">Notice</h2>
            <p className="text-gray-600">
              This site is currently not optimized for mobile devices due to
              security reasons on proctoring assessments. Please use a laptop or
              desktop for better performance.
            </p>
            <button
              onClick={closeWarning}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Left Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-12 bg-white">
        <div className="mb-6 lg:mb-8">
          <img src={BazeLgo} className="h-16 mx-auto lg:h-20 lg:mx-0" alt="Baze Logo" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-center lg:text-left">
          IDEAS <span className="text-blue-500">Assess</span>
        </h1>
        <p className="text-gray-600 text-center lg:text-left">
          Welcome to the Integrated Digital Evaluation and Assessment System
          platform. Login to continue.
        </p>

        <form
          className="space-y-4 mt-6 lg:mt-8"
          onSubmit={
            isFirstLogin === null
              ? handleEmailSubmit
              : isFirstLogin
              ? handlePasswordSubmit
              : handleLogin
          }
        >
          <p className="uppercase mb-3 text-blue-500 text-center lg:text-left">
            {isFirstLogin === null
              ? 'Sign in to Continue'
              : isFirstLogin
              ? 'Set your password to continue'
              : 'Enter your password to continue'}
          </p>
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
          />
          {isFirstLogin !== null && (
            <>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
              />
              {isFirstLogin && (
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                />
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color={'#fff'} />
            ) : isFirstLogin ? (
              'Set Password and Sign In'
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      {/* Right Side (Image) */}
      <div className="w-full lg:w-1/2 bg-transparent text-white relative flex items-center justify-center">
        <img
          src={LandingImg}
          alt="Illustration"
          className="absolute rounded-3xl top-0 left-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Landing;
