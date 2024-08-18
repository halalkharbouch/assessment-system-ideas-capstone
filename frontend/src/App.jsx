import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Assessments from './pages/Assessments';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/assessments" element={<Assessments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
