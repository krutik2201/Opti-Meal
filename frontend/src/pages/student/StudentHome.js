import React, { useState, useEffect } from 'react';
import { VENDORS, MENU_ITEMS } from './data';

/* ── Helpers ── */
function rushColor(level) {
  if (level === 'Low') return 'var(--green)';
  if (level === 'Medium') return 'var(--yellow)';
  return 'var(--red)';
}
function rushBg(level) {
  if (level === 'Low') return 'rgba(16,185,129,0.08)';
  if (level === 'Medium') return 'rgba(245,158,11,0.08)';
  return 'rgba(239,68,68,0.08)';
}
function rushBorder(level) {
  if (level === 'Low') return 'rgba(16,185,129,0.25)';
  if (level === 'Medium') return 'rgba(245,158,11,0.25)';
  return 'rgba(239,68,68,0.25)';
}
function computeRush(load) {
  if (load < 40) return 'Low';
  if (load < 75) return 'Medium';
  return 'High';
}
function smartMessage(rush) {
  const now = new Date();
  const mins = now.getMinutes();
  if (rush === 'Low') return 'Great time to order! Queue is moving fast.';
  if (rush === 'Medium') {
    const bestMin = mins < 30 ? '45' : '15';
    const bestHr = mins < 30 ? now.getHours() : now.getHours() + 1;
    const hr12 = bestHr > 12 ? bestHr - 12 : bestHr;
    const ampm = bestHr >= 12 ? 'PM' : 'AM';
    return `Best time to order: ${hr12}:${bestMin} ${ampm}`;
  }
  return 'Rush expected — consider ordering in 10 min';
}

/* ── Quick order items (top 4 fast+popular) ── */
const QUICK_ITEMS = MENU_ITEMS
  .filter(i => i.available && i.prepMins <= 7)
  .sort((a, b) => b.reviews - a.reviews)
  .slice(0, 4);

