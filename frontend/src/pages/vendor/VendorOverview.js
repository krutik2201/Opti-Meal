import React from 'react';

export default function VendorOverview({ 
  kitchenLoad, queueLevel, recoveryMode, toggleRecovery, 
  currentPace, recommendedPace,
  pendingCount, preparingCount, activeCount
}) {
  let stressLevel = 'Low';
  let stressColor = 'var(--green)';
  if (kitchenLoad >= 80) { stressLevel = 'High'; stressColor = 'var(--red)'; }
  else if (kitchenLoad >= 55) { stressLevel = 'Moderate'; stressColor = 'var(--yellow)'; }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Dashboard Overview</h1>
          <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time summary of kitchen health</p>
        </div>
        {recoveryMode && (
          <div style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid var(--red)',
            borderRadius: 'var(--radius-sm)', padding: '0.5rem 1rem',
            color: 'var(--red)', fontWeight: 800, animation: 'pulse-live 2s infinite'
          }}>
            🚨 RECOVERY MODE ACTIVE
          </div>
        )}
      </div>

      {/* CORE METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Kitchen Load & Stress */}
        <div className="surface-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={stressColor} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - kitchenLoad / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: stressColor, lineHeight: 1 }}>{kitchenLoad}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Kitchen Load</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.2rem' }}>Queue: <span style={{ color: stressColor }}>{queueLevel}</span></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>ETA: {5 + activeCount} mins</div>
          </div>
        </div>

        {/* Auto-Pacing Engine */}
        <div className="surface-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>⚡ Auto-Pacing Engine</div>
            <span style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700 }}>LIVE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: currentPace < recommendedPace ? 'var(--yellow)' : 'var(--green)', lineHeight: 1 }}>{currentPace}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Current (per 2m)</div>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>/</div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{recommendedPace}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Target (per 2m)</div>
            </div>
          </div>
        </div>

        {/* Recovery Mode */}
        <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: recoveryMode ? '1px solid var(--red)' : '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>🚨 Emergency Control</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              If overwhelmed, activate Recovery Mode to pause new orders.
            </p>
          </div>
          <button
            onClick={toggleRecovery}
            style={{
              width: '100%', padding: '0.75rem', marginTop: '1rem',
              background: recoveryMode ? 'var(--red)' : 'rgba(239,68,68,0.1)',
              border: recoveryMode ? 'none' : '1px solid var(--red)',
              color: recoveryMode ? '#fff' : 'var(--red)',
              fontWeight: 700, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              transition: 'all 0.2s', fontFamily: 'inherit'
            }}
          >
            {recoveryMode ? 'Deactivate Recovery' : 'Activate Recovery Mode'}
          </button>
        </div>

      </div>

      {/* QUICK SUMMARY ROW */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Status</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        
        <div className="surface-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{pendingCount + preparingCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.5rem' }}>Active Orders</div>
        </div>
        
        <div className="surface-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.5rem' }}>Pending</div>
        </div>

        <div className="surface-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', borderBottom: '2px solid var(--yellow)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--yellow)' }}>{preparingCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.5rem' }}>Preparing</div>
        </div>

        <div className="surface-card" style={{ textAlign: 'center', padding: '1.5rem 1rem', borderBottom: '2px solid var(--green)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>12</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.5rem' }}>Ready</div>
        </div>

      </div>
    </div>
  );
}
