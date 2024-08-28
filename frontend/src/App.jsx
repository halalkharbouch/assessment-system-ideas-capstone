import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Assessments from './pages/Assessments';
import AssessmentManage from './pages/AssessmentManage';
import PrivateRoute from './components/PrivateRoute';
import AssessmentsForStudent from './pages/AssessmentsForStudent';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Landing />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute element={Home} />} />
        <Route path="/students" element={<PrivateRoute element={Students} />} />
        <Route path="/teachers" element={<PrivateRoute element={Teachers} />} />
        <Route
          path="/assessments"
          element={<PrivateRoute element={Assessments} />}
        />

        <Route
          path="/assessment-manage/:assessmentId"
          element={<PrivateRoute element={AssessmentManage} />}
        />
        <Route
          path="/my-assessments"
          element={<PrivateRoute element={AssessmentsForStudent} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