function StudentHome({ auth, onNavigate, onNavigateToVendor, onAddToCart, currentOrder, kitchenLoads }) {
  const [adding, setAdding] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const avgLoad = Math.round(
    VENDORS.reduce((s, v) => s + (kitchenLoads[v.id] || v.kitchenLoad), 0) / VENDORS.length
  );
  const rush = computeRush(avgLoad);
  const waitMin = rush === 'Low' ? '3–5' : rush === 'Medium' ? '8–12' : '12–18';

  const handleAdd = (item) => {
    setAdding(item.id);
    onAddToCart(item);
    setTimeout(() => setAdding(null), 1000);
  };

  const greeting = () => {
    const hr = currentTime.getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="simple-home">

      {/* ═══════════════════════════════════════════════
          1. HEADER — GREETING
         ═══════════════════════════════════════════════ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, marginBottom: '0.2rem' }}>
          {greeting()}, {auth?.userName || 'Student'} 👋
        </h1>
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Ready to skip the queue?
        </p>
      </div>

      {/* ═══════════════════════════════════════════════
          2. QUEUE STATUS — THE HERO SECTION
         ═══════════════════════════════════════════════ */}
      <div style={{
        background: rushBg(rush),
        border: `1.5px solid ${rushBorder(rush)}`,
        borderRadius: '20px',
        padding: '1.5rem 1.5rem',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 180, height: 180,
          background: `radial-gradient(circle, ${rushBg(rush)} 0%, transparent 70%)`,
          pointerEvents: 'none', opacity: 0.5,
        }} />

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            ⏱ Queue Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
              animation: 'pulse-live 1.5s ease-in-out infinite', display: 'inline-block',
            }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--green)' }}>Live</span>
          </div>
        </div>

        {/* Big wait time */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <div style={{
            fontSize: '3rem', fontWeight: 800, color: rushColor(rush),
            letterSpacing: '-0.04em', lineHeight: 1,
          }}>
            {waitMin}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: rushColor(rush), opacity: 0.8 }}>min wait</div>
        </div>

        {/* Rush level pill + kitchen load */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <span style={{
            background: rushColor(rush), color: '#000',
            padding: '0.22rem 0.75rem', borderRadius: 99,
            fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase',
          }}>
            {rush} Rush
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Kitchen load: {avgLoad}%
          </span>
        </div>

        {/* Smart message */}
        <div style={{
          fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600,
          background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
          padding: '0.7rem 0.9rem',
          borderLeft: `3px solid ${rushColor(rush)}`,
        }}>
          💡 {smartMessage(rush)}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          3. ACTIVE ORDER (IF EXISTS) — Show before quick order
         ═══════════════════════════════════════════════ */}
      {currentOrder && (
        <div
          onClick={() => onNavigate('tracking')}
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.04))',
            border: '1.5px solid rgba(16,185,129,0.25)',
            borderRadius: '20px',
            padding: '1.25rem 1.4rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, border-color 0.2s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              📦 Active Order
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>Track →</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentOrder.items.map(i => i.name).join(', ')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {currentOrder.id} · ₹{currentOrder.total}
              </div>
            </div>
            <div style={{
              background: currentOrder.status === 'Ready' ? 'var(--green)' : currentOrder.status === 'Preparing' ? 'var(--yellow)' : 'var(--accent)',
              color: '#000', padding: '0.3rem 0.75rem', borderRadius: 99,
              fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
            }}>
              {currentOrder.status}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '0.75rem', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: currentOrder.status === 'Pending' ? '25%' : currentOrder.status === 'Preparing' ? '60%' : '100%',
              background: 'linear-gradient(90deg, var(--green), var(--accent))',
              transition: 'width 1s ease',
            }} />
          </div>

          {/* Time estimate */}
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {currentOrder.status === 'Ready' ? '✅ Ready for pickup!' : currentOrder.status === 'Preparing' ? '👨‍🍳 Ready in ~5 min' : '⏳ Waiting for confirmation...'}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          4. QUICK ORDER — MAIN ACTION
         ═══════════════════════════════════════════════ */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '0.85rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>⚡ Quick Order</h2>
          <button
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700,
              fontFamily: 'inherit',
            }}
            onClick={() => onNavigate('menu')}
          >Full Menu →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
          {QUICK_ITEMS.map(item => {
            const isAdding = adding === item.id;
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isAdding ? '1.5px solid var(--green)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex', flexDirection: 'column', gap: '0.6rem',
                  transition: 'all 0.2s ease',
                  transform: isAdding ? 'scale(0.97)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: item.gradient, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.1rem' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)' }}>₹{item.price}</span>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700,
                        color: item.prepMins <= 4 ? 'var(--green)' : 'var(--yellow)',
                        background: item.prepMins <= 4 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        borderRadius: 99, padding: '1px 5px',
                      }}>{item.prepTime}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(item)}
                  style={{
                    width: '100%',
                    background: isAdding ? 'var(--green)' : 'var(--accent)',
                    color: '#000', border: 'none', borderRadius: '10px',
                    padding: '0.55rem',
                    fontWeight: 700, fontSize: '0.82rem',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isAdding ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          5. VENDORS — Simple horizontal list
         ═══════════════════════════════════════════════ */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem', margin: 0, marginBottom: '0.85rem' }}>🏪 Vendors</h2>
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          {VENDORS.map(v => {
            const load = kitchenLoads[v.id] || v.kitchenLoad;
            const vRush = computeRush(load);
            return (
              <button
                key={v.id}
                onClick={() => onNavigateToVendor(v.id)}
                style={{
                  flexShrink: 0, width: 145,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '0.9rem 0.85rem',
                  cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  transition: 'border-color 0.2s, transform 0.15s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = rushColor(vRush); e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: rushColor(vRush), opacity: 0.7 }} />
                <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{v.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.12rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.name}</div>
                <div style={{ fontSize: '0.68rem', color: rushColor(vRush), fontWeight: 700 }}>{vRush} · ~{v.wait}m</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
