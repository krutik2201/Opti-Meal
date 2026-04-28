import React, { useState, useEffect } from 'react';
import { TIME_SLOTS, MENU_ITEMS } from './data';

const EXPRESS_FEE = 10;

/* Compute guaranteed ready time */
function computeReadyTime(slotLabel, prepMins, load) {
  if (!slotLabel) return null;
  const startStr = slotLabel.split('–')[0].trim();
  const [hStr, mStr] = startStr.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10) + Math.round(prepMins * (1 + (load - 50) / 200));
  if (m >= 60) { h += 1; m -= 60; }
  const pad = n => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}`;
}

function confidenceLevel(load) {
  if (load < 50) return {
    label: 'High Confidence', color: 'var(--green)', icon: '🛡️',
    sub: 'Order will be ready on time', pct: 95,
  };
  if (load < 80) return {
    label: 'Medium Confidence', color: 'var(--yellow)', icon: '⚠️',
    sub: 'Slight delay possible (±3 min)', pct: 75,
  };
  return {
    label: 'Low Confidence', color: 'var(--red)', icon: '🔴',
    sub: 'Delays likely — kitchen is very busy', pct: 45,
  };
}

function batchHint(cart) {
  if (!cart.length) return null;
  const dominant = cart.reduce((a, b) => a.qty >= b.qty ? a : b);
  const item = dominant.item;
  const batches = { canteen: 20, cafe: 15, juice: 12, snacks: 18 };
  const batchSize = batches[item.vendorId] || 16;
  return `🔄 Grouped with ~${batchSize - dominant.qty} other ${item.name} orders — faster prep!`;
}

function loadColor(l) {
  if (l < 40) return 'var(--green)';
  if (l < 80) return 'var(--yellow)';
  return 'var(--red)';
}

function StudentCart({ cart, cartTotal, updateQty, clearCart, onPlaceOrder, onNavigate, kitchenLoads }) {
  const [selectedSlot,   setSelectedSlot]   = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [express,        setExpress]        = useState(false);
  const [placing,        setPlacing]        = useState(false);
  const [confirmClear,   setConfirmClear]   = useState(false);
  const [currentTime,    setCurrentTime]    = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const expressExtra = express ? EXPRESS_FEE : 0;
  const finalTotal   = cartTotal + expressExtra;
  const totalItems   = cart.reduce((s, c) => s + c.qty, 0);

  const vendorIds = [...new Set(cart.map(c => c.item.vendorId))];
  const avgLoad = vendorIds.length
    ? Math.round(vendorIds.reduce((s, id) => s + (kitchenLoads?.[id] || 70), 0) / vendorIds.length)
    : 60;

  const maxPrepMins  = cart.length ? Math.max(...cart.map(c => c.item.prepMins || 5)) : 5;
  const adjustedPrep = express ? Math.max(3, maxPrepMins - 2) : maxPrepMins;
  const readyTime    = computeReadyTime(selectedSlot, adjustedPrep, avgLoad);
  const confidence   = confidenceLevel(avgLoad);
  const batch        = batchHint(cart);
  const nextFreeSlot = TIME_SLOTS.find(s => !s.full);

  // Compute ETA uncertainty window
  const etaVariance = avgLoad > 75 ? 4 : avgLoad > 50 ? 3 : 2;

  const handlePlaceOrder = () => {
    if (!selectedSlot) {
      document.getElementById('slot-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      onPlaceOrder({ timeSlot: selectedSlot, express, readyTime, confidence: confidence.label, kitchenLoad: avgLoad });
      setPlacing(false);
    }, 700);
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your cart is empty</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Browse the menu and add something delicious!
        </p>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0.7rem 1.2rem', fontSize: '0.88rem' }} onClick={() => onNavigate('zerowait')}>⚡ Zero-Wait</button>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0.7rem 1.2rem', fontSize: '0.88rem', background: 'var(--accent-dim)', color: 'var(--accent)' }} onClick={() => onNavigate('menu')}>Browse Menu →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '1.25rem' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
        Your Cart <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
      </h1>

      {/* ── Decision Confidence Banner ── */}
      <div style={{
        background: confidence.color === 'var(--green)' ? 'rgba(16,185,129,0.08)' : confidence.color === 'var(--yellow)' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${confidence.color === 'var(--green)' ? 'rgba(16,185,129,0.3)' : confidence.color === 'var(--yellow)' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{confidence.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: confidence.color }}>{confidence.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              {confidence.sub} · Kitchen load: {avgLoad}%
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: confidence.color }}>{confidence.pct}%</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>on-time</div>
          </div>
        </div>
        {/* Confidence bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            width: `${confidence.pct}%`, height: '100%',
            background: confidence.color,
            borderRadius: 99, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>
      </div>

      {/* ── Batch Hint ── */}
      {batch && (
        <div style={{
          background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.85rem', marginBottom: '1rem',
          fontSize: '0.78rem', color: 'var(--accent)',
        }}>{batch}</div>
      )}

      {/* ── Cart Items ── */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: 0 }}>
        {cart.map(({ item, qty }) => {
          const prepColor = item.prepMins <= 4 ? 'var(--green)' : item.prepMins <= 7 ? 'var(--yellow)' : 'var(--red)';
          return (
            <div className="cart-item" key={item.id}>
              <span className="cart-item-emoji">{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{item.vendorName}</span>
                  <span>·</span>
                  <span>₹{item.price}</span>
                  <span style={{ color: prepColor, fontWeight: 700 }}>· ⚡ {item.prepTime}</span>
                </div>
              </div>
              <div className="qty-ctrl" style={{ marginRight: '0.75rem' }}>
                <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
              <div className="cart-item-total">₹{item.price * qty}</div>
            </div>
          );
        })}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{
              fontSize: '0.78rem', color: confirmClear ? '#fff' : 'var(--red)',
              background: confirmClear ? 'var(--red)' : 'none', border: 'none',
              borderRadius: 6, padding: confirmClear ? '0.25rem 0.75rem' : 0,
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s',
            }}
            onClick={() => { if (confirmClear) { clearCart(); setConfirmClear(false); } else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); } }}
          >{confirmClear ? '⚠️ Tap again to clear' : '🗑 Clear Cart'}</button>
        </div>
      </div>

      {/* ── Express Toggle ── */}
      <div className="express-toggle" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => setExpress(e => !e)} id="express-toggle-row">
        <div>
          <div className="express-toggle-label">⚡ Express Prep</div>
          <div className="express-toggle-note">Priority queue · Skip the wait · <strong style={{ color: 'var(--yellow)' }}>+₹{EXPRESS_FEE}</strong></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="express-price" style={{ color: express ? 'var(--yellow)' : 'var(--text-muted)' }}>
            {express ? `+₹${EXPRESS_FEE} ✓` : `+₹${EXPRESS_FEE}`}
          </span>
          <div style={{ width: 44, height: 24, borderRadius: 99, background: express ? 'var(--yellow)' : 'rgba(255,255,255,0.12)', border: `1px solid ${express ? 'var(--yellow)' : 'var(--border)'}`, position: 'relative', transition: 'background 0.25s' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: express ? '#000' : '#fff', position: 'absolute', top: 2, left: express ? 22 : 2, transition: 'left 0.25s' }} />
          </div>
        </div>
      </div>

      {/* ── Slot Picker ── */}
      <div className="card" style={{ marginBottom: '1.25rem' }} id="slot-section">
        <p className="card-title"><span className="icon">🔒</span> Reserve Your Pickup Slot</p>

        {nextFreeSlot && (
          <div style={{
            background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', marginBottom: '0.85rem',
            fontSize: '0.75rem', color: 'var(--accent)',
          }}>
            💡 Next available: <strong>{nextFreeSlot.label}</strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
              ({nextFreeSlot.capacity - nextFreeSlot.booked} spots left)
            </span>
          </div>
        )}

        <div className="time-slot-grid">
          {TIME_SLOTS.map(slot => {
            const pct = Math.round((slot.booked / slot.capacity) * 100);
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                className={`time-slot-btn ${isSelected ? 'active' : ''} ${slot.full ? 'full' : ''}`}
                onClick={() => { if (!slot.full) { setSelectedSlot(slot.label); setSelectedSlotId(slot.id); } }}
                disabled={slot.full}
                style={{ cursor: slot.full ? 'not-allowed' : 'pointer', position: 'relative' }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>{slot.label}</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', marginTop: '0.3rem' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: slot.full ? 'var(--red)' : pct > 70 ? 'var(--yellow)' : 'var(--green)', borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: '0.58rem', color: slot.full ? 'var(--red)' : 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {slot.full ? '🔒 FULL' : `${slot.booked}/${slot.capacity} booked`}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Guaranteed Ready Time ── */}
        {selectedSlot && readyTime ? (
          <div style={{
            marginTop: '0.85rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(56,189,248,0.06))',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.1rem 1.1rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 80, height: 80,
              background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              ⏱️ Guaranteed Ready Time
            </div>
            <div style={{
              fontSize: '2.5rem', fontWeight: 800, color: 'var(--green)',
              letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.35rem',
              animation: 'pulse-glow 2.5s ease-in-out infinite',
            }}>
              {readyTime}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>± {etaVariance} min</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Slot {selectedSlot} · Prep ~{adjustedPrep} min · Load {avgLoad}%
              {express && <span style={{ color: 'var(--yellow)', marginLeft: '0.3rem' }}>· ⚡ Express priority</span>}
            </div>
            {/* Confidence indicator */}
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ height: 3, flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${confidence.pct}%`, height: '100%', background: confidence.color, borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: confidence.color }}>{confidence.pct}% on-time</span>
            </div>
          </div>
        ) : (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem 0.9rem',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            ← Select an available slot to see your guaranteed ready time
          </div>
        )}
      </div>

      {/* ── Order Summary ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">💰</span> Order Summary</p>
        <div className="price-row"><span>Subtotal ({totalItems} items)</span><span className="price-val">₹{cartTotal}</span></div>
        {express && <div className="price-row" style={{ color: 'var(--yellow)' }}><span>⚡ Express Prep</span><span className="price-val">+₹{EXPRESS_FEE}</span></div>}
        <div className="price-row" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}><span>Convenience fee</span><span className="price-val">₹0</span></div>
        <div className="price-row total"><span>Total</span><span className="price-val">₹{finalTotal}</span></div>
      </div>

      <button
        className={`btn btn-primary auth-submit-btn ${placing ? 'loading' : ''}`}
        onClick={handlePlaceOrder}
        disabled={placing}
        id="place-order-btn"
        style={{
          marginBottom: '0.75rem',
          opacity: !selectedSlot ? 0.65 : 1,
          cursor: !selectedSlot ? 'not-allowed' : 'pointer',
          justifyContent: 'center',
        }}
      >
        {placing
          ? <><span className="spinner" /> Placing Order…</>
          : selectedSlot
            ? `🔒 Confirm Order · ₹${finalTotal} · Ready ${readyTime}`
            : 'Select Pickup Slot to Continue'}
      </button>

      {!selectedSlot && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          ↑ Pick a slot above to see your guaranteed ready time
        </p>
      )}
    </div>
  );
}

export default StudentCart;
