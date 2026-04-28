import React, { useState, useEffect } from 'react';
import { VENDORS, MENU_ITEMS, AI_COMBOS, REORDER_HINT } from './data';

const QUICK_ACTIONS = [
  { icon: '⚡', label: 'Zero-Wait', view: 'zerowait', color: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.06))', border: 'rgba(16,185,129,0.4)', text: 'var(--green)' },
  { icon: '🧠', label: 'Instant Pick', view: 'instant', color: 'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(167,139,250,0.06))', border: 'rgba(167,139,250,0.4)', text: '#a78bfa' },
  { icon: '📊', label: 'Live Queue', view: 'queue', color: 'linear-gradient(135deg,rgba(56,189,248,0.18),rgba(56,189,248,0.06))', border: 'rgba(56,189,248,0.3)', text: 'var(--accent)' },
  { icon: '🎁', label: 'Offers', view: 'offers', color: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(245,158,11,0.06))', border: 'rgba(245,158,11,0.3)', text: 'var(--yellow)' },
];

function loadColor(load) {
  if (load < 40) return 'var(--green)';
  if (load < 80) return 'var(--yellow)';
  return 'var(--red)';
}
function loadLabel(load) {
  if (load < 40) return 'Fast';
  if (load < 80) return 'Moderate';
  return 'Slow';
}
function loadEmoji(load) {
  if (load < 40) return '🟢';
  if (load < 80) return '🟡';
  return '🔴';
}

function KitchenGauge({ load }) {
  const color = loadColor(load);
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - load / 100)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontWeight: 800, color, fontSize: '0.72rem', lineHeight: 1 }}>{load}%</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.48rem', marginTop: 1 }}>load</span>
      </div>
    </div>
  );
}

function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
        animation: 'pulse-live 1.5s ease-in-out infinite', display: 'inline-block',
      }} />
      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--green)' }}>Live</span>
    </span>
  );
}

