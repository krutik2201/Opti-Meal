import React from 'react';

const ROLE_LABELS = {
  student: 'Student',
  vendor:  'Vendor',
  admin:   'Admin',
};

const ROLE_ICONS = {
  student: '🎓',
  vendor:  '🍽️',
  admin:   '📊',
};

/**
 * Navbar
 * -------
 * Shared top navigation for all role dashboards.
 * Shows: Brand | Role badge | Username | Logout button
 *
 * Props:
 *   userName (string) — the logged-in user's display name
 *   role     (string) — 'student' | 'vendor' | 'admin'
 *   onLogout (fn)     — clears localStorage and returns to Login
 */
function Navbar({ userName, role, onLogout }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-name">
            Opti<span>Meal</span>
            <span className="navbar-saas-label">SaaS</span>
          </span>
        </div>

        {/* Right: Role badge + username + logout */}
        <div className="navbar-right">
          <span className={`role-tag role-tag--${role}`} style={{ marginBottom: 0 }}>
            {ROLE_ICONS[role]} {ROLE_LABELS[role]}
          </span>

          <div className="navbar-username">
            <span className="navbar-avatar">
              {userName ? userName.charAt(0).toUpperCase() : '?'}
            </span>
            <span className="navbar-username-text">{userName}</span>
          </div>

          <button
            className="navbar-logout-btn"
            onClick={onLogout}
            id="navbar-logout-btn"
          >
            Logout →
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
