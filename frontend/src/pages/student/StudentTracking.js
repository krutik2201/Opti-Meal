import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
  { key: 'Pending',    label: 'Order Placed',  icon: '📋', delay: 0    },
  { key: 'Preparing',  label: 'Preparing',     icon: '👨‍🍳', delay: 8000  },  // 8s for demo
  { key: 'Ready',      label: 'Ready!',        icon: '✅', delay: 18000 }, // 18s for demo
];

function StudentTracking({ order, onNavigate }) {
  const [statusIdx,  setStatusIdx]  = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(order?.express ? 300 : 480); // seconds
  const timerRef = useRef(null);
  const simRef   = useRef(null);

  // Auto-advance statuses (demo simulation)
  useEffect(() => {
    if (!order) return;
    setStatusIdx(0);
    setTimeLeft(order.express ? 300 : 480);

    // Schedule Preparing after 8s
    simRef.current = setTimeout(() => {
      setStatusIdx(1);
    }, 8000);

    // Schedule Ready after 18s
    const readyTimer = setTimeout(() => {
      setStatusIdx(2);
    }, 18000);

    return () => {
      clearTimeout(simRef.current);
      clearTimeout(readyTimer);
    };
  }, [order]);

  // Countdown timer
  useEffect(() => {
    if (statusIdx >= 2) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [statusIdx]);

  if (!order) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">📋</div>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No active order</p>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '0.7rem 1.5rem' }} onClick={() => onNavigate('menu')}>
          Order Now →
        </button>
      </div>
    );
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const getStepState = (idx) => {
    if (idx < statusIdx)  return 'done';
    if (idx === statusIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="tracker-wrap">

      {/* ── Header ── */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Order Tracking
        </div>
        <div className="tracker-order-id">{order.id}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Pickup slot: <strong style={{ color: 'var(--text-primary)' }}>{order.pickupSlot}</strong>
          {order.express && <span style={{ marginLeft: '0.5rem', color: 'var(--yellow)', fontWeight: 700 }}>⚡ Express</span>}
        </div>
      </div>

      {/* ── Status stepper ── */}
      <div className="tracker-steps">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className={`tracker-step ${getStepState(idx)}`}>
              <div className="tracker-step-dot">{step.icon}</div>
              <div className="tracker-step-label">{step.label}</div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`tracker-connector ${statusIdx > idx ? 'done' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Status-specific UI ── */}
      {statusIdx < 2 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {statusIdx === 0 ? 'Estimated wait time' : 'Ready in'}
          </div>
          <div className="tracker-countdown">{mins}:{secs}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {statusIdx === 0
              ? '⏳ Your order is being confirmed…'
              : '👨‍🍳 Our chefs are preparing your order…'}
          </div>
        </div>
      ) : (
        <div className="tracker-ready-banner">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>Your order is ready!</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--green)', fontWeight: 600, marginBottom: '0.75rem' }}>
            Pick up at Counter {order.counter}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Please collect within 10 minutes
          </div>
        </div>
      )}

      {/* ── Order summary ── */}
      <div className="card" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🧾</span> Order Items</p>
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
              fontSize: '0.875rem',
            }}
          >
            <span>{item.emoji} {item.qty}× {item.name}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: '0.75rem', fontWeight: 700,
        }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>₹{order.total}</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem' }}
          onClick={() => onNavigate('menu')}
        >
          + Order More
        </button>
        <button
          className="btn"
          style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', borderRadius: 'var(--radius-sm)' }}
          onClick={() => onNavigate('history')}
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default StudentTracking;
