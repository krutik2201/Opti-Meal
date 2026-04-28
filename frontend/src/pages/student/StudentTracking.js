import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
  { key: 'Pending',   label: 'Order Placed',    icon: '📋', desc: 'Order accepted'       },
  { key: 'Preparing', label: 'Preparing',        icon: '👨‍🍳', desc: 'Kitchen is working'  },
  { key: 'Ready',     label: 'Ready to Pickup!', icon: '✅', desc: 'Head to the counter'  },
];

function confidenceMeta(conf) {
  if (!conf || conf.includes('High'))   return { color: 'var(--green)',  icon: '🛡️', label: 'High Confidence',   sub: 'Order will be ready on time' };
  if (conf.includes('Medium'))          return { color: 'var(--yellow)', icon: '⚠️', label: 'Medium Confidence', sub: 'Slight delay possible'       };
  return { color: 'var(--red)',  icon: '🔴', label: 'Low Confidence',    sub: 'Delays likely — busy kitchen' };
}

function loadColor(l) {
  if (l < 40) return 'var(--green)';
  if (l < 80) return 'var(--yellow)';
  return 'var(--red)';
}

function StudentTracking({ order, onNavigate }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(order?.express ? 300 : 480);
  const [delayMins, setDelayMins] = useState(0);
  const [newETA,    setNewETA]    = useState(null);
  const [shake,     setShake]     = useState(false);
  const simRef   = useRef(null);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    if (!order) return;
    setStatusIdx(0);
    setTimeLeft(order.express ? 300 : 480);
    setDelayMins(0);
    setNewETA(null);
    setShake(false);

    // Synchronize statusIdx with order.status
    let initialIdx = 0;
    if (order.status === 'Preparing') initialIdx = 1;
    if (order.status === 'Ready') initialIdx = 2;
    setStatusIdx(initialIdx);

    // Only simulate if not updated by vendor
    if (initialIdx === 0 && order.status === 'Pending') {
      simRef.current = setTimeout(() => {
        if (order.status === 'Pending') setStatusIdx(1); 
      }, 8000);
      const readyTimer = setTimeout(() => {
        if (order.status !== 'Ready') setStatusIdx(2);
      }, 18000);
      return () => { clearTimeout(simRef.current); clearTimeout(readyTimer); clearTimeout(delayRef.current); };
    }

    return () => { clearTimeout(delayRef.current); };
  }, [order]);

  useEffect(() => {
    if (statusIdx >= 2) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(timerRef.current); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(timerRef.current);
  }, [statusIdx]);

  if (!order) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">📋</div>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No active order</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Place an order to see real-time tracking
        </p>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '0.7rem 1.5rem' }} onClick={() => onNavigate('menu')}>Order Now →</button>
      </div>
    );
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const getState = idx => idx < statusIdx ? 'done' : idx === statusIdx ? 'active' : 'pending';
  const conf = confidenceMeta(order.confidence);
  const effectiveETA = newETA || order.readyTime;

  return (
    <div className="tracker-wrap">

      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          🔍 Live Order Tracking
        </div>
        <div className="tracker-order-id">{order.id}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
          Slot: <strong style={{ color: 'var(--text-primary)' }}>{order.pickupSlot}</strong>
          {order.express && <span style={{ marginLeft: '0.5rem', color: 'var(--yellow)', fontWeight: 700 }}>⚡ Express</span>}
          {order.kitchenLoad && (
            <span style={{ marginLeft: '0.5rem', color: loadColor(order.kitchenLoad), fontSize: '0.78rem' }}>
              · Kitchen: {order.kitchenLoad}%
            </span>
          )}
        </div>
      </div>

      {/* Confidence Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: conf.color === 'var(--green)' ? 'rgba(16,185,129,0.08)' : conf.color === 'var(--yellow)' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${conf.color === 'var(--green)' ? 'rgba(16,185,129,0.3)' : conf.color === 'var(--yellow)' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.85rem', marginBottom: '1rem',
        fontSize: '0.82rem',
      }}>
        <span style={{ fontSize: '1rem' }}>{conf.icon}</span>
        <div>
          <span style={{ fontWeight: 700, color: conf.color }}>{conf.label}</span>
          <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem', fontSize: '0.75rem' }}>· {conf.sub}</span>
        </div>
      </div>

      {/* 🚨 DELAY TRANSPARENCY BANNER */}
      {delayMins > 0 && statusIdx < 2 && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginBottom: '1rem',
          animation: shake ? 'shake 0.5s ease' : 'fadeIn 0.4s ease',
        }}>
          <div style={{ fontWeight: 800, color: 'var(--red)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            ⏰ Running {delayMins} minute{delayMins > 1 ? 's' : ''} late
          </div>
          {newETA && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
              Updated ready time: <strong style={{ color: 'var(--yellow)', fontSize: '1.05rem' }}>{newETA}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.3rem' }}>± 2 min</span>
            </div>
          )}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            🍳 Kitchen is at capacity — we'll keep you updated in real time
          </div>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="tracker-steps">
        {STEPS.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className={`tracker-step ${getState(idx)}`}>
              <div className="tracker-step-dot">{step.icon}</div>
              <div className="tracker-step-label">{step.label}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{step.desc}</div>
            </div>
            {idx < STEPS.length - 1 && <div className={`tracker-connector ${statusIdx > idx ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* ⏱️ GUARANTEED READY TIME / COUNTDOWN */}
      {statusIdx < 2 ? (
        <div style={{
          textAlign: 'center', padding: '1.5rem 0 1rem',
          background: 'linear-gradient(135deg, rgba(15,22,35,0.8), rgba(8,12,20,0.6))',
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${delayMins ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.15)'}`,
          marginBottom: '1.25rem',
        }}>
          {effectiveETA ? (
            <>
              <div style={{
                fontSize: '0.68rem', color: delayMins ? 'var(--red)' : 'var(--text-muted)',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem',
              }}>
                {delayMins ? '⏰ Updated Ready Time' : '⏱️ Guaranteed Ready Time'}
              </div>
              <div style={{
                fontSize: '2.8rem', fontWeight: 800,
                color: delayMins ? 'var(--yellow)' : 'var(--green)',
                letterSpacing: '-0.04em', lineHeight: 1,
                animation: !delayMins ? 'pulse-glow 2.5s ease-in-out infinite' : 'none',
              }}>
                {effectiveETA}
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
                  ± {delayMins ? 3 : 2} min
                </span>
              </div>
              {delayMins > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--yellow)' }}>
                  Originally: {order.readyTime}
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    (+{delayMins} min delay)
                  </span>
                </div>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.6rem' }}>
                {statusIdx === 0 ? '⏳ Confirming your order…' : '👨‍🍳 Chefs are preparing your order…'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                {statusIdx === 0 ? 'Estimated Wait' : 'Ready In'}
              </div>
              <div className="tracker-countdown">{mins}:{secs}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {statusIdx === 0 ? '⏳ Your order is being confirmed…' : '👨‍🍳 Chefs are preparing your order…'}
              </div>
            </>
          )}

          {/* Live progress bar */}
          <div style={{ margin: '1rem 1.5rem 0', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: statusIdx === 0 ? '20%' : statusIdx === 1 ? '60%' : '100%',
              background: `linear-gradient(90deg, ${delayMins ? 'var(--yellow)' : 'var(--green)'}, var(--accent))`,
              transition: 'width 1.5s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {statusIdx === 0 ? 'Step 1 of 3 — Order confirmed' : 'Step 2 of 3 — Preparing'}
          </div>
        </div>
      ) : (
        <div className="tracker-ready-banner">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', animation: 'bounce 0.8s ease' }}>🎉</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>Your order is ready!</div>
          <div style={{ fontSize: '1rem', color: 'var(--green)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Pick up at Counter {order.counter}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Please collect within 10 minutes
          </div>
          {/* Ready time indicator */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 99, padding: '0.35rem 0.9rem', fontSize: '0.78rem',
          }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>
              ✅ Ready at {effectiveETA || order.readyTime}
            </span>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <p className="card-title"><span className="icon">🧾</span> Order Items</p>
        {order.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.5rem 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: '0.875rem',
          }}>
            <span>{item.emoji} {item.qty}× {item.name}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>₹{order.total}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem' }} onClick={() => onNavigate('menu')}>+ Order More</button>
        <button style={{
          flex: 1, padding: '0.75rem', justifyContent: 'center', fontSize: '0.9rem',
          border: '1px solid var(--border)', background: 'transparent',
          cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', borderRadius: 'var(--radius-sm)',
        }} onClick={() => onNavigate('history')}>View History</button>
      </div>
    </div>
  );
}

export default StudentTracking;
