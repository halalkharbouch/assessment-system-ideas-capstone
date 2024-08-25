import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Assessments from './pages/Assessments';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
