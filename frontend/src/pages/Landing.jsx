import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import landingAnimationData from '../assets/landing-animation.json';
import axiosInstance from '../api/axios';
import { setUserInfo } from '../redux/userSlice';
import { loginSuccess, setLoading, setError } from '../redux/authSlice';

function Landing() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { isFirstLogin, userId, currentUser } = useSelector(
    (state) => state.user,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoadingState] = useState(false); // Local loading state

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingState(true);
      dispatch(setLoading(true));
      const response = await axiosInstance.post(
        '/api/auth/check-user-exists/',
        { email },
      );
      console.log(response);

      setLoadingState(false);
      dispatch(setLoading(false));

      if (response.data.exists) {
        dispatch(
          setUserInfo({
            userId: response.data.id,
            isFirstLogin: !response.data.has_set_password,
            currentUser: response.data.user, // Store the current user data
          }),
        );
      } else {
        setError('User does not exist');
      }
    } catch (err) {
      setLoadingState(false);
      dispatch(setLoading(false));
      setError('An error occurred while checking user');
    }
  };

  const handlePasswordSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 6 characters long, include a digit, and a special character.',
      );
      return;
    }

    try {
      setLoadingState(true);
      dispatch(setLoading(true));

      // Make the request to set the password
      const response = await axiosInstance.post(
        `/api/auth/${userId}/set-password/`,
        { password },
      );

      // Store tokens in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      setLoadingState(false);
      dispatch(setLoading(false));

      // Dispatch login success action
      dispatch(loginSuccess());
      dispatch(
        setUserInfo({
          currentUser: response.data.user, // Update with current user data
        }),
      );

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setLoadingState(false);
      dispatch(setLoading(false));
      setError('An error occurred while setting the password');
    }
  };

  const handleLogin = async () => {
    try {
      setLoadingState(true);
      dispatch(setLoading(true));
      const response = await axiosInstance.post('/api/auth/login/', {
        email,
        password,
      });
      setLoadingState(false);
      dispatch(setLoading(false));

      // Store tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      // Dispatch login success action
      dispatch(loginSuccess());
      dispatch(setUserInfo({ currentUser: response.data.user }));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setLoadingState(false);
      dispatch(setLoading(false));
      setError('An error occurred while logging in');
    }
  };

  return (
    <section className="max-w-lg mx-auto text-center">
      <div className="text-center my-16">
        <h2 className="text-4xl font-bold mb-4">
          Assessmento <span className="text-blue-500">IDEAS</span> Baze
        </h2>
        <p className="text-lg mb-10">
          Welcome to the assessment platform for IDEAS Baze program sponsored by
          World Bank
        </p>
        <p className="uppercase mb-3 text-blue-500">
          {isFirstLogin === null
            ? 'Sign in to Continue'
            : isFirstLogin
            ? 'Set your password to continue'
            : 'Enter your password to continue'}
        </p>
        <form className="flex justify-center">
          <input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-1/2"
          />
          {isFirstLogin === null && (
            <button
              onClick={handleEmailSubmit}
              className="bg-blue-500 ml-[-0.5rem] shadow-sm hover:shadow-md text-white px-6 py-3 rounded-r uppercase hover:bg-blue-600 transition duration-150 ease-in-out"
            >
              {isFirstLogin === null
                ? 'Submit'
                : isFirstLogin
                ? 'Set Password'
                : 'Sign In'}
            </button>
          )}
        </form>
        {isFirstLogin === null ? null : isFirstLogin ? (
          <div className=" flex flex-col justify-center items-center">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-1/2 mt-4"
            />
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-1/2 mt-4"
            />
            <p className="text-sm text-gray-600 mt-2 w-1/2">
              Password needs to be at least 6 characters long, include a number,
              and a special character.
            </p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="bg-blue-500 shadow-sm hover:shadow-md text-white px-6 py-3 rounded uppercase hover:bg-blue-600 transition duration-150 ease-in-out mt-4"
            >
              Set Password and Sign In
            </button>
          </div>
        ) : (
          <div className=" flex flex-col justify-center items-center">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-blue-500 w-1/2 mt-4"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              onClick={handleLogin}
              className="bg-blue-500 shadow-sm hover:shadow-md text-white px-6 py-3 rounded uppercase hover:bg-blue-600 transition duration-150 w-1/2 ease-in-out mt-4"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
      <Lottie animationData={landingAnimationData} />
    </section>
  );
}

export default Landing;
