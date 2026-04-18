import React, { useState } from 'react';

const ROLES = [
  { value: 'student', label: '🎓 Student',    desc: 'Browse shops & crowd levels' },
  { value: 'vendor',  label: '🍽️ Vendor',     desc: 'Predict demand & manage waste' },
  { value: 'admin',   label: '📊 Admin',       desc: 'Platform analytics & insights' },
];

/**
 * Signup — Split-screen registration page
 * Mirrors the Login layout (food hero left, form right).
 * On submit: stores user → calls onLogin() to auto-login.
 *
 * Props:
 *   onLogin(userName, role) — auto-logins after successful signup
 *   onShowLogin()           — go back to Login view
 */
function Signup({ onLogin, onShowLogin }) {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    confirm:  '',
    role:     'student',
  });
  const [showPwd,    setShowPwd]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name     = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6)         e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm)   e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setSuccess(true);

    // Save to localStorage (simulated account creation)
    const existing = JSON.parse(localStorage.getItem('optimeal_users') || '[]');
    existing.push({ name: form.name.trim(), email: form.email, role: form.role });
    localStorage.setItem('optimeal_users', JSON.stringify(existing));

    // Auto-login after brief delay (UX success moment)
    setTimeout(() => {
      onLogin(form.name.trim(), form.role);
    }, 900);
  };

  const selectedRole = ROLES.find((r) => r.value === form.role);

  return (
    <div className="auth-layout">
      {/* ════ LEFT — same food hero ════ */}
      <div className="auth-left" style={{ backgroundImage: "url('/food-hero.png')" }}>
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <div className="auth-left-brand">
            <span className="auth-left-brand-icon">🍽️</span>
            <span className="auth-left-brand-name">OptiMeal <span className="auth-left-saas">SaaS</span></span>
          </div>
          <h1 className="auth-left-headline">
            Join the<br />
            smarter way<br />
            to feed people.
          </h1>
          <p className="auth-left-sub">
            Create your free account and start optimizing your kitchen in minutes.
          </p>
          <ul className="auth-left-features">
            {[
              'Free forever for small kitchens',
              'Instant demand predictions',
              'No credit card required',
              'Insights from day one',
            ].map((f) => (
              <li key={f}><span className="auth-feat-dot">✦</span>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ════ RIGHT — Signup Form ════ */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span>🍽️</span>
            <span>OptiMeal <span style={{ color: 'var(--accent)' }}>SaaS</span></span>
          </div>

          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-subtitle">Get started in less than a minute.</p>

          {/* ── Success flash ── */}
          {success && (
            <div className="auth-success-banner">
              ✅ Account created! Redirecting you in…
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Two-col: Name + Email */}
            <div className="form-two-col">
              <div className="form-group">
                <label className="form-label" htmlFor="sig-name">Full Name</label>
                <input
                  id="sig-name"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  type="text"
                  placeholder="Arjun Sharma"
                  value={form.name}
                  onChange={set('name')}
                  autoFocus
                />
                {errors.name && <p className="login-field-error">⚠ {errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sig-email">Email</label>
                <input
                  id="sig-email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  type="email"
                  placeholder="arjun@college.edu"
                  value={form.email}
                  onChange={set('email')}
                />
                {errors.email && <p className="login-field-error">⚠ {errors.email}</p>}
              </div>
            </div>

            {/* Two-col: Password + Confirm */}
            <div className="form-two-col">
              <div className="form-group">
                <label className="form-label" htmlFor="sig-pwd">Password</label>
                <div className="input-icon-wrap">
                  <input
                    id="sig-pwd"
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={set('password')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="login-field-error">⚠ {errors.password}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sig-confirm">Confirm</label>
                <input
                  id="sig-confirm"
                  className={`form-input ${errors.confirm ? 'input-error' : ''}`}
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                />
                {errors.confirm && <p className="login-field-error">⚠ {errors.confirm}</p>}
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="sig-role">I am a…</label>
              <select id="sig-role" className="form-select" value={form.role} onChange={set('role')}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Role chip */}
            <div className={`auth-role-chip auth-role-chip--${form.role}`}>
              <span>{form.role === 'student' ? '🎓' : form.role === 'vendor' ? '🍽️' : '📊'}</span>
              <span>{selectedRole?.desc}</span>
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div className="pwd-strength-wrap">
                <div className="pwd-strength-label">
                  Strength: <span style={{ color: pwdColor(form.password) }}>{pwdLabel(form.password)}</span>
                </div>
                <div className="pwd-strength-track">
                  <div
                    className="pwd-strength-fill"
                    style={{
                      width: pwdWidth(form.password),
                      background: pwdColor(form.password),
                    }}
                  />
                </div>
              </div>
            )}

            <button
              className={`btn btn-primary auth-submit-btn auth-submit-green ${submitting ? 'loading' : ''}`}
              type="submit"
              id="signup-submit"
              disabled={submitting}
            >
              {submitting ? <><span className="spinner" /> Creating account…</> : '✓ Create Account'}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account?{' '}
            <button className="auth-switch-link" onClick={onShowLogin} type="button">
              Sign in →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Password strength helpers ── */
function pwdScore(pwd) {
  let s = 0;
  if (pwd.length >= 6)  s++;
  if (pwd.length >= 10) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/\d/.test(pwd))    s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s; // 0-5
}

function pwdLabel(pwd) {
  const s = pwdScore(pwd);
  return s <= 1 ? 'Weak' : s <= 3 ? 'Medium' : 'Strong';
}

function pwdColor(pwd) {
  const s = pwdScore(pwd);
  return s <= 1 ? 'var(--red)' : s <= 3 ? 'var(--yellow)' : 'var(--green)';
}

function pwdWidth(pwd) {
  return `${Math.min((pwdScore(pwd) / 5) * 100, 100)}%`;
}

export default Signup;