function StudentHome({ auth, onNavigate, onNavigateToVendor, onAddToCart, cartCount, kitchenLoads }) {
  const [adding, setAdding] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hr = currentTime.getHours();
  const greeting = hr < 5 ? 'Good night' : hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  // Time display
  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Session
  const sessionKey = hr < 11 ? 'morning' : hr < 15 ? 'lunch' : 'evening';
  const SESSION_TAGS = {
    morning: { label: '🌅 Breakfast Time', sub: 'Best before 11 AM', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: 'var(--yellow)' },
    lunch:   { label: '🍛 Lunch Rush',     sub: 'Peak hours 12–2 PM',  color: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: 'var(--red)' },
    evening: { label: '☕ Evening Snacks', sub: 'Light menu available', color: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.25)', text: 'var(--accent)' },
  };
  const session = SESSION_TAGS[sessionKey];

  const popularItems = MENU_ITEMS.filter(i => i.available && i.tags.includes('popular')).slice(0, 8);
  const bestVendor   = VENDORS.reduce((a, b) => (kitchenLoads[a.id] || a.kitchenLoad) < (kitchenLoads[b.id] || b.kitchenLoad) ? a : b);
  const worstVendor  = VENDORS.reduce((a, b) => (kitchenLoads[a.id] || a.kitchenLoad) > (kitchenLoads[b.id] || b.kitchenLoad) ? a : b);
  const avgLoad      = Math.round(VENDORS.reduce((s, v) => s + (kitchenLoads[v.id] || v.kitchenLoad), 0) / VENDORS.length);
  const fastItems    = MENU_ITEMS.filter(i => i.available && i.prepMins <= 4).slice(0, 3);

  const handleAdd = (item) => {
    setAdding(item.id);
    onAddToCart(item);
    setTimeout(() => setAdding(null), 900);
  };

  const reorderItems = REORDER_HINT.items.map(id => MENU_ITEMS.find(m => m.id === id)).filter(Boolean);

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── HERO: Time Control Dashboard ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,22,35,0.95), rgba(8,12,20,0.98))',
        border: '1px solid rgba(56,189,248,0.12)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          background: `radial-gradient(circle, ${avgLoad > 80 ? 'rgba(239,68,68,0.12)' : avgLoad > 50 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
              {greeting} 👋
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.3rem' }}>
              Hey, {auth.userName.split(' ')[0]}!
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
              You're in control of your time.
            </div>
          </div>
          {/* Live clock */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: loadColor(avgLoad), letterSpacing: '-0.03em', lineHeight: 1 }}>
              {timeStr}
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <LiveDot />
            </div>
          </div>
        </div>

        {/* Campus status strip */}
        <div style={{
          background: avgLoad > 80
            ? 'rgba(239,68,68,0.1)' : avgLoad > 50
            ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${loadColor(avgLoad)}33`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem 0.9rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: loadColor(avgLoad) }}>
              {loadEmoji(avgLoad)} Campus Kitchen — {loadLabel(avgLoad)}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Avg load: {avgLoad}% · {VENDORS.filter(v => (kitchenLoads[v.id] || v.kitchenLoad) < 40).length} vendors fast right now
            </div>
          </div>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            onClick={() => onNavigate('queue')}
          >Details →</button>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.7rem 1rem', fontSize: '0.88rem', justifyContent: 'center' }}
            onClick={() => onNavigate('zerowait')}
          >⚡ Zero-Wait Order</button>
          <button
            style={{
              flex: 1, padding: '0.7rem 1rem', fontSize: '0.88rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
            onClick={() => onNavigate('menu')}
          >Browse Menu →</button>
        </div>
      </div>

      {/* ── Session Label ── */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: session.color, border: `1px solid ${session.border}`,
        borderRadius: 99, padding: '0.3rem 0.85rem', marginBottom: '1.25rem',
        fontSize: '0.72rem', fontWeight: 700, color: session.text,
      }}>
        {session.label} · {session.sub}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1.75rem' }}>
        {QUICK_ACTIONS.map(qa => (
          <button
            key={qa.view}
            onClick={() => onNavigate(qa.view)}
            style={{
              background: qa.color, border: `1px solid ${qa.border}`,
              borderRadius: 'var(--radius-sm)', padding: '0.9rem 0.4rem',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.94)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '1.35rem' }}>{qa.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: qa.text, textAlign: 'center', lineHeight: 1.3 }}>{qa.label}</span>
          </button>
        ))}
      </div>

      {/* ── ⚡ Fastest Items Right Now ── */}
      <div className="section-header-row" style={{ marginBottom: '0.75rem' }}>
        <h2 className="stu-section-title">⚡ Fastest Right Now</h2>
        <button className="view-all-btn" onClick={() => onNavigate('zerowait')}>Zero-Wait →</button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {fastItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleAdd(item)}
            style={{
              flexShrink: 0, width: 130,
              background: 'var(--bg-card)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 0.75rem',
              cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--green),transparent)' }} />
            <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem', textAlign: 'center' }}>{item.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem', lineHeight: 1.3 }}>{item.name}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 99, padding: '0.12rem 0.45rem',
              fontSize: '0.65rem', fontWeight: 700, color: 'var(--green)',
            }}>⚡ {item.prepTime}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              ₹{item.price}
              {adding === item.id && <span style={{ color: 'var(--green)', marginLeft: '0.3rem' }}>✓ Added</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Auto-reorder hint ── */}
      <div className="smart-tip-banner" style={{ marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => {
        reorderItems.forEach(item => onAddToCart(item));
        onNavigate('cart');
      }}>
        <div className="smart-tip-icon">🔄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.1rem' }}>{REORDER_HINT.text}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Last at {REORDER_HINT.lastAt} · {reorderItems.map(i => i.name).join(' + ')}
          </div>
        </div>
        <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>Reorder →</span>
      </div>

      {/* ── Live Kitchen Load Per Vendor ── */}
      <div className="section-header-row" style={{ marginBottom: '0.75rem' }}>
        <h2 className="stu-section-title">📊 Live Kitchen Load</h2>
        <LiveDot />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.65rem', marginBottom: '1.75rem' }}>
        {VENDORS.map(v => {
          const load = kitchenLoads[v.id] || v.kitchenLoad;
          const color = loadColor(load);
          return (
            <button
              key={v.id}
              onClick={() => onNavigateToVendor(v.id)}
              style={{
                background: 'var(--bg-card)', border: `1px solid var(--border)`,
                borderRadius: 'var(--radius-md)', padding: '0.9rem',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                transition: 'border-color 0.25s, transform 0.15s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Top accent line based on load */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: color, opacity: 0.7, borderRadius: '99px 99px 0 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <KitchenGauge load={load} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.12rem' }}>
                    <span style={{ fontSize: '0.95rem' }}>{v.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{v.name}</span>
                  </div>
                  <div style={{ fontWeight: 700, color, fontSize: '0.75rem' }}>{loadLabel(load)}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>~{v.wait} min wait</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '0.65rem', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${load}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: 700, marginTop: '0.45rem' }}>View Menu →</div>
            </button>
          );
        })}
      </div>

      {/* ── Smart Tip ── */}
      <div className="smart-tip-banner" style={{ marginBottom: '1.75rem' }}>
        <div className="smart-tip-icon">💡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.15rem' }}>Smart Recommendation</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {bestVendor.name} is at&nbsp;
            <strong style={{ color: 'var(--green)' }}>{kitchenLoads[bestVendor.id] || bestVendor.kitchenLoad}%</strong> load — fastest now.&nbsp;
            {worstVendor.id !== bestVendor.id && (
              <span>Avoid {worstVendor.name} (<span style={{ color: 'var(--red)' }}>{kitchenLoads[worstVendor.id] || worstVendor.kitchenLoad}%</span>).</span>
            )}
          </div>
        </div>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.73rem', fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}
          onClick={() => onNavigateToVendor(bestVendor.id)}
        >Order →</button>
      </div>

      {/* ── Popular Items ── */}
      <div className="section-header-row" style={{ marginBottom: '0.75rem' }}>
        <h2 className="stu-section-title">🔥 Most Ordered Today</h2>
        <button className="view-all-btn" onClick={() => onNavigate('menu')}>See all →</button>
      </div>
      <div className="h-scroll-row" style={{ marginBottom: '1.75rem' }}>
        {popularItems.map(item => {
          const pColor = item.prepMins <= 4 ? 'var(--green)' : item.prepMins <= 7 ? 'var(--yellow)' : 'var(--red)';
          return (
            <div className="popular-card" key={item.id} onClick={() => handleAdd(item)}>
              <div className="popular-card-emoji" style={{ background: item.gradient, position: 'relative' }}>
                {item.emoji}
                {adding === item.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', borderRadius: 'var(--radius-sm)' }}>✓</div>
                )}
              </div>
              <div className="popular-card-body">
                <div className="popular-card-name">{item.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15rem' }}>
                  <div className="popular-card-price">₹{item.price}</div>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, color: pColor,
                    background: `${pColor === 'var(--green)' ? 'rgba(16,185,129,0.15)' : pColor === 'var(--yellow)' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}`,
                    borderRadius: 99, padding: '0.1rem 0.35rem',
                  }}>⚡{item.prepMins}m</div>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.vendorName}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── AI Combos ── */}
      <div className="section-header-row" style={{ marginBottom: '0.75rem' }}>
        <h2 className="stu-section-title">💡 AI Combos</h2>
        <button className="view-all-btn" onClick={() => onNavigate('ai')}>See all →</button>
      </div>
      {AI_COMBOS.slice(0, 2).map(combo => {
        const comboItems = combo.itemIds.map(id => MENU_ITEMS.find(m => m.id === id)).filter(Boolean);
        const total = comboItems.reduce((sum, i) => sum + i.price, 0);
        const maxPrep = Math.max(...comboItems.map(i => i.prepMins));
        return (
          <div className="combo-card" key={combo.id}>
            <div>
              <div className="combo-items">{combo.items.join(' + ')}</div>
              <div className="combo-reason">{combo.reason}</div>
              <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{total}</span>
                {combo.saving > 0 && <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.78rem' }}>– save ₹{combo.saving}</span>}
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>⚡ ~{maxPrep} min</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span className="combo-badge">{combo.badge}</span>
              <button className="add-btn" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }} onClick={() => comboItems.forEach(item => handleAdd(item))}>+ Add Combo</button>
            </div>
          </div>
        );
      })}
      <div style={{ height: '1.5rem' }} />
    </div>
  );
}

export default StudentHome;
