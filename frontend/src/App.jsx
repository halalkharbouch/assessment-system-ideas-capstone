import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Assessments from './pages/Assessments';
import AssessmentManage from './pages/AssessmentManage';
import PrivateRoute from './components/PrivateRoute';
import AssessmentsForStudent from './pages/AssessmentsForStudent';
import AssessmentTake from './pages/AssessmentTake';
import StudentGrades from './pages/StudentGrades';
import StudentGradeDetail from './pages/StudentGradeDetails';
import Unauthorized from './pages/Unauthorized';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import { Bounce } from 'react-toastify';
import AssessmentSubmitted from './pages/AssessmentSubmitted';
import StudentsScores from './pages/StudentsScores';

function App() {
  const location = useLocation();

  // Conditionally show the header, except on the landing page
  const shouldShowHeader =
    location.pathname !== '/' &&
    !location.pathname.startsWith('/take-assessment');

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {shouldShowHeader && <Header />}
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Landing />} />

        <Route path="/assessment-submitted" element={<AssessmentSubmitted />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute
              element={Dashboard}
              allowedRoles={['superuser', 'teacher']}
            />
          }
        />
        <Route
          path="/assessment-scores/:assessmentId"
          element={
            <PrivateRoute
              element={StudentsScores}
              allowedRoles={['superuser', 'teacher']}
            />
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute element={Students} allowedRoles={['superuser']} />
          }
        />
        <Route
          path="/teachers"
          element={
            <PrivateRoute element={Teachers} allowedRoles={['superuser']} />
          }
        />
        <Route
          path="/assessments"
          element={
            <PrivateRoute
              element={Assessments}
              allowedRoles={['superuser', 'teacher']}
            />
          }
        />
        <Route
          path="/assessment-manage/:assessmentId"
          element={
            <PrivateRoute
              element={AssessmentManage}
              allowedRoles={['teacher', 'superuser']}
            />
          }
        />
        <Route
          path="/take-assessment/:assessmentId"
          element={
            <PrivateRoute element={AssessmentTake} allowedRoles={['student']} />
          }
        />
        <Route
          path="/my-assessments"
          element={
            <PrivateRoute
              element={AssessmentsForStudent}
              allowedRoles={['student']}
            />
          }
        />
        <Route
          path="/student-scores/:assessmentId"
          element={
            <PrivateRoute element={StudentsScores} allowedRoles={['student']} />
          }
        />
        <Route
          path="/my-grades"
          element={
            <PrivateRoute element={StudentGrades} allowedRoles={['student']} />
          }
        />
        <Route
          path="/grade-detail/:id"
          element={
            <PrivateRoute
              element={StudentGradeDetail}
              allowedRoles={['student']}
            />
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
