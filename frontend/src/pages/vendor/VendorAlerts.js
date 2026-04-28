import React from 'react';

export default function VendorAlerts({ alerts, dismissAlert }) {
  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Alerts & Insights</h1>
        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>System warnings and workload management logs.</p>
      </div>

      <div className="surface-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🚨</span> Active Notifications
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map(a => (
            <div key={a.id} style={{
              padding: '1.25rem', borderRadius: 'var(--radius-md)', position: 'relative',
              background: a.type === 'delay' ? 'rgba(239,68,68,0.08)' : a.type === 'trigger' ? 'rgba(56,189,248,0.08)' : 'rgba(16,185,129,0.08)',
              border: `1px solid ${a.type === 'delay' ? 'rgba(239,68,68,0.3)' : a.type === 'trigger' ? 'rgba(56,189,248,0.3)' : 'rgba(16,185,129,0.3)'}`
            }}>
              <button 
                onClick={() => dismissAlert(a.id)} 
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✖
              </button>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {a.icon} {a.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.desc}</div>
              
              {a.type === 'smoothing' && (
                <div style={{ marginTop: '0.75rem', display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  System Action Log
                </div>
              )}
            </div>
          ))}
          {alerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✅</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>All clear!</div>
              <div style={{ fontSize: '0.9rem' }}>No active alerts or warnings at this time.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
