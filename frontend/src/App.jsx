import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
