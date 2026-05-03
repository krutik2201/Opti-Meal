import React, { useState, useEffect, useRef } from 'react';

const STEPS = [
  { key: 'pending',   label: 'Pending',      icon: '📋' },
  { key: 'preparing', label: 'Preparing',     icon: '👨‍🍳' },
  { key: 'ready',     label: 'Ready!',        icon: '✅' },
];

function StudentTracking({ order, onNavigate }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!order) return;
    
    let initialIdx = 0;
    if (order.status === 'preparing') initialIdx = 1;
    if (order.status === 'ready' || order.status === 'completed') initialIdx = 2;
    setStatusIdx(initialIdx);

    // Use API estimate
    if (order.estimated_ready_mins) {
      setTimeLeft(order.estimated_ready_mins * 60);
    } else {
      setTimeLeft(order.is_express ? 300 : 480);
    }
  }, [order]);

  useEffect(() => {
    if (statusIdx >= 2) { 
        if (timerRef.current) clearInterval(timerRef.current); 
        return; 
    }
    timerRef.current = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { clearInterval(timerRef.current); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(timerRef.current);
  }, [statusIdx]);

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No active order</div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Place an order to see real-time tracking
        </div>
        <button
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
          onClick={() => onNavigate('home')}
        >Order Now →</button>
      </div>
    );
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const getState = idx => idx < statusIdx ? 'done' : idx === statusIdx ? 'active' : 'pending';

  return (
    <div style={{ padding: '1.25rem 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.2rem' }}>Order Tracking</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            #{order.order_id} · Slot: {order.pickup_slot}
          </div>
        </div>
        {order.is_express && (
          <span style={{ background: 'var(--accent)', color: '#000', fontSize: '0.7rem', fontWeight: 900, padding: '0.25rem 0.65rem', borderRadius: '8px' }}>⚡ EXPRESS</span>
        )}
      </div>

      {/* ── Status Stepper ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 0, marginBottom: '2rem',
      }}>
        {STEPS.map((step, idx) => {
          const state = getState(idx);
          const isDone = state === 'done';
          const isActive = state === 'active';
          return (
            <React.Fragment key={step.key}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: isDone ? 'var(--green)' : isActive ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                  border: isActive ? '2px solid var(--accent)' : isDone ? '2px solid var(--green)' : '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                  transition: 'all 0.5s ease',
                  boxShadow: isActive ? '0 0 20px rgba(56,189,248,0.3)' : 'none',
                }}>
                  {isDone ? '✓' : step.icon}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: isDone ? 'var(--green)' : isActive ? 'var(--accent)' : 'var(--text-muted)',
                  textTransform: 'capitalize'
                }}>{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div style={{
                  width: 50, height: 3, borderRadius: 99,
                  background: statusIdx > idx ? 'var(--green)' : 'rgba(255,255,255,0.08)',
                  margin: '0 0.3rem', marginBottom: '1.2rem',
                  transition: 'background 0.5s ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Countdown / Ready Banner ── */}
      {statusIdx < 2 ? (
        <div style={{
          textAlign: 'center', padding: '1.75rem 1.25rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem',
          }}>
            {statusIdx === 0 ? 'Estimated Wait' : 'Ready In'}
          </div>
          <div style={{
            fontSize: '3.5rem', fontWeight: 800, color: 'var(--green)',
            letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.6rem',
            animation: 'pulse-glow 2.5s ease-in-out infinite',
          }}>
            {mins}:{secs}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {statusIdx === 0 ? '⏳ Your order is being confirmed…' : '👨‍🍳 Kitchen is preparing your food…'}
          </div>

          <div style={{ margin: '1.25rem 1rem 0', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: statusIdx === 0 ? '25%' : '60%',
              background: 'linear-gradient(90deg, var(--green), var(--accent))',
              transition: 'width 1.5s ease',
            }} />
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '2rem 1.5rem',
          background: 'rgba(16,185,129,0.08)',
          border: '1.5px solid rgba(16,185,129,0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem', animation: 'bounce 0.8s ease' }}>🎉</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>Your order is ready!</div>
          <div style={{ fontSize: '1.05rem', color: 'var(--green)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Pick up at the Counter
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Please collect within 10 minutes
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '12px', padding: '0.65rem 1.25rem',
          }}>
            <span style={{ fontSize: '1.3rem' }}>⚡</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIME SAVED WITH OPTIMEAL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green)' }}>
                Queue avoided successfully!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Items ── */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '1.1rem 1.2rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          🧾 Order Items
        </div>
        {order.items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.5rem 0',
            borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none',
            fontSize: '0.88rem',
          }}>
            <span>{item.quantity}× {item.name}</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontWeight: 700, fontSize: '1rem' }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>₹{order.total_price}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn btn-primary"
          style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
          onClick={() => onNavigate('menu')}
        >+ Order More</button>
        <button
          style={{
            flex: 1, padding: '0.75rem', justifyContent: 'center',
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit',
            borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.88rem',
          }}
          onClick={() => onNavigate('home')}
        >Back to Home</button>
      </div>
    </div>
  );
}

export default StudentTracking;
