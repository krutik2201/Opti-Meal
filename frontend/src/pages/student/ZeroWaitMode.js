import React, { useState, useEffect } from 'react';
import { MENU_ITEMS, VENDORS } from './data';

function ZeroWaitMode({ onAddToCart, onNavigate, kitchenLoads }) {
  const [adding, setAdding]       = useState(null);
  const [added, setAdded]         = useState(new Set());
  const [pulse, setPulse]         = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const zeroItems = MENU_ITEMS.filter(i => i.available && i.prepMins <= 4);

  const handleAdd = (item) => {
    setAdding(item.id);
    onAddToCart(item);
    setAdded(prev => new Set([...prev, item.id]));
    setTimeout(() => setAdding(null), 800);
  };

  const addAll = () => {
    zeroItems.forEach(item => {
      if (!added.has(item.id)) {
        onAddToCart(item);
        setAdded(prev => new Set([...prev, item.id]));
      }
    });
    setTimeout(() => onNavigate('cart'), 500);
  };

  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Group by vendor
  const byVendor = VENDORS.map(v => ({
    ...v,
    items: zeroItems.filter(i => i.vendorId === v.id),
  })).filter(v => v.items.length > 0);

  const vendorLoad = (vid) => kitchenLoads?.[vid] || VENDORS.find(v => v.id === vid)?.kitchenLoad || 50;
  const loadColor = (l) => l < 40 ? 'var(--green)' : l < 80 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: '1.5rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 'var(--radius-md)', padding: '1.5rem 1rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 100,
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: pulse ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: 99, padding: '0.4rem 1rem', marginBottom: '0.85rem',
          fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)',
          transition: 'background 0.5s',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: 'var(--green)',
            animation: 'pulse-live 1.5s ease-in-out infinite', display: 'inline-block',
          }} />
          ZERO-WAIT MODE ACTIVE
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.4rem' }}>
          Ready <span style={{ color: 'var(--green)' }}>Instantly</span>
        </h1>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
          {zeroItems.length} items · All ready in ≤4 minutes · No queue
        </div>

        {/* Time guarantee */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 99, padding: '0.35rem 1rem', fontSize: '0.78rem',
        }}>
          <span style={{ fontWeight: 700, color: 'var(--green)' }}>⏱️ Order now → Ready by</span>
          <span style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1rem' }}>
            {(() => {
              const d = new Date(); d.setMinutes(d.getMinutes() + 4);
              return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
            })()}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>± 1 min</span>
        </div>
      </div>

      {/* Items by vendor */}
      {byVendor.map(vendor => {
        const load = vendorLoad(vendor.id);
        const lColor = loadColor(load);
        return (
          <div key={vendor.id} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.65rem',
            }}>
              <span style={{ fontSize: '1rem' }}>{vendor.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{vendor.name}</span>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                background: `${lColor === 'var(--green)' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'}`,
                border: `1px solid ${lColor}44`,
                borderRadius: 99, padding: '0.12rem 0.55rem',
                fontSize: '0.62rem', fontWeight: 700, color: lColor,
              }}>
                {load}% load
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {vendor.items.map(item => {
                const isAdding = adding === item.id;
                const isAdded  = added.has(item.id);
                return (
                  <div key={item.id} style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${isAdded ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.15)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    transition: 'border-color 0.25s, transform 0.15s',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Green glow bar on top */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--green),transparent)' }} />

                    {/* Emoji */}
                    <div style={{
                      width: 54, height: 54, borderRadius: 'var(--radius-sm)',
                      background: item.gradient, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, position: 'relative',
                    }}>
                      {item.emoji}
                      {item.instantReady && (
                        <div style={{
                          position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                          background: 'var(--green)', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.55rem', fontWeight: 700, color: '#000',
                        }}>⚡</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.name}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <span style={{
                          background: 'rgba(16,185,129,0.15)', color: 'var(--green)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          borderRadius: 99, padding: '0.12rem 0.5rem',
                          fontSize: '0.68rem', fontWeight: 700,
                        }}>⚡ {item.prepTime}</span>
                        {item.instantReady && (
                          <span style={{
                            background: 'rgba(16,185,129,0.12)', color: 'var(--green)',
                            borderRadius: 99, padding: '0.12rem 0.45rem',
                            fontSize: '0.62rem', fontWeight: 700, border: '1px solid rgba(16,185,129,0.25)',
                          }}>INSTANT</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹{item.price}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--yellow)' }}>⭐ {item.rating}</span>
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => handleAdd(item)}
                      id={`zwm-add-${item.id}`}
                      style={{
                        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                        background: isAdded ? 'var(--green)' : isAdding ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.12)',
                        border: `1px solid ${isAdded ? 'var(--green)' : 'rgba(16,185,129,0.4)'}`,
                        color: isAdded ? '#000' : 'var(--green)',
                        fontSize: isAdded ? '1rem' : '1.4rem',
                        cursor: 'pointer', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s',
                      }}
                    >
                      {isAdded ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '1rem', justifyContent: 'center',
        marginBottom: '1.5rem', flexWrap: 'wrap',
      }}>
        {[['var(--green)', '≤3 min — Instant'], ['#facc15', '3–4 min — Fast']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <button
        className="btn btn-primary"
        style={{ justifyContent: 'center', marginBottom: '0.65rem' }}
        onClick={() => onNavigate('cart')}
      >
        🛒 View Cart & Order →
      </button>
      <button
        style={{
          width: '100%', padding: '0.75rem', background: 'rgba(16,185,129,0.07)',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)',
          color: 'var(--green)', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.88rem', fontWeight: 700,
        }}
        onClick={addAll}
      >
        ⚡ Add All Zero-Wait Items to Cart
      </button>
      <button
        style={{
          width: '100%', padding: '0.75rem', background: 'none',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.85rem', marginTop: '0.65rem',
        }}
        onClick={() => onNavigate('menu')}
      >
        Browse Full Menu
      </button>
      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default ZeroWaitMode;
