import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bazeLogo from '../assets/images/logos/baze-logo.png';
import worldBankLogo from '../assets/images/logos/world-bank-logo.png';
import { ClipLoader } from 'react-spinners';
import landingAnimationData from '../assets/landing-animation.json';
import axiosInstance from '../api/axios';
import { loginSuccess, setLoading } from '../redux/authSlice';
import { setUserInfo } from '../redux/userSlice';

const Landing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFirstLogin, userId, currentUser } = useSelector(
    (state) => state.user,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoadingState] = useState(false);

  useEffect(() => {
    // Redirect if currentUser is defined
    if (currentUser) {
      navigate(
        currentUser.user.user_type === 'student'
          ? '/my-assessments'
          : '/dashboard/student-performance',
      );
    }
  }, [currentUser, navigate]);

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
      setLoadingState(false);
      dispatch(setLoading(false));
      console.error('API call error:', error);
      toast.error(errorMessage);
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
      console.error('Error checking user:', error);
      toast.error('Error checking user');
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const handlePasswordSubmit = () => {
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

  const handleLogin = () => {
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
    <section>
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <img className="h-12" src={bazeLogo} alt="Baze Logo" />
          <h1 className="text-2xl font-semibold mt-1">Baze Ideas</h1>
        </div>
        <img className="h-12" src={worldBankLogo} alt="World Bank Logo" />
      </header>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* Content Section */}
          <div className="flex flex-col text-center justify-center items-center md:w-1/2 w-full p-8">
            <h2 className="text-4xl font-bold mb-4">
              IDEAS <span className="text-blue-500">Assess</span>
            </h2>
            <p className="text-lg mb-10 text-center">
              Welcome to the Integrated Digital Evaluation and Assessment System
              assessment platform, IDEAS Assess for IDEAS Baze program sponsored
              by World Bank, login to continue
            </p>
            <p className="uppercase mb-3 text-blue-500">
              {isFirstLogin === null
                ? 'Sign in to Continue'
                : isFirstLogin
                ? 'Set your password to continue'
                : 'Enter your password to continue'}
            </p>
            <form className="flex flex-col items-center w-full">
              <input
                type="email"
                placeholder="Type your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-full md:w-3/4 mb-4"
              />
              {isFirstLogin === null && (
                <button
                  onClick={handleEmailSubmit}
                  className="bg-blue-500 shadow-sm hover:shadow-md text-white px-6 py-3 rounded uppercase hover:bg-blue-600 transition duration-150 ease-in-out"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color={'#fff'} /> : 'Submit'}
                </button>
              )}
              {isFirstLogin !== null && (
                <div className="flex flex-col items-center w-full">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-full md:w-3/4 mb-4"
                  />
                  {isFirstLogin && (
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-full md:w-3/4 mb-4"
                    />
                  )}
                  <button
                    onClick={isFirstLogin ? handlePasswordSubmit : handleLogin}
                    className="bg-blue-500 shadow-sm hover:shadow-md text-white px-6 py-3 rounded uppercase hover:bg-blue-600 transition duration-150 ease-in-out mt-4 w-full md:w-3/4"
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
                </div>
              )}
            </form>
          </div>
          {/* Lottie Animation Section */}
          <div className="md:w-1/2 w-full h-full flex items-center justify-center">
            <Lottie animationData={landingAnimationData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
