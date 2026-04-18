import React, { useState } from 'react';
import { COMPLAINT_CATEGORIES, MOCK_PAST_ORDERS } from './data';

function StudentComplaint({ onNavigate }) {
  const [step,     setStep]     = useState(1); // 1: category, 2: order, 3: details, 4: submitted
  const [category, setCategory] = useState(null);
  const [orderId,  setOrderId]  = useState('');
  const [desc,     setDesc]     = useState('');
  const [priority, setPriority] = useState('normal');
  const [ticketNo, setTicketNo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!desc.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const ticket = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
      setTicketNo(ticket);
      setStep(4);
      setSubmitting(false);
    }, 1200);
  };

  const reset = () => {
    setStep(1); setCategory(null); setOrderId(''); setDesc(''); setPriority('normal'); setTicketNo('');
  };

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.1rem' }}
          >←</button>
        )}
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>💬 Help & Support</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Report an issue with your order</p>
        </div>
      </div>

      {/* ── Progress steps ── */}
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.75rem' }}>
          {['Category', 'Order', 'Details'].map((label, i) => {
            const sn = i + 1;
            const done = step > sn;
            const active = step === sn;
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: done ? 'var(--green)' : active ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                    border: `2px solid ${done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                    transition: 'all 0.3s',
                  }}>
                    {done ? '✓' : sn}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: active ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '0.3rem', fontWeight: active ? 700 : 400 }}>
                    {label}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ height: 2, flex: 0.5, background: done ? 'var(--green)' : 'var(--border)', transition: 'background 0.3s', marginBottom: '0.9rem' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── STEP 1: Category ── */}
      {step === 1 && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
            What type of issue are you facing?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
            {COMPLAINT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat); setStep(2); }}
                style={{
                  background: category?.id === cat.id ? 'var(--accent-dim)' : 'var(--surface)',
                  border: `1px solid ${category?.id === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', padding: '1rem 0.75rem',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{cat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{cat.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Order Selection ── */}
      {step === 2 && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
            Which order had the issue?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
            {MOCK_PAST_ORDERS.slice(0, 4).map(order => (
              <button
                key={order.id}
                onClick={() => setOrderId(order.id)}
                style={{
                  background: orderId === order.id ? 'var(--accent-dim)' : 'var(--surface)',
                  border: `1px solid ${orderId === order.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: orderId === order.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.date}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {order.items.map(i => `${i.emoji} ${i.name}`).join(', ')} · ₹{order.total}
                </div>
              </button>
            ))}
            <button
              onClick={() => setOrderId('other')}
              style={{
                background: orderId === 'other' ? 'var(--accent-dim)' : 'var(--surface)',
                border: `1px solid ${orderId === 'other' ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem',
                cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-muted)', fontSize: '0.82rem',
              }}
            >
              📋 Other / Not listed above
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{ justifyContent: 'center' }}
            onClick={() => orderId && setStep(3)}
            disabled={!orderId}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── STEP 3: Details ── */}
      {step === 3 && (
        <div>
          {/* Summary row */}
          <div style={{
            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.25rem',
            fontSize: '0.82rem', display: 'flex', gap: '0.75rem', alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{category?.emoji}</span>
            <div>
              <div style={{ fontWeight: 700 }}>{category?.label}</div>
              <div style={{ color: 'var(--text-muted)' }}>Order: {orderId}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Describe the issue *
            </label>
            <textarea
              className="review-textarea"
              placeholder="Please describe what happened in detail…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={4}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['normal', 'urgent'].map(p => (
                <button
                  key={p}
                  className={`filter-chip ${priority === p ? 'active' : ''}`}
                  style={p === 'urgent' && priority !== p ? { borderColor: 'rgba(239,68,68,0.4)', color: 'var(--red)' } : {}}
                  onClick={() => setPriority(p)}
                >
                  {p === 'normal' ? '⏳ Normal' : '🚨 Urgent'}
                </button>
              ))}
            </div>
          </div>

          <button
            className={`btn btn-primary auth-submit-btn ${submitting ? 'loading' : ''}`}
            style={{ justifyContent: 'center' }}
            onClick={handleSubmit}
            disabled={!desc.trim() || submitting}
          >
            {submitting ? <><span className="spinner" /> Submitting…</> : 'Submit Complaint'}
          </button>
        </div>
      )}

      {/* ── STEP 4: Success ── */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Complaint Submitted!</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Our support team will review your complaint and respond within 24 hours.
          </p>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem', display: 'inline-block',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Your ticket number</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace' }}>{ticketNo}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ width: 'auto', padding: '0.7rem 1.25rem' }}
              onClick={reset}
            >
              New Complaint
            </button>
            <button
              onClick={() => onNavigate('home')}
              style={{
                width: 'auto', padding: '0.7rem 1.25rem', background: 'none',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem',
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      )}

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentComplaint;
