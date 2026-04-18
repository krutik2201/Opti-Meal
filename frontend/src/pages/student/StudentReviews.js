import React, { useState } from 'react';
import { MOCK_PAST_ORDERS, MENU_ITEMS } from './data';

function StarRow({ rating, size = '1.4rem', interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;
  return (
    <div style={{ display: 'flex', gap: '0.15rem' }}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange && onChange(n)}
          style={{
            fontSize: size, cursor: interactive ? 'pointer' : 'default',
            color: n <= display ? '#facc15' : 'rgba(255,255,255,0.15)',
            transition: 'transform 0.1s, color 0.1s',
            transform: interactive && n <= display ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
          }}
        >★</span>
      ))}
    </div>
  );
}

function StudentReviews({ onNavigate }) {
  const [ratings,  setRatings]  = useState({});
  const [texts,    setTexts]    = useState({});
  const [submittedIds, setSubmitted] = useState(new Set());
  const [filter,   setFilter]   = useState('all');

  const orders = MOCK_PAST_ORDERS;

  const handleSubmit = (orderId) => {
    if (!ratings[orderId]) return;
    setSubmitted(prev => new Set([...prev, orderId]));
  };

  const filtered = filter === 'all' ? orders : filter === 'reviewed'
    ? orders.filter(o => submittedIds.has(o.id))
    : orders.filter(o => !submittedIds.has(o.id));

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>Reviews & Ratings</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your feedback helps improve the campus food experience</p>
      </div>

      {/* ── Stats banner ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { val: orders.length,       lbl: 'Orders',   color: 'var(--accent)' },
          { val: submittedIds.size,   lbl: 'Reviewed', color: 'var(--green)'  },
          { val: orders.length - submittedIds.size, lbl: 'Pending', color: 'var(--yellow)' },
        ].map(s => (
          <div key={s.lbl} className="card" style={{ textAlign: 'center', padding: '0.85rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Filter ── */}
      <div className="filter-chips" style={{ marginBottom: '1.25rem' }}>
        {['all','pending','reviewed'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? '📋 All' : f === 'pending' ? '⏳ Pending' : '✅ Reviewed'}
          </button>
        ))}
      </div>

      {/* ── Order cards ── */}
      {filtered.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">⭐</div>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            {filter === 'reviewed' ? 'No reviews submitted yet' : 'All orders reviewed!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(order => {
            const done = submittedIds.has(order.id);
            return (
              <div key={order.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Card head */}
                <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.id}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {order.items.map((it, i) => (
                      <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {it.emoji} {it.qty}× {it.name}{i < order.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating section */}
                <div style={{ padding: '0.9rem 1rem' }}>
                  {done ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StarRow rating={ratings[order.id] || 5} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--green)', fontWeight: 600 }}>✓ Submitted</span>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', fontWeight: 600 }}>How was your order?</p>
                      <StarRow
                        rating={ratings[order.id] || 0}
                        interactive
                        onChange={val => setRatings(prev => ({ ...prev, [order.id]: val }))}
                      />
                      <textarea
                        placeholder="Share your thoughts (optional)…"
                        value={texts[order.id] || ''}
                        onChange={e => setTexts(prev => ({ ...prev, [order.id]: e.target.value }))}
                        className="review-textarea"
                        style={{ marginTop: '0.75rem' }}
                        rows={2}
                      />
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: '0.65rem', padding: '0.6rem', justifyContent: 'center', fontSize: '0.85rem' }}
                        onClick={() => handleSubmit(order.id)}
                        disabled={!ratings[order.id]}
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentReviews;
