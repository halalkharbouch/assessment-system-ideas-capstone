import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { logout } from '../redux/authSlice'; // Import the logout action
import axiosInstance from '../api/axios';
import bazeLogo from '../assets/images/logos/baze-logo.png';
import worldBankLogo from '../assets/images/logos/world-bank-logo.png';
import { NavLink } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { isAuthenticated } = useSelector((state) => state.auth);

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
      window.location.reload(); // or redirect to login page
    } catch (err) {
      console.error('Logout error: ', err.response?.data || err.message);
      // Handle the error appropriately
    }
  };

  return (
    <header className="w-full p-6 flex justify-between items-center">
      <div className="flex space-x-2">
        <img className="h-12" src={bazeLogo} alt="" />
        <h1 className="text-2xl font-semibold mt-1">Baze Ideas</h1>
      </div>

      {/* Navigation Links */}
      {isAuthenticated && (
        <ul className="flex space-x-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-500  ${isActive && 'border-b'}`
            }
          >
            <li>Dashboard</li>
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-500  ${isActive && 'border-b'}`
            }
          >
            <li>Students</li>
          </NavLink>
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-500  ${isActive && 'border-b'}`
            }
          >
            <li>Teachers</li>
          </NavLink>
          <NavLink
            to="/assessments"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-500  ${isActive && 'border-b'}`
            }
          >
            <li>Assessments</li>
          </NavLink>
        </ul>
      )}

      {isAuthenticated ? (
        <div className="">
          <button
            onClick={handleLogout}
            className="flex ml-auto text-white bg-red-400 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <img className="h-12" src={worldBankLogo} alt="" />
        </div>
      )}
    </header>
  );
}

export default Header;
