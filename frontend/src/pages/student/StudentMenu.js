import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, VENDORS, SESSION_LABELS } from './data';

const ALL_CATS = ['All', 'Snacks', 'Meals', 'Drinks', 'Breakfast', 'Bakery'];
const ALL_VENDORS = [{ id: 'all', name: 'All Vendors', emoji: '🏪' }, ...VENDORS];

function prepColor(mins) {
  if (mins <= 4)  return 'var(--green)';
  if (mins <= 7)  return 'var(--yellow)';
  return 'var(--red)';
}

function getSession(hr) {
  if (hr < 11) return 'morning';
  if (hr < 15) return 'lunch';
  return 'evening';
}

function StudentMenu({ cart, onNavigate, onAddToCart, updateQty, favorites, onToggleFavorite, onOpenItem, initialVendor, onClearVendorFilter, kitchenLoads }) {
  const [vendor,     setVendor]     = useState(initialVendor || 'all');
  const [category,   setCategory]   = useState('All');
  const [speedMode,  setSpeedMode]  = useState('all');   // 'fast'|'balanced'|'all'
  const [fastOnly,   setFastOnly]   = useState(false);
  const [sortBy,     setSortBy]     = useState('default'); // 'default'|'speed'|'rating'

  const hr        = new Date().getHours();
  const sessionKey = getSession(hr);
  const session   = SESSION_LABELS[sessionKey];

  // Average load of selected vendor(s)
  const avgLoad = vendor === 'all'
    ? Math.round(VENDORS.reduce((s, v) => s + (kitchenLoads?.[v.id] || v.kitchenLoad), 0) / VENDORS.length)
    : (kitchenLoads?.[vendor] || VENDORS.find(v => v.id === vendor)?.kitchenLoad || 50);

  const highLoad = avgLoad > 80;

  const speedFilter = speedMode === 'fast' ? 4 : speedMode === 'balanced' ? 7 : 999;

  const items = useMemo(() => {
    let list = MENU_ITEMS.filter(i => {
      if (vendor !== 'all' && i.vendorId !== vendor) return false;
      if (category !== 'All' && i.category !== category) return false;
      if (fastOnly && i.prepMins > 4) return false;
      if (i.prepMins > speedFilter && speedMode !== 'all') return false;
      return true;
    });
    if (sortBy === 'speed')  list = [...list].sort((a, b) => a.prepMins - b.prepMins);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    // During high load: push slow items to end
    if (highLoad) list = [...list].sort((a, b) => a.prepMins - b.prepMins);
    return list;
  }, [vendor, category, fastOnly, sortBy, highLoad, speedFilter, speedMode]);

  const getCartQty = (id) => {
    const found = cart.find(c => c.item.id === id);
    return found ? found.qty : 0;
  };

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* Session badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 99, padding: '0.3rem 0.8rem', marginBottom: '0.75rem',
        fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
      }}>
        {session.label} · {session.range}
      </div>

      {/* High-load adaptive banner */}
      {highLoad && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 'var(--radius-sm)', padding: '0.65rem 1rem',
          marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--red)' }}>
              Kitchen load: {avgLoad}% — Rush hour
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Fast items shown first · Heavy meals may take longer
            </div>
          </div>
          <button
            style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 99, padding: '0.25rem 0.7rem', fontSize: '0.7rem', fontWeight: 700, color: 'var(--red)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
            onClick={() => setFastOnly(f => !f)}
          >{fastOnly ? 'Show All' : '⚡ Fast Only'}</button>
        </div>
      )}

      {/* Time vs Taste selector */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>⚖️ Time vs Taste</div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { key: 'fast',     label: '⚡ Fast',        sub: '≤4 min' },
            { key: 'balanced', label: '⚖️ Balanced',    sub: '≤7 min' },
            { key: 'all',      label: '😋 Best Taste',  sub: 'All items' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setSpeedMode(m.key)}
              style={{
                flex: 1, padding: '0.5rem 0.3rem', borderRadius: 'var(--radius-sm)',
                border: speedMode === m.key ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: speedMode === m.key ? 'var(--accent-dim)' : 'var(--bg-card)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: speedMode === m.key ? 'var(--accent)' : 'var(--text-primary)' }}>{m.label}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vendor filter */}
      <div className="h-scroll-row" style={{ gap: '0.4rem', marginBottom: '0.85rem', flexWrap: 'nowrap' }}>
        {ALL_VENDORS.map(v => (
          <button
            key={v.id}
            onClick={() => { setVendor(v.id); if (v.id === 'all') onClearVendorFilter?.(); }}
            style={{
              flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: 99, whiteSpace: 'nowrap',
              border: vendor === v.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: vendor === v.id ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: vendor === v.id ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >{v.emoji} {v.name}</button>
        ))}
      </div>

      {/* Category + Sort row */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <div className="h-scroll-row" style={{ gap: '0.35rem', flexWrap: 'nowrap', flex: 1 }}>
          {ALL_CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, padding: '0.3rem 0.65rem', borderRadius: 99, whiteSpace: 'nowrap',
                border: category === cat ? '1.5px solid rgba(167,139,250,0.6)' : '1px solid var(--border)',
                background: category === cat ? 'rgba(167,139,250,0.12)' : 'var(--bg-card)',
                color: category === cat ? '#a78bfa' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.73rem', fontWeight: 600,
              }}
            >{cat}</button>
          ))}
        </div>
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)', padding: '0.3rem 0.55rem', fontSize: '0.72rem',
            fontFamily: 'inherit', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <option value="default">Default</option>
          <option value="speed">⚡ Speed</option>
          <option value="rating">⭐ Rating</option>
        </select>
      </div>

      {/* Fast-only toggle (non-rush) */}
      {!highLoad && (
        <button
          onClick={() => setFastOnly(f => !f)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem',
            background: fastOnly ? 'rgba(16,185,129,0.12)' : 'var(--bg-card)',
            border: fastOnly ? '1px solid rgba(16,185,129,0.4)' : '1px solid var(--border)',
            borderRadius: 99, padding: '0.35rem 0.85rem', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.74rem', fontWeight: 700,
            color: fastOnly ? 'var(--green)' : 'var(--text-muted)', transition: 'all 0.18s',
          }}
        >
          <span>⚡</span>{fastOnly ? 'Fast items only (≤4 min) — ON' : 'Show fast items only'}
        </button>
      )}

      {/* Item count */}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {items.length} item{items.length !== 1 ? 's' : ''}
        {highLoad && <span style={{ color: 'var(--yellow)', fontWeight: 600, marginLeft: '0.4rem' }}>· Sorted by speed during rush</span>}
      </div>

      {/* Menu items */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</div>
          <div style={{ fontWeight: 600 }}>No items match your filters</div>
          <button style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }} onClick={() => { setCategory('All'); setFastOnly(false); setSpeedMode('all'); }}>Clear filters</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '8rem' }}>
          {items.map(item => {
            const qty   = getCartQty(item.id);
            const pColor = prepColor(item.prepMins);
            const isFav = favorites?.has(item.id);
            const dimmed = highLoad && item.prepMins > 8;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: item.instantReady ? '1px solid rgba(16,185,129,0.3)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '0.85rem',
                  display: 'flex', gap: '0.85rem',
                  opacity: (!item.available || dimmed) ? 0.55 : 1,
                  transition: 'opacity 0.3s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Fast-pick glow bar */}
                {item.prepMins <= 4 && item.available && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--green),transparent)', borderRadius: '99px 99px 0 0' }} />
                )}

                {/* Emoji */}
                <div
                  onClick={() => onOpenItem?.(item)}
                  style={{
                    width: 60, height: 60, borderRadius: 'var(--radius-sm)',
                    background: item.gradient, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {item.emoji}
                  {item.instantReady && (
                    <div style={{ position: 'absolute', top: -3, right: -3, background: 'var(--green)', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800 }}>⚡</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.3rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.3 }}>{item.name}</div>
                    <button
                      onClick={() => onToggleFavorite?.(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', flexShrink: 0, color: isFav ? '#ef4444' : 'var(--text-muted)' }}
                    >{isFav ? '❤️' : '🤍'}</button>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{item.vendorName}</div>

                  {/* Badges row */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.4rem', alignItems: 'center' }}>
                    {/* Prep time badge */}
                    <span style={{
                      background: pColor === 'var(--green)' ? 'rgba(16,185,129,0.15)' : pColor === 'var(--yellow)' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: pColor, border: `1px solid ${pColor === 'var(--green)' ? 'rgba(16,185,129,0.35)' : pColor === 'var(--yellow)' ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)'}`,
                      borderRadius: 99, padding: '0.12rem 0.5rem', fontSize: '0.67rem', fontWeight: 700,
                    }}>⚡ {item.prepTime}</span>
                    {item.instantReady && <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 99, padding: '0.12rem 0.5rem', fontSize: '0.63rem', fontWeight: 700 }}>INSTANT</span>}
                    {highLoad && item.prepMins <= 5 && <span style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 99, padding: '0.12rem 0.5rem', fontSize: '0.63rem', fontWeight: 700 }}>⚡ Fast Pick</span>}
                    {!item.available && <span style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', borderRadius: 99, padding: '0.12rem 0.5rem', fontSize: '0.63rem', fontWeight: 700 }}>Unavailable</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{item.price}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--yellow)', marginLeft: '0.4rem' }}>⭐ {item.rating}</span>
                    </div>
                    {/* Qty control */}
                    {item.available && (
                      qty > 0 ? (
                        <div className="qty-ctrl">
                          <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => onAddToCart(item)}>+ Add</button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cart.length > 0 && (
        <div style={{
          position: 'sticky', bottom: '4.5rem', background: 'var(--bg)',
          borderTop: '1px solid var(--border)', padding: '0.75rem 0',
        }}>
          <button
            className="btn btn-primary"
            style={{ justifyContent: 'space-between', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
            onClick={() => onNavigate('cart')}
          >
            <span>View Cart</span>
            <span>{cart.reduce((s, c) => s + c.qty, 0)} items · ₹{cart.reduce((s, c) => s + c.item.price * c.qty, 0)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentMenu;
