import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import axiosInstance from '../api/axios';
import bazeLogo from '../assets/images/logos/baze-logo.png';
import worldBankLogo from '../assets/images/logos/world-bank-logo.png';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');

      await axiosInstance.post(
        '/api/auth/logout/',
        { refresh_token: refreshToken },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      axiosInstance.defaults.headers.Authorization = null;
      dispatch(logout());
      navigate('/');
    } catch (err) {
      toast.error('An Error occurred while logging out. Please try again.');
      console.error('Logout error: ', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderNavLinks = () => {
    switch (currentUser?.user.user_type) {
      case 'student':
        return (
          <>
            <NavLink to="/my-assessments" className="text-gray-700 hover:text-blue-500">
              My Assessments
            </NavLink>
            <NavLink to="/my-grades" className="text-gray-700 hover:text-blue-500">
              My Grades
            </NavLink>
          </>
        );
      case 'superuser':
        return (
          <>
            <NavLink to="/dashboard" className="text-gray-700 hover:text-blue-500">
              Dashboard
            </NavLink>
            <NavLink to="/students" className="text-gray-700 hover:text-blue-500">
              Students
            </NavLink>
            <NavLink to="/teachers" className="text-gray-700 hover:text-blue-500">
              Teachers
            </NavLink>
            <NavLink to="/assessments" className="text-gray-700 hover:text-blue-500">
              Assessments
            </NavLink>
          </>
        );
      case 'teacher':
        return (
          <>
            <NavLink to="/dashboard" className="text-gray-700 hover:text-blue-500">
              Dashboard
            </NavLink>
            <NavLink to="/assessments" className="text-gray-700 hover:text-blue-500">
              Assessments
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full p-4 md:p-6 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img className="h-10 md:h-12" src={bazeLogo} alt="Baze Logo" />
        <h1 className="text-xl md:text-2xl font-semibold">Baze Ideas</h1>
      </div>

      {/* Hamburger Icon (for mobile) */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="text-2xl">
          {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
        </button>
      </div>

      {/* Navigation Links (for desktop) */}
      <nav className="hidden md:flex space-x-4">
        {isAuthenticated && renderNavLinks()}
      </nav>

      {/* Mobile Menu (for mobile screens) */}
      {isMobileMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden">
          <ul className="flex flex-col space-y-4 p-4">
            {isAuthenticated && renderNavLinks()}
          </ul>
        </nav>
      )}

      {/* Right Section */}
      <div className="flex space-x-4 items-center">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex text-white bg-red-400 border-0 py-2 px-4 md:px-6 focus:outline-none hover:bg-red-600 rounded"
          >
            {loading ? <ClipLoader size={20} color={'#fff'} /> : 'Logout'}
          </button>
        ) : (
          <img className="h-10 md:h-12" src={worldBankLogo} alt="World Bank Logo" />
        )}
      </div>
    </header>
  );
}

export default Header;
