import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import axiosInstance from '../api/axios';
import bazeLogo from '../assets/images/logos/baze-logo.png';
import worldBankLogo from '../assets/images/logos/world-bank-logo.png';
import { NavLink } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');

      await axiosInstance.post(
        '/api/auth/logout/',
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosInstance.defaults.headers.Authorization = null;
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Logout error: ', err.response?.data || err.message);
    }
  };

  const renderNavLinks = () => {
    switch (currentUser?.user.user_type) {
      case 'student':
        return (
          <>
            <NavLink
              to="/my-assessments"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>My Assessments</li>
            </NavLink>
            <NavLink
              to="/my-grades"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>My Grades</li>
            </NavLink>
          </>
        );
      case 'superuser':
        return (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Dashboard</li>
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Students</li>
            </NavLink>
            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Teachers</li>
            </NavLink>
            <NavLink
              to="/assessments"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Assessments</li>
            </NavLink>
          </>
        );
      case 'teacher':
        return (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Dashboard</li>
            </NavLink>
            <NavLink
              to="/assessments"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-500 ${isActive && 'border-b'}`
              }
            >
              <li>Assessments</li>
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full p-6 flex justify-between items-center">
      <div className="flex space-x-2">
        <img className="h-12" src={bazeLogo} alt="Baze Logo" />
        <h1 className="text-2xl font-semibold mt-1">Baze Ideas</h1>
      </div>
      <div>
        {isAuthenticated && (
          <ul className="flex space-x-4">{renderNavLinks()}</ul>
        )}
      </div>

      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="flex text-white bg-red-400 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
        >
          Logout
        </button>
      ) : (
        <img className="h-12" src={worldBankLogo} alt="World Bank Logo" />
      )}
    </header>
  );
}

export default Header;
