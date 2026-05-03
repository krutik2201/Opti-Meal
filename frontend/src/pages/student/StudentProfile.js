import React from 'react';

function StudentProfile({ auth, onLogout, orderHistory, onNavigate }) {
  const totalSpent = orderHistory.reduce((sum, o) => sum + o.total, 0);
  const ordersPlaced = orderHistory.length;

  return (
    <div style={{ padding: '1.25rem 0' }}>

      {/* ── Avatar + Name ── */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 800, color: '#000',
          margin: '0 auto 1rem',
          boxShadow: '0 0 30px rgba(56,189,248,0.2)',
        }}>
          {auth?.userName ? auth.userName.charAt(0).toUpperCase() : '?'}
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.2rem' }}>{auth?.userName || 'Student'}</h1>
        <span style={{
          display: 'inline-block',
          background: 'var(--accent-dim)', border: '1px solid rgba(56,189,248,0.3)',
          color: 'var(--accent)', padding: '0.2rem 0.7rem', borderRadius: 99,
          fontSize: '0.72rem', fontWeight: 700,
        }}>🎓 Student</span>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.6rem', marginBottom: '1.75rem',
      }}>
        {[
          { val: ordersPlaced, lbl: 'Orders', color: 'var(--accent)' },
          { val: `₹${totalSpent}`, lbl: 'Total Spent', color: 'var(--yellow)' },
          { val: `${ordersPlaced * 8}m`, lbl: 'Time Saved', color: 'var(--green)' },
        ].map(s => (
          <div key={s.lbl} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '1rem 0.75rem',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: s.color, marginBottom: '0.2rem' }}>{s.val}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Preferences ── */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '1.1rem 1.2rem',
        marginBottom: '1rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem' }}>⚙️ Preferences</div>
        {[
          { label: 'Diet', value: 'Vegetarian' },
          { label: 'Favorite Vendor', value: 'Campus Café' },
          { label: 'Favorite Item', value: 'Masala Tea' },
        ].map(pref => (
          <div key={pref.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.55rem 0',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>{pref.label}</span>
            <span style={{ fontWeight: 600 }}>{pref.value}</span>
          </div>
        ))}
      </div>

      {/* ── Order History ── */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '1.1rem 1.2rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>📋 Order History</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ordersPlaced} orders</span>
        </div>

        {orderHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No orders yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {orderHistory.slice(0, 5).map((order, i) => (
              <div key={order.id || i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.65rem 0',
                borderBottom: i < Math.min(orderHistory.length, 5) - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.1rem' }}>
                    {order.items.map(i => i.name).join(', ')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {order.date} · {order.id}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)' }}>₹{order.total}</div>
                    <div style={{
                      fontSize: '0.62rem', fontWeight: 700,
                      color: order.status === 'Delivered' ? 'var(--green)' : 'var(--yellow)',
                    }}>{order.status}</div>
                  </div>
                  <button onClick={() => onNavigate('menu')} style={{
                    background: 'var(--accent-dim)', border: '1px solid rgba(56,189,248,0.2)',
                    color: 'var(--accent)', padding: '0.3rem 0.6rem', borderRadius: '6px',
                    fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>Reorder</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Logout ── */}
      <button
        id="profile-logout-btn"
        onClick={onLogout}
        style={{
          width: '100%', padding: '0.85rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          fontSize: '0.92rem', fontWeight: 700, fontFamily: 'inherit',
          border: '1.5px solid var(--red)', background: 'var(--red-dim)',
          color: 'var(--red)', cursor: 'pointer', borderRadius: 'var(--radius-sm)',
          transition: 'background 0.15s',
          marginBottom: '1rem',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--red-dim)'}
      >
        ↩ Logout
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        OptiMeal · Student v3.0 · Simplified
      </p>
    </div>
  );
}

export default StudentProfile;
