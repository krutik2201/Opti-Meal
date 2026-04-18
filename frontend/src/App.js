import React, { useState } from 'react';

import Login           from './components/Login';
import Signup          from './components/Signup';
import StudentDashboard from './pages/StudentDashboard';
import VendorDashboard  from './pages/VendorDashboard';
import AdminDashboard   from './pages/AdminDashboard';

import './styles.css';

const STORAGE_KEY = 'optimeal_user';

/**
 * App — OptiMeal SaaS Root
 * -------------------------
 * Auth state: { userName, role } stored in localStorage.
 * Auth view : 'login' | 'signup' (unauthenticated screens).
 *
 * Flow:
 *   !auth + view='login'   →  <Login>
 *   !auth + view='signup'  →  <Signup>
 *   role='student'         →  <StudentDashboard>
 *   role='vendor'          →  <VendorDashboard>
 *   role='admin'           →  <AdminDashboard>
 */
function App() {
  /* Persist session across page refresh */
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  /* Which auth screen to show when not logged in */
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  /* Called by Login or Signup on success */
  const handleLogin = (userName, role) => {
    const user = { userName, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuth(user);
  };

  /* Called by Navbar logout button */
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    setAuthView('login');
  };

  /* ── Route by auth state ── */
  if (!auth) {
    return authView === 'signup'
      ? <Signup onLogin={handleLogin} onShowLogin={() => setAuthView('login')} />
      : <Login  onLogin={handleLogin} onShowSignup={() => setAuthView('signup')} />;
  }

  if (auth.role === 'student') return <StudentDashboard auth={auth} onLogout={handleLogout} />;
  if (auth.role === 'vendor')  return <VendorDashboard  auth={auth} onLogout={handleLogout} />;
  if (auth.role === 'admin')   return <AdminDashboard   auth={auth} onLogout={handleLogout} />;

  /* Unknown role: reset */
  handleLogout();
  return <Login onLogin={handleLogin} onShowSignup={() => setAuthView('signup')} />;
}

export default App;
