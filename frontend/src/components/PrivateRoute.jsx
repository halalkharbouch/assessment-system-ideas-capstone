import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect to the landing page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the requested component
  return <Component {...rest} />;
};

export default PrivateRoute;
