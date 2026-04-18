import React, { useState } from 'react';

function StudentHistory({ orders, onReorder, onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">📋</div>
        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No past orders</p>
        <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Place your first order to see history here.</p>
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
        Order History
        <span style={{ marginLeft: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          ({orders.length} orders)
        </span>
      </h1>

      {orders.map(order => (
        <div className="order-history-card" key={order.id}>
          {/* ── Card header ── */}
          <div
            className="order-history-header"
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
          >
            <div>
              <div className="order-history-id">{order.id}</div>
              <div className="order-history-date">{order.date} · Pickup: {order.pickupSlot}</div>
              <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {order.items.map((i, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {i.emoji} {i.qty}× {i.name}
                    {idx < order.items.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0, marginLeft: '0.75rem' }}>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '99px',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: order.status === 'Delivered' ? 'var(--green-dim)' : 'var(--red-dim)',
                color: order.status === 'Delivered' ? 'var(--green)' : 'var(--red)',
                border: `1px solid ${order.status === 'Delivered' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {order.status === 'Delivered' ? '✓ ' : '✕ '}{order.status}
              </span>
              <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{order.total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {expanded === order.id ? '▲' : '▼'}
              </div>
            </div>
          </div>

          {/* ── Expanded body ── */}
          {expanded === order.id && (
            <div className="order-history-items">
              <div style={{ marginBottom: '0.75rem' }}>
                {order.items.map((item, i) => (
                  <div className="order-history-item-row" key={i}>
                    <span>{item.emoji} {item.qty}× {item.name}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontWeight: 700, fontSize: '0.88rem',
                    paddingTop: '0.5rem', marginTop: '0.25rem',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>₹{order.total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.6rem', justifyContent: 'center', fontSize: '0.85rem' }}
                  onClick={() => onReorder(order)}
                >
                  🔄 Reorder
                </button>
                <div style={{
                  flex: 1, padding: '0.6rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ fontWeight: 600 }}>Counter {order.counter}</div>
                  <div>Pickup slot: {order.pickupSlot}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StudentHistory;
