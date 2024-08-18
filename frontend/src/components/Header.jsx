import bazeLogo from '../assets/images/logos/baze-logo.png';
import worldBankLogo from '../assets/images/logos/world-bank-logo.png';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full p-6 flex justify-between items-center">
      <div className="flex space-x-2">
        <img className="h-12" src={bazeLogo} alt="" />
        <h1 className="text-2xl font-semibold mt-1">Baze Ideas</h1>
      </div>

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

      <div>
        <img className="" src={worldBankLogo} alt="" />
      </div>
      {/* <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Subscribe
      </button> */}
    </header>
  );
}

export default Header;
