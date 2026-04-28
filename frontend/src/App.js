import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './components/Login';
import StudentDashboard from './pages/StudentDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';
import './polish.css';

const STORAGE_KEY = 'optimeal_user';

function MainApp() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const navigate = useNavigate();

  const handleLogin = (userName, role) => {
    const user = { userName, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuth(user);
    if (role === 'student') navigate('/student');
    if (role === 'vendor') navigate('/vendor');
    if (role === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    navigate('/');
  };

  // Redirect from root if logged in
  useEffect(() => {
    if (auth && window.location.pathname === '/') {
      navigate(`/${auth.role}`);
    }
  }, [auth, navigate]);

  return (
    <Routes>
      <Route path="/" element={!auth ? <Login onLogin={handleLogin} onShowSignup={() => {}} /> : <Navigate to={`/${auth.role}`} replace />} />
      <Route path="/student/*" element={auth?.role === 'student' ? <StudentDashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="/vendor/*" element={auth?.role === 'vendor' ? <VendorDashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="/admin/*" element={auth?.role === 'admin' ? <AdminDashboard auth={auth} onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
