import React, { useState } from 'react';
import { TIME_SLOTS } from './data';

const EXPRESS_FEE = 10;   // ← ₹10 express charge

function StudentCart({ cart, cartTotal, updateQty, clearCart, onPlaceOrder, onNavigate }) {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [express,      setExpress]      = useState(false);
  const [placing,      setPlacing]      = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const expressExtra = express ? EXPRESS_FEE : 0;
  const finalTotal   = cartTotal + expressExtra;
  const totalItems   = cart.reduce((s, c) => s + c.qty, 0);

  const handlePlaceOrder = () => {
    if (!selectedSlot) {
      /* Scroll hint instead of alert */
      document.getElementById('slot-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      onPlaceOrder({ timeSlot: selectedSlot, express });
      setPlacing(false);
    }, 700);
  };

  const handleClearCart = () => {
    if (confirmClear) { clearCart(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  };

  /* ── Empty state ── */
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your cart is empty</p>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Browse the menu and add something delicious!</p>
        <button
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.7rem 1.5rem' }}
          onClick={() => onNavigate('menu')}
        >
          Browse Menu →
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '1.25rem' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Your Cart{' '}
        <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem' }}>
          ({totalItems} item{totalItems !== 1 ? 's' : ''})
        </span>
      </h1>

      {/* ── Cart items ── */}
      <div className="card" style={{ marginBottom: '1.25rem', padding: 0 }}>
        {cart.map(({ item, qty }) => (
          <div className="cart-item" key={item.id}>
            <span className="cart-item-emoji">{item.emoji}</span>
            <div style={{ flex: 1 }}>
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">{item.vendorName} · ₹{item.price} each</div>
            </div>

            <div className="qty-ctrl" style={{ marginRight: '0.75rem' }}>
              <button
                className="qty-btn"
                onClick={() => updateQty(item.id, -1)}
                aria-label={`Decrease ${item.name}`}
              >−</button>
              <span className="qty-num">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => updateQty(item.id, 1)}
                aria-label={`Increase ${item.name}`}
              >+</button>
            </div>

            <div className="cart-item-total">₹{item.price * qty}</div>
          </div>
        ))}

        {/* Clear cart — two-tap safety */}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{
              fontSize: '0.78rem',
              color: confirmClear ? '#fff' : 'var(--red)',
              background: confirmClear ? 'var(--red)' : 'none',
              border: confirmClear ? 'none' : 'none',
              borderRadius: 6,
              padding: confirmClear ? '0.25rem 0.75rem' : 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onClick={handleClearCart}
          >
            {confirmClear ? '⚠️ Tap again to clear' : '🗑 Clear Cart'}
          </button>
        </div>
      </div>

      {/* ── Express Prep toggle ── */}
      <div
        className="express-toggle"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpress(e => !e)}
        id="express-toggle-row"
      >
        <div>
          <div className="express-toggle-label">⚡ Express Prep</div>
          <div className="express-toggle-note">
            Priority queue — ready in 5 min · <strong style={{ color: 'var(--yellow)' }}>+₹{EXPRESS_FEE}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="express-price" style={{ color: express ? 'var(--yellow)' : 'var(--text-muted)' }}>
            {express ? `+₹${EXPRESS_FEE} ✓` : `+₹${EXPRESS_FEE}`}
          </span>
          {/* Visual toggle pill */}
          <div
            style={{
              width: 44, height: 24, borderRadius: 99,
              background: express ? 'var(--yellow)' : 'rgba(255,255,255,0.12)',
              border: '1px solid ' + (express ? 'var(--yellow)' : 'var(--border)'),
              position: 'relative',
              transition: 'background 0.25s, border-color 0.25s',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: express ? '#000' : '#fff',
              position: 'absolute', top: 2,
              left: express ? 22 : 2,
              transition: 'left 0.25s, background 0.25s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
        </div>
      </div>

      {/* Express active banner */}
      {express && (
        <div style={{
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: 'var(--yellow)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>⚡</span>
          <span>Express Prep active — your order will be prioritised and ready in <strong>5 min</strong>. Extra ₹{EXPRESS_FEE} added.</span>
        </div>
      )}

      {/* ── Pickup time slot ── */}
      <div className="card" style={{ marginBottom: '1.25rem' }} id="slot-section">
        <p className="card-title" style={{ marginBottom: '1rem' }}>
          <span className="icon">⏰</span> Choose Pickup Slot
        </p>
        <div className="time-slot-grid">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot.id}
              className={`time-slot-btn ${selectedSlot === slot.label ? 'active' : ''} ${slot.full ? 'full' : ''}`}
              onClick={() => !slot.full && setSelectedSlot(slot.label)}
              disabled={slot.full}
              style={{ cursor: slot.full ? 'not-allowed' : 'pointer' }}
            >
              {slot.label}
              {slot.full && (
                <div style={{ fontSize: '0.65rem', color: 'var(--red)', marginTop: '0.1rem' }}>Full</div>
              )}
            </button>
          ))}
        </div>

        {selectedSlot ? (
          <div style={{
            marginTop: '0.75rem', padding: '0.65rem 0.9rem',
            background: 'var(--accent-dim)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>✓ Pickup at {selectedSlot}</span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}
              onClick={() => setSelectedSlot('')}
            >Change</button>
          </div>
        ) : (
          <div style={{
            marginTop: '0.75rem', padding: '0.65rem 0.9rem',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)',
          }}>
            ← Select a slot above to proceed
          </div>
        )}
      </div>

      {/* ── Price summary ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">💰</span> Order Summary</p>
        <div className="price-row">
          <span>Subtotal ({totalItems} items)</span>
          <span className="price-val">₹{cartTotal}</span>
        </div>
        {express && (
          <div className="price-row" style={{ color: 'var(--yellow)' }}>
            <span>⚡ Express Prep</span>
            <span className="price-val">+₹{EXPRESS_FEE}</span>
          </div>
        )}
        <div className="price-row" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <span>Convenience fee</span>
          <span className="price-val">₹0</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <span className="price-val">₹{finalTotal}</span>
        </div>
      </div>

      {/* ── Place order ── */}
      <button
        className={`btn btn-primary auth-submit-btn ${placing ? 'loading' : ''}`}
        onClick={handlePlaceOrder}
        disabled={placing}
        id="place-order-btn"
        style={{
          marginBottom: '0.75rem',
          opacity: !selectedSlot ? 0.65 : 1,
          cursor: !selectedSlot ? 'not-allowed' : 'pointer',
        }}
      >
        {placing
          ? <><span className="spinner" /> Placing Order…</>
          : selectedSlot
            ? `Place Order · ₹${finalTotal}`
            : 'Select Pickup Slot to Continue'}
      </button>

      {!selectedSlot && (
        <p style={{
          textAlign: 'center', fontSize: '0.75rem',
          color: 'var(--text-muted)', marginBottom: '1rem',
        }}>
          ↑ Pick a time slot above to unlock ordering
        </p>
      )}
    </div>
  );
}

export default StudentCart;
