import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Home from './components/Home';
import About from './components/Aboutus';
import Profile from './components/Profile';
import Appointments from './components/Appointments';
import Footer from './pages/Footer';
import Doctors from './components/Doctors';


import RatingsAndReviews from './components/Reviews';

import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
console.log(isLoggedIn)
  // Keep isLoggedIn in sync with localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, 500); // check every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar loggedIn={isLoggedIn} />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<RatingsAndReviews />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
        
         
          
          {/* Protected Route */}
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
          />
          
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
