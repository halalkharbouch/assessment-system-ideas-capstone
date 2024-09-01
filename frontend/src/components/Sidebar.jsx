import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
} from '@heroicons/react/24/solid';

function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  const getLinkClass = (path) =>
    `flex items-center p-2 ${
      pathname.startsWith(path)
        ? 'bg-gray-700 text-white'
        : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <div className="w-64 bg-gray-800 min-h-screen flex flex-col">
      <div className="text-white text-center p-6 font-bold text-lg">
        Dashboard
      </div>
      <nav className="mt-10 flex-1 overflow-y-auto">
        <Link
          to="/dashboard/overview"
          className={getLinkClass('/dashboard/overview')}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="ml-3">Overview</span>
        </Link>
        <Link
          to="/dashboard/student-performance"
          className={getLinkClass('/dashboard/student-performance')}
        >
          <UserGroupIcon className="w-6 h-6" />
          <span className="ml-3">Student Performance</span>
        </Link>
        <Link
          to="/dashboard/assessment-insights"
          className={getLinkClass('/dashboard/assessment-insights')}
        >
          <ChartBarIcon className="w-6 h-6" />
          <span className="ml-3">Assessment Insights</span>
        </Link>
        <Link
          to="/dashboard/course-analysis"
          className={getLinkClass('/dashboard/course-analysis')}
        >
          <AcademicCapIcon className="w-6 h-6" />
          <span className="ml-3">Course Analysis</span>
        </Link>
        <Link
          to="/dashboard/instructor-metrics"
          className={getLinkClass('/dashboard/instructor-metrics')}
        >
          <UserGroupIcon className="w-6 h-6" />
          <span className="ml-3">Instructor Metrics</span>
        </Link>
        <Link
          to="/dashboard/settings"
          className={getLinkClass('/dashboard/settings')}
        >
          <CogIcon className="w-6 h-6" />
          <span className="ml-3">Settings</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
