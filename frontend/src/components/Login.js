import React, { useState } from 'react';

const ROLES = [
  { value: 'student', label: '🎓 Student',    desc: 'Browse shops & crowd levels' },
  { value: 'vendor',  label: '🍽️ Vendor',     desc: 'Predict demand & manage waste' },
  { value: 'admin',   label: '📊 Admin',       desc: 'Platform analytics & insights' },
];

const DEMO_USERS = {
  student: { name: 'Priya Singh',   role: 'student' },
  vendor:  { name: 'Rahul Mehta',  role: 'vendor'  },
  admin:   { name: 'Admin User',   role: 'admin'   },
};

const ROLE_ACCENT = { student: 'var(--green)', vendor: 'var(--accent)', admin: 'var(--yellow)' };

/**
 * Login — Split-screen glassmorphism auth page
 * Left  : Food hero image + brand overlay + platform features
 * Right : Login form + demo buttons + switch to Signup
 *
 * Props:
 *   onLogin(userName, role)  — writes to localStorage, triggers routing
 *   onShowSignup()           — switches App view to <Signup>
 */
function Login({ onLogin, onShowSignup }) {
  const [name,       setName]       = useState('');
  const [password,   setPassword]   = useState('');
  const [role,       setRole]       = useState('student');
  const [remember,   setRemember]   = useState(false);
  const [showPwd,    setShowPwd]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!name.trim())     e.name     = 'Name is required';
    if (password.length < 4) e.password = 'Password must be at least 4 characters';
    return e;
  };

  /* ── Regular login ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      onLogin(name.trim(), role);
      setSubmitting(false);
    }, 600); // brief loading feel
  };

  /* ── One-click demo login ── */
  const handleDemo = (demoRole) => {
    const { name: demoName, role: r } = DEMO_USERS[demoRole];
    setSubmitting(true);
    setTimeout(() => onLogin(demoName, r), 400);
  };

  const selectedRole = ROLES.find((r) => r.value === role);

  return (
    <div className="auth-layout">
      {/* ════ LEFT — Food Hero ════ */}
      <div className="auth-left" style={{ backgroundImage: "url('/food-hero.png')" }}>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <div className="auth-left-brand">
            <span className="auth-left-brand-icon">🍽️</span>
            <span className="auth-left-brand-name">OptiMeal <span className="auth-left-saas">SaaS</span></span>
          </div>
          <h1 className="auth-left-headline">
            Optimize Food.<br />
            Reduce Waste.<br />
            Serve Smart.
          </h1>
          <p className="auth-left-sub">
            AI-powered food demand platform for colleges, hostels &amp; NGOs.
          </p>
          <ul className="auth-left-features">
            {[
              '7-day weighted demand prediction',
              'Multi-vendor waste analytics',
              'Real-time crowd intelligence',
              'Zero backend auth required',
            ].map((f) => (
              <li key={f}><span className="auth-feat-dot">✦</span>{f}</li>
            ))}
          </ul>
          <div className="auth-left-stats">
            {[
              { val: '4+',    lbl: 'Vendors' },
              { val: '47.9kg', lbl: 'Waste Reduced' },
              { val: '84.8%', lbl: 'Efficiency' },
            ].map((s) => (
              <div className="auth-stat" key={s.lbl}>
                <span className="auth-stat-val">{s.val}</span>
                <span className="auth-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════ RIGHT — Form Panel ════ */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {/* Mobile brand header */}
          <div className="auth-mobile-brand">
            <span>🍽️</span>
            <span>OptiMeal <span style={{ color: 'var(--accent)' }}>SaaS</span></span>
          </div>

          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Sign in to your account to continue.</p>

          {/* ── Demo Quick Login ── */}
          <div className="demo-section">
            <p className="demo-label">Quick Demo Login</p>
            <div className="demo-btns">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  className="demo-btn"
                  style={{ '--demo-accent': ROLE_ACCENT[r.value] }}
                  onClick={() => handleDemo(r.value)}
                  type="button"
                  id={`demo-${r.value}`}
                  disabled={submitting}
                >
                  {r.label.split(' ')[0]}{' '}
                  <span>{r.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="auth-divider"><span>or sign in manually</span></div>

          {/* ── Login Form ── */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-name">Name</label>
              <input
                id="login-name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                type="text"
                placeholder="e.g. Arjun Sharma"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                autoFocus
                autoComplete="name"
              />
              {errors.name && <p className="login-field-error">⚠ {errors.name}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-icon-wrap">
                <input
                  id="login-password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  autoComplete="current-password"
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="login-field-error">⚠ {errors.password}</p>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-role">Role</label>
              <select
                id="login-role"
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Role chip */}
            <div className={`auth-role-chip auth-role-chip--${role}`}>
              <span>{role === 'student' ? '🎓' : role === 'vendor' ? '🍽️' : '📊'}</span>
              <span>{selectedRole?.desc}</span>
            </div>

            {/* Remember + Forgot */}
            <div className="auth-options-row">
              <label className="remember-label" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="remember-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="remember-custom" />
                Remember me
              </label>
              <button type="button" className="forgot-link" onClick={() => alert('Feature coming soon!')}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              className={`btn btn-primary auth-submit-btn ${submitting ? 'loading' : ''}`}
              type="submit"
              id="login-submit"
              disabled={submitting}
            >
              {submitting ? <span className="spinner" /> : ''}
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Switch to Signup */}
          <p className="auth-switch-text">
            Don't have an account?{' '}
            <button className="auth-switch-link" onClick={onShowSignup} type="button">
              Create account →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
