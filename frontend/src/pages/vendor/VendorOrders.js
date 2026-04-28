import React from 'react';

export default function VendorOrders({ activeFast, activeHeavy, advanceOrder }) {
  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Orders Management</h1>
        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Main workspace. Focus on fast execution and lane organization.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* FAST LANE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="surface-card" style={{ padding: '1rem', background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> Fast Lane (Simple Orders)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Quick items. No cooking required. Assemble and clear rapidly.</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeFast.map(order => (
              <div key={order.id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>{order.id}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.emoji} {order.qty}x {order.item}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Waiting</div>
                    <div style={{ fontWeight: 800, color: 'var(--yellow)' }}>{order.timeWaiting}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'pending' && (
                    <button onClick={() => advanceOrder('fast', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Accept</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => advanceOrder('fast', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Mark Ready</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => advanceOrder('fast', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Completed</button>
                  )}
                </div>
              </div>
            ))}
            {activeFast.length === 0 && <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No fast orders currently.</div>}
          </div>
        </div>

        {/* HEAVY LANE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="surface-card" style={{ padding: '1rem', background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontWeight: 800, color: 'var(--yellow)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🍳</span> Heavy Lane (Complex Orders)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Cooking required. Batch similar items together to save time.</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeHeavy.map(order => (
              <div key={order.id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--yellow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>{order.id}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.emoji} {order.qty}x {order.item}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Waiting</div>
                    <div style={{ fontWeight: 800, color: 'var(--red)' }}>{order.timeWaiting}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'pending' && (
                    <button onClick={() => advanceOrder('heavy', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Start Preparing</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => advanceOrder('heavy', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Mark Ready</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => advanceOrder('heavy', order.id)} style={{ flex: 1, padding: '0.5rem', background: 'var(--green)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Completed</button>
                  )}
                </div>
              </div>
            ))}
            {activeHeavy.length === 0 && <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No heavy orders currently.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
