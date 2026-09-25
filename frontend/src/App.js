import { Routes, Route, Navigate } from 'react-router-dom';
// public
import HomePage from './components/pages/HomePage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* required multi router  */}
    </Routes>
  );
}

export default App;
