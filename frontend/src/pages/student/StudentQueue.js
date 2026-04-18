import React, { useState, useEffect } from 'react';
import { VENDORS, QUEUE_HOURLY, QUEUE_HEATMAP } from './data';

const RUSH_LABEL = ['', 'Very Low', 'Low', 'Low', 'Medium', 'Medium', 'High', 'High', 'Very High', 'Critical', 'Critical'];
const RUSH_COLOR = (lvl) => {
  if (lvl <= 2) return '#4ade80';
  if (lvl <= 4) return '#86efac';
  if (lvl <= 6) return '#facc15';
  if (lvl <= 8) return '#fb923c';
  return '#f87171';
};
const HOUR_LABELS = ['9A', '10A', '11A', '12P', '1P', '2P', '3P', '4P', '5P'];

function StudentQueue({ onNavigate, onNavigateToVendor }) {
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [liveWait, setLiveWait] = useState(
    Object.fromEntries(VENDORS.map(v => [v.id, v.wait]))
  );

  // Simulate live fluctuation
  useEffect(() => {
    const tick = setInterval(() => {
      setLiveWait(prev => {
        const next = { ...prev };
        VENDORS.forEach(v => {
          const delta = Math.floor(Math.random() * 3) - 1;
          next[v.id] = Math.max(2, Math.min(25, prev[v.id] + delta));
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(tick);
  }, []);

  const now = new Date();
  const currentHour = now.getHours();
  const bestVendor = VENDORS.reduce((a, b) => liveWait[a.id] < liveWait[b.id] ? a : b);

  // Best time to order today: lowest hourly bucket
  const todayData = QUEUE_HOURLY.find((_, i) => i === Math.min(Math.max(currentHour - 9, 0), QUEUE_HOURLY.length - 1));
  const avgHourly = QUEUE_HOURLY.map(h => ({
    hour: h.hour,
    avg: Math.round(Object.values(h.levels).reduce((s, v) => s + v, 0) / 4),
  }));
  const bestHour = avgHourly.reduce((a, b) => a.avg < b.avg ? a : b);

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>🧠 Smart Queue</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Live insights to help you avoid the rush</p>
      </div>

      {/* ── Smart Tip Banner ── */}
      <div className="smart-tip-banner" style={{ marginBottom: '1.25rem' }}>
        <div className="smart-tip-icon">💡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.2rem' }}>Smart Recommendation</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Best time to order today: <strong style={{ color: 'var(--yellow)' }}>{bestHour.hour}</strong>&nbsp;
            (rush level {bestHour.avg}/10).<br />
            Shortest wait now: <strong style={{ color: 'var(--green)' }}>{bestVendor.name}</strong>&nbsp;
            ({liveWait[bestVendor.id]} min).
          </div>
        </div>
      </div>

      {/* ── Live Wait Times ── */}
      <div className="section-header-row" style={{ marginBottom: '0.75rem' }}>
        <h2 className="stu-section-title">📍 Live Wait Times</h2>
        <span style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600 }}>● Live</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {VENDORS.map(v => {
          const wait = liveWait[v.id];
          const rush = wait <= 5 ? 'Low' : wait <= 10 ? 'Medium' : 'High';
          const rushColor = rush === 'Low' ? 'var(--green)' : rush === 'Medium' ? 'var(--yellow)' : 'var(--red)';
          const isSelected = selectedVendor === v.id;
          return (
            <button
              key={v.id}
              className="queue-card"
              onClick={() => {
                setSelectedVendor(isSelected ? 'all' : v.id);
                onNavigateToVendor(v.id);
              }}
              title={`Browse ${v.name} menu`}
              style={{
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'left',
                fontFamily: 'inherit',
                border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: isSelected ? 'var(--accent-dim)' : 'var(--surface)',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = rushColor}
              onMouseLeave={e => e.currentTarget.style.borderColor = isSelected ? 'var(--accent)' : 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{v.emoji}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{v.name}</span>
              </div>
              <div className="queue-card-wait">
                {wait}
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}> min</span>
              </div>
              <div className="queue-card-rush-label" style={{ color: rushColor, fontSize: '0.76rem' }}>
                {rush === 'Low' ? '🟢' : rush === 'Medium' ? '🟡' : '🔴'} {rush} Rush
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: '0.5rem', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min((wait / 20) * 100, 100)}%`, height: '100%',
                  background: rushColor, borderRadius: 99, transition: 'width 1s ease',
                }} />
              </div>
              {/* Tap hint */}
              <div style={{ marginTop: '0.5rem', fontSize: '0.62rem', color: 'var(--accent)', fontWeight: 600 }}>
                Tap to order →
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Hourly Chart ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">📈</span> Queue Trend Today</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: 80, paddingTop: '0.5rem' }}>
          {avgHourly.map((h, i) => {
            const isCurrent = i === Math.min(Math.max(currentHour - 9, 0), avgHourly.length - 1);
            return (
              <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{
                  width: '100%', height: `${(h.avg / 10) * 70}px`,
                  background: isCurrent ? 'var(--accent)' : `${RUSH_COLOR(h.avg)}66`,
                  borderRadius: '4px 4px 0 0',
                  border: isCurrent ? '1px solid var(--accent)' : 'none',
                  transition: 'height 0.4s ease',
                  position: 'relative',
                }}>
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)',
                      fontSize: '0.6rem', fontWeight: 700, color: 'var(--accent)',
                      whiteSpace: 'nowrap',
                    }}>Now</div>
                  )}
                </div>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{h.hour}</span>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
          Average queue level (all vendors) by hour
        </div>
      </div>

      {/* ── Weekly Heatmap ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🗓️</span> Weekly Rush Heatmap</p>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 280 }}>
            {/* Hour labels */}
            <div style={{ display: 'flex', paddingLeft: '2.5rem', gap: '2px', marginBottom: '4px' }}>
              {HOUR_LABELS.map(h => (
                <div key={h} style={{ flex: 1, fontSize: '0.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{h}</div>
              ))}
            </div>
            {QUEUE_HEATMAP.map(row => (
              <div key={row.day} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 2 }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', width: '2rem', textAlign: 'right', paddingRight: '4px' }}>
                  {row.day}
                </span>
                {row.hours.map((lvl, i) => (
                  <div
                    key={i}
                    title={`${row.day} ${HOUR_LABELS[i]}: Rush ${RUSH_LABEL[lvl]}`}
                    style={{
                      flex: 1, height: 22, borderRadius: 4,
                      background: RUSH_COLOR(lvl),
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
            ))}
            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['#4ade80','Low'], ['#facc15','Medium'], ['#fb923c','High'], ['#f87171','Critical']].map(([color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Now CTA ── */}
      <button
        className="btn btn-primary"
        style={{ marginBottom: '1.5rem', justifyContent: 'center' }}
        onClick={() => onNavigateToVendor(bestVendor.id)}
      >
        Order Now from {bestVendor.emoji} {bestVendor.name} →
      </button>

    </div>
  );
}

export default StudentQueue;
