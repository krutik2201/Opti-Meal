import React, { useState } from 'react';
import { VENDORS, MENU_ITEMS, AI_COMBOS } from './data';

const RUSH_COLOR = { Low: 'var(--green)', Medium: 'var(--yellow)', High: 'var(--red)', 'Very High': '#dc2626' };
const RUSH_ICON  = { Low: '🟢', Medium: '🟡', High: '🟠', 'Very High': '🔴' };

const QUICK_ACTIONS = [
  { icon: '🧠', label: 'Smart Queue', view: 'queue',    color: 'linear-gradient(135deg,rgba(56,189,248,0.15),rgba(56,189,248,0.08))' },
  { icon: '🤖', label: 'AI Picks',    view: 'ai',       color: 'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(167,139,250,0.08))' },
  { icon: '🎁', label: 'Offers',      view: 'offers',   color: 'linear-gradient(135deg,rgba(250,204,21,0.15),rgba(250,204,21,0.08))' },
  { icon: '📊', label: 'Insights',    view: 'insights', color: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.08))' },
];

function StudentHome({ auth, onNavigate, onNavigateToVendor, onAddToCart, cartCount }) {
  const [adding, setAdding] = useState(null);

  const hr = new Date().getHours();
  const greeting =
    hr < 5  ? 'Good night'    :
    hr < 12 ? 'Good morning'  :
    hr < 17 ? 'Good afternoon': 'Good evening';

  const popularItems = MENU_ITEMS
    .filter(i => i.available && i.tags.includes('popular'))
    .slice(0, 8);

  const bestVendor  = VENDORS.reduce((a, b) => a.wait < b.wait ? a : b);
  const rushVendors = VENDORS.filter(v => v.rush === 'High' || v.rush === 'Very High');

  const handleAdd = (item) => {
    setAdding(item.id);
    onAddToCart(item);
    setTimeout(() => setAdding(null), 1000);
  };

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Hero banner ── */}
      <div className="home-hero">
        <p className="home-hero-greeting">{greeting} 👋</p>
        <h1 className="home-hero-title">
          Hey, {auth.userName.split(' ')[0]}!
          <br />
          <span style={{ color: 'var(--accent)', fontSize: '1.15rem' }}>
            Ready to skip the queue?
          </span>
        </h1>
        <p className="home-hero-sub">
          Browse {MENU_ITEMS.length}+ items across {VENDORS.length} campus vendors
          {rushVendors.length > 0 && (
            <span style={{ color: 'var(--yellow)', marginLeft: '0.4rem', fontWeight: 600 }}>
              · ⚡ Rush at {rushVendors.length} spot{rushVendors.length > 1 ? 's' : ''}
            </span>
          )}
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
            onClick={() => onNavigate('menu')}
          >
            Browse Menu →
          </button>
          <button
            className="btn"
            style={{
              width: 'auto', padding: '0.65rem 1.1rem', fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 'var(--radius-sm)',
            }}
            onClick={() => onNavigate('queue')}
          >
            🧠 Check Queue
          </button>
        </div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {QUICK_ACTIONS.map(qa => (
          <button
            key={qa.view}
            onClick={() => onNavigate(qa.view)}
            style={{
              background: qa.color,
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 0.4rem',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '1.4rem' }}>{qa.icon}</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* ── Smart Tip ── */}
      <div className="smart-tip-banner" style={{ marginBottom: '1.75rem' }}>
        <div className="smart-tip-icon">💡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.15rem' }}>Smart Tip</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {bestVendor.name} has the shortest wait right now —&nbsp;
            <strong style={{ color: 'var(--green)' }}>{bestVendor.wait} min</strong>.
            Order now to skip the rush!
          </div>
        </div>
      </div>

      {/* ── Live Queue Status ── */}
      <div className="section-header-row">
        <h2 className="stu-section-title">⏱️ Live Queue Status</h2>
        <button className="view-all-btn" onClick={() => onNavigate('queue')}>Details →</button>
      </div>
      <div className="queue-cards" style={{ marginBottom: '1.75rem' }}>
        {VENDORS.map(v => (
          <div
            className="queue-card"
            key={v.id}
            onClick={() => onNavigateToVendor(v.id)}
            style={{ cursor: 'pointer' }}
            title={`Browse ${v.name} menu`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>{v.emoji}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{v.name}</span>
            </div>
            <div className="queue-card-wait">
              {v.wait}
              <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}> min</span>
            </div>
            <div className="queue-card-rush-label" style={{ color: RUSH_COLOR[v.rush] }}>
              {RUSH_ICON[v.rush]} {v.rush} Rush
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600 }}>View Menu →</div>
          </div>
        ))}
      </div>

      {/* ── AI Combo Recommendations ── */}
      <div className="section-header-row">
        <h2 className="stu-section-title">💡 AI Combos</h2>
        <button className="view-all-btn" onClick={() => onNavigate('ai')}>See all →</button>
      </div>
      {AI_COMBOS.slice(0, 2).map(combo => {
        const comboItems = combo.itemIds
          .map(id => MENU_ITEMS.find(m => m.id === id))
          .filter(Boolean);
        const total = comboItems.reduce((sum, i) => sum + i.price, 0);
        return (
          <div className="combo-card" key={combo.id}>
            <div>
              <div className="combo-items">{combo.items.join(' + ')}</div>
              <div className="combo-reason">{combo.reason}</div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                ₹{total}{combo.saving > 0 && <span style={{ color: 'var(--green)', fontWeight: 700, marginLeft: '0.3rem' }}>– save ₹{combo.saving}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span className="combo-badge">{combo.badge}</span>
              <button
                className="add-btn"
                style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                onClick={() => comboItems.forEach(item => handleAdd(item))}
              >
                + Add Combo
              </button>
            </div>
          </div>
        );
      })}

      {/* ── Popular Items ── */}
      <div className="section-header-row" style={{ marginTop: '1.75rem' }}>
        <h2 className="stu-section-title">🔥 Most Ordered Today</h2>
        <button className="view-all-btn" onClick={() => onNavigate('menu')}>See all →</button>
      </div>
      <div className="h-scroll-row">
        {popularItems.map(item => (
          <div
            className="popular-card"
            key={item.id}
            onClick={() => handleAdd(item)}
            title={`Add ${item.name} to cart`}
          >
            <div className="popular-card-emoji" style={{ background: item.gradient }}>
              {item.emoji}
              {adding === item.id && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', borderRadius: 'var(--radius-sm)',
                }}>✓</div>
              )}
            </div>
            <div className="popular-card-body">
              <div className="popular-card-name">{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="popular-card-price">₹{item.price}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--yellow)' }}>⭐ {item.rating}</div>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {item.vendorName}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Vendors ── */}
      <div className="section-header-row" style={{ marginTop: '1.75rem' }}>
        <h2 className="stu-section-title">🏪 Campus Vendors</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
        {VENDORS.map(v => (
          <button
            key={v.id}
            className="card"
            onClick={() => onNavigateToVendor(v.id)}
            style={{
              padding: '0.9rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', textAlign: 'left', width: '100%', fontFamily: 'inherit',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            title={`Browse ${v.name} menu`}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0,
            }}>{v.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem', color: 'var(--text-primary)' }}>{v.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.location}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{v.wait} min</div>
              <div style={{ fontSize: '0.68rem', color: RUSH_COLOR[v.rush], fontWeight: 600 }}>
                {RUSH_ICON[v.rush]} {v.rush}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.2rem' }}>View Menu →</div>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}

export default StudentHome;
