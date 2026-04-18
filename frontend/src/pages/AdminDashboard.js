import React, { useState } from 'react';
import Navbar              from '../components/Navbar';
import AdminOverview       from './admin/AdminOverview';
import AdminColleges       from './admin/AdminColleges';
import AdminVendors        from './admin/AdminVendors';
import AdminUsers          from './admin/AdminUsers';
import AdminOrders         from './admin/AdminOrders';
import AdminAnalytics      from './admin/AdminAnalytics';
import AdminSubscriptions  from './admin/AdminSubscriptions';
import { PLATFORM_SUMMARY, SMART_ALERTS } from './admin/adminData';
import '../styles.css';

const ps = PLATFORM_SUMMARY;

const NAV_ITEMS = [
  { id: 'overview',       icon: '📊', label: 'Overview'      },
  { id: 'colleges',       icon: '🏫', label: 'Colleges'      },
  { id: 'vendors',        icon: '🍽️', label: 'Vendors'       },
  { id: 'users',          icon: '👥', label: 'Users'         },
  { id: 'orders',         icon: '📦', label: 'Orders'        },
  { id: 'analytics',      icon: '📈', label: 'Analytics'     },
  { id: 'subscriptions',  icon: '💳', label: 'Subscriptions' },
];

/**
 * AdminDashboard (v2)
 * -------------------
 * Full SaaS Admin Control Panel shell.
 * Replaces the old waste-analytics-only AdminDashboard.
 */
function AdminDashboard({ auth, onLogout }) {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const alertCount = SMART_ALERTS.filter(a => a.type === 'danger').length;

  const renderPage = () => {
    switch (page) {
      case 'overview':      return <AdminOverview      onNavigate={setPage} />;
      case 'colleges':      return <AdminColleges      />;
      case 'vendors':       return <AdminVendors       />;
      case 'users':         return <AdminUsers         />;
      case 'orders':        return <AdminOrders        />;
      case 'analytics':     return <AdminAnalytics     />;
      case 'subscriptions': return <AdminSubscriptions />;
      default:              return <AdminOverview      onNavigate={setPage} />;
    }
  };

  return (
    <div className="adm-root">
      {/* ── Top header ── */}
      <header className="adm-header">
        <div className="adm-header-inner">
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="adm-burger"
              onClick={() => setSidebarOpen(s => !s)}
              title="Toggle sidebar"
            >
              ☰
            </button>
            <button
              className="adm-brand"
              onClick={() => setPage('overview')}
              title="Go to Overview"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span>🍽️</span>
              <span>Opti<span style={{ color: 'var(--accent)' }}>Meal</span></span>
              <span className="adm-brand-tag">Admin</span>
            </button>
          </div>

          {/* Right section */}
          <div className="adm-header-right">
            {/* Quick stats strip */}
            <div className="adm-header-stats">
              <span>🏫 {ps.activeColleges} Colleges</span>
              <span>📦 {ps.totalOrdersToday.toLocaleString()} Today</span>
              <span style={{ color: 'var(--green)' }}>💰 ₹{(ps.totalRevenueMRR/1000).toFixed(0)}K MRR</span>
            </div>

            {/* Alert bell */}
            <div style={{ position: 'relative' }}>
              <button className="adm-header-icon-btn" title="Alerts" onClick={() => setPage('overview')}>
                🔔
              </button>
              {alertCount > 0 && (
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  background: 'var(--red)', color: '#fff',
                  width: 16, height: 16, borderRadius: '50%',
                  fontSize: '0.6rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{alertCount}</span>
              )}
            </div>

            {/* Admin avatar + logout */}
            <div className="adm-user-pill">
              <div className="adm-avatar">{auth.userName.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{auth.userName}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Super Admin</div>
              </div>
            </div>

            <button className="adm-logout-btn" onClick={onLogout}>Logout →</button>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="adm-body">

        {/* ── Sidebar ── */}
        <aside className={`adm-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          {/* Platform health at top */}
          {sidebarOpen && (
            <div className="adm-sidebar-health">
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                Platform Health
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Uptime</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)' }}>99.8%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '99.8%', height: '100%', background: 'var(--green)', borderRadius: 99 }} />
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="adm-sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`adm-nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => setPage(item.id)}
                id={`admin-nav-${item.id}`}
                title={item.label}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="adm-nav-label">{item.label}</span>}
                {/* Badge for orders */}
                {item.id === 'orders' && ps.activeOrders > 0 && (
                  <span className="adm-nav-badge">{ps.activeOrders}</span>
                )}
                {/* Badge for analytics (churn alert) */}
                {item.id === 'analytics' && (
                  <span className="adm-nav-badge" style={{ background: 'var(--red)' }}>!</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom status */}
          {sidebarOpen && (
            <div className="adm-sidebar-footer">
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>SaaS Platform v2.0</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--green)' }}>
                <span style={{ width: 7, height: 7, background: 'var(--green)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                All systems operational
              </div>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="adm-main">
          {/* Breadcrumb */}
          <div className="adm-breadcrumb">
            <span style={{ color: 'var(--text-muted)' }}>Admin</span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {NAV_ITEMS.find(n => n.id === page)?.label || 'Overview'}
            </span>
          </div>

          {/* Page content */}
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
