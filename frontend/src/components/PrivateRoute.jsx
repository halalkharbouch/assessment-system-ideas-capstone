import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element: Component, allowedRoles }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);

  console.log(allowedRoles);
  

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser.user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
}

export default PrivateRoute;
