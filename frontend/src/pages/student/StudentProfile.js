import React, { useState } from 'react';

function StudentProfile({ auth, onLogout, orderHistory, onNavigate }) {
  const [walletBalance, setWalletBalance] = useState(250);
  const [showTopUp,     setShowTopUp]     = useState(false);
  const [topUpAmt,      setTopUpAmt]      = useState(100);

  const totalSpent   = orderHistory.reduce((sum, o) => sum + o.total, 0);
  const ordersPlaced = orderHistory.length;

  const handleTopUp = () => {
    setWalletBalance(b => b + topUpAmt);
    setShowTopUp(false);
  };

  /* ── Profile menu items — all wired to real pages ── */
  const PROFILE_MENU = [
    {
      icon: '📋',
      label: 'Order History',
      sub: `${ordersPlaced} past orders`,
      page: 'history',
    },
    {
      icon: '⭐',
      label: 'My Reviews',
      sub: 'Rate your recent orders',
      page: 'reviews',
    },
    {
      icon: '🔔',
      label: 'Notifications',
      sub: 'Order alerts & offers',
      page: 'notifications',
    },
    {
      icon: '🎁',
      label: 'Offers & Rewards',
      sub: 'View available coupons & deals',
      page: 'offers',
    },
    {
      icon: '📊',
      label: 'My Insights',
      sub: 'Spending & streak analytics',
      page: 'insights',
    },
    {
      icon: '🤖',
      label: 'AI Picks',
      sub: 'Personalized recommendations',
      page: 'ai',
    },
    {
      icon: '❤️',
      label: 'Favorites',
      sub: 'Your saved items',
      page: 'favorites',
    },
    {
      icon: '💬',
      label: 'Help & Support',
      sub: 'Report an issue or get help',
      page: 'complaint',
    },
  ];

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Avatar + name ── */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          className="profile-avatar-lg"
          style={{ margin: '0 auto 1rem' }}
        >
          {auth.userName.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>{auth.userName}</h1>
        <span className="role-tag role-tag--student" style={{ marginBottom: 0 }}>🎓 Student</span>
      </div>

      {/* ── Stats ── */}
      <div className="profile-stat-grid">
        {[
          { val: ordersPlaced,         lbl: 'Orders',      color: 'var(--accent)' },
          { val: `₹${totalSpent}`,     lbl: 'Total Spent', color: 'var(--yellow)' },
          { val: `₹${Math.round(ordersPlaced * 4)}`, lbl: 'Saved', color: 'var(--green)' },
        ].map(s => (
          <div className="profile-stat" key={s.lbl}>
            <div className="profile-stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="profile-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Wallet ── */}
      <div className="wallet-card" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="wallet-label">🪙 OptiMeal Wallet</div>
          <div className="wallet-balance">₹{walletBalance}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Available balance</div>
        </div>
        <button
          className="btn btn-primary"
          style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', width: 'auto' }}
          onClick={() => setShowTopUp(!showTopUp)}
        >
          + Top Up
        </button>
      </div>

      {showTopUp && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <p className="card-title"><span className="icon">💳</span> Add Money</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
            {[50, 100, 200, 500].map(amt => (
              <button
                key={amt}
                className={`filter-chip ${topUpAmt === amt ? 'active' : ''}`}
                onClick={() => setTopUpAmt(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary auth-submit-green"
            style={{ justifyContent: 'center', padding: '0.7rem' }}
            onClick={handleTopUp}
          >
            Add ₹{topUpAmt} to Wallet
          </button>
        </div>
      )}

      {/* ── Profile menu — all buttons navigate to real pages ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {PROFILE_MENU.map(opt => (
          <button
            key={opt.label}
            onClick={() => onNavigate(opt.page)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.1rem',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.15s, background 0.15s',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)';
              e.currentTarget.style.background = 'rgba(56,189,248,0.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{
                fontSize: '1.2rem', width: '2.2rem', height: '2.2rem',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{opt.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{opt.label}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{opt.sub}</div>
              </div>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 700 }}>›</span>
          </button>
        ))}
      </div>

      {/* ── Logout ── */}
      <button
        id="profile-logout-btn"
        style={{
          width: '100%',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          border: '1.5px solid var(--red)',
          background: 'var(--red-dim)',
          color: 'var(--red)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          transition: 'background 0.15s',
          marginBottom: '0.5rem',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--red-dim)'}
        onClick={onLogout}
      >
        <span>↩</span> Logout
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '0.5rem' }}>
        OptiMeal SaaS · Student v2.0 · Demo Prototype
      </p>
    </div>
  );
}

export default StudentProfile;
