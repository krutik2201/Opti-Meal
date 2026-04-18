import React from 'react';

const ROLES = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Student',
    desc: 'Browse food shops on campus, check crowd levels, and find the best time to visit.',
    perks: ['View all canteens & menus', 'Real-time crowd indicator', 'Smart visit time suggestion', 'Menu item preview'],
    tag: 'role-tag--student',
    card: 'role-card--student',
  },
  {
    id: 'vendor',
    icon: '🍽️',
    title: 'Vendor',
    desc: 'Own a food stall? Input your weekly sales and get AI-powered prep recommendations.',
    perks: ['7-day demand prediction', 'Preparation quantity guide', 'Waste reduction analysis', 'Sample data pre-fill'],
    tag: 'role-tag--vendor',
    card: 'role-card--vendor',
  },
  {
    id: 'admin',
    icon: '📊',
    title: 'Admin',
    desc: 'Platform-wide operational overview — waste savings, vendor performance, efficiency.',
    perks: ['System-wide waste metrics', 'Vendor efficiency rankings', 'Crowd distribution stats', 'Live performance charts'],
    tag: 'role-tag--admin',
    card: 'role-card--admin',
  },
];

/**
 * RoleSelect
 * ----------
 * Landing page that lets users choose their role.
 * No authentication — role is simulated via state.
 *
 * Props:
 *   onSelect(role) — lifts chosen role to App
 */
function RoleSelect({ onSelect }) {
  return (
    <div className="role-page">
      {/* Hero */}
      <div className="role-hero">
        <span className="role-hero-icon">🍽️</span>
        <h1>
          Opti<span>Meal</span> SaaS
        </h1>
        <p>
          Multi-vendor food demand optimization platform for colleges, hostels, and NGOs.
          Choose your role to continue.
        </p>
      </div>

      {/* Role Cards */}
      <div className="role-grid">
        {ROLES.map((role) => (
          <div
            key={role.id}
            className={`role-card ${role.card}`}
            onClick={() => onSelect(role.id)}
            role="button"
            tabIndex={0}
            id={`role-btn-${role.id}`}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(role.id)}
            aria-label={`Continue as ${role.title}`}
          >
            <span className={`role-tag ${role.tag}`}>{role.title}</span>
            <span className="role-card-icon">{role.icon}</span>
            <div className="role-card-title">{role.title}</div>
            <div className="role-card-desc">{role.desc}</div>
            <ul className="role-card-perks">
              {role.perks.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        No login required · Prototype demo · All data is simulated
      </p>
    </div>
  );
}

export default RoleSelect;
