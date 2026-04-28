import React from 'react';

export default function VendorIntelligence({ currentPace, recommendedPace, momentum }) {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Kitchen Intelligence</h1>
        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Smart guidance and insights to optimize your preparation.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ROW 1: Auto-Pacing & Momentum */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          
          <div className="surface-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> Auto-Pacing Engine
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: currentPace < recommendedPace ? 'var(--yellow)' : 'var(--green)', lineHeight: 1 }}>{currentPace}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Current Speed<br/>(orders / 2 min)</div>
              </div>
              <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>/</div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{recommendedPace}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Target Speed<br/>(orders / 2 min)</div>
              </div>
              <div style={{ flex: 1, paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
                {currentPace < recommendedPace ? (
                  <div style={{ color: 'var(--yellow)', fontSize: '0.9rem', fontWeight: 600 }}>⚠️ Pace is slightly behind target. Try to batch complex orders together to catch up.</div>
                ) : (
                  <div style={{ color: 'var(--green)', fontSize: '0.9rem', fontWeight: 600 }}>✅ Great pacing! You are handling the queue perfectly.</div>
                )}
              </div>
            </div>
          </div>

          <div className="surface-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📊</span> Demand Momentum
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {momentum.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{m.item}</span>
                  <span style={{ color: m.color, fontSize: '0.9rem', fontWeight: 800 }}>{m.emoji} {m.trend.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ROW 2: Proactive Suggestions */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Proactive Suggestions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div style={{
            background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 'var(--radius-md)',
            padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem'
          }}>
            <div style={{ fontSize: '2rem' }}>🔁</div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Smart Repetition</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Based on historical data and upcoming slot reservations, you should prepare <strong>10 Samosas</strong> right now to fulfill the incoming 12:40 PM rush seamlessly.
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 'var(--radius-md)',
            padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem'
          }}>
            <div style={{ fontSize: '2rem' }}>🧠</div>
            <div>
              <div style={{ fontWeight: 800, color: '#a78bfa', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Idle Time Recovery</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                The system detected a <strong>2 min idle period</strong>. We recommend using this time to prepare <strong>Tea Base</strong>, as demand typically spikes in 15 minutes.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
