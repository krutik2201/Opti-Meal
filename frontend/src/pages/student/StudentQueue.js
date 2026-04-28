import React, { useState } from 'react';
import { VENDORS, QUEUE_HOURLY, QUEUE_HEATMAP, TIME_SLOTS } from './data';

const RUSH_LABEL = ['','Very Low','Low','Low','Medium','Medium','High','High','Very High','Critical','Critical'];
const HOUR_LABELS = ['9A','10A','11A','12P','1P','2P','3P','4P','5P'];

function rushColor(lvl) {
  if (lvl <= 2) return '#4ade80';
  if (lvl <= 4) return '#86efac';
  if (lvl <= 6) return '#facc15';
  if (lvl <= 8) return '#fb923c';
  return '#f87171';
}
function loadColor(load) {
  if (load < 40) return 'var(--green)';
  if (load < 80) return 'var(--yellow)';
  return 'var(--red)';
}
function loadLabel(load) {
  if (load < 40) return 'Fast';
  if (load < 80) return 'Moderate';
  return 'Slow';
}
function loadBg(load) {
  if (load < 40) return 'rgba(16,185,129,0.08)';
  if (load < 80) return 'rgba(245,158,11,0.08)';
  return 'rgba(239,68,68,0.08)';
}

function KitchenArc({ load }) {
  const color = loadColor(load);
  const r = 24, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - load / 100)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '0.58rem', lineHeight: 1.2,
      }}>
        <span style={{ fontWeight: 800, color, fontSize: '0.8rem' }}>{load}%</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.5rem' }}>load</span>
      </div>
    </div>
  );
}

function SlotIndicator({ slot }) {
  const pct = Math.round((slot.booked / slot.capacity) * 100);
  const color = slot.full ? 'var(--red)' : pct > 70 ? 'var(--yellow)' : 'var(--green)';
  return (
    <div style={{
      flex: 1, padding: '0.6rem 0.5rem',
      background: slot.full ? 'rgba(239,68,68,0.06)' : 'var(--bg-card)',
      border: `1px solid ${slot.full ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: slot.full ? 'var(--red)' : 'var(--text-secondary)', marginBottom: '0.25rem' }}>
        {slot.label}
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.25rem' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
      <div style={{ fontSize: '0.55rem', color: slot.full ? 'var(--red)' : 'var(--text-muted)' }}>
        {slot.full ? '🔒 FULL' : `${slot.booked}/${slot.capacity}`}
      </div>
    </div>
  );
}

function StudentQueue({ onNavigate, onNavigateToVendor, kitchenLoads }) {
  const [activeTab, setActiveTab] = useState('vendors'); // 'vendors' | 'slots' | 'trends'
  const now = new Date();
  const currentHour = now.getHours();

  const avgHourly = QUEUE_HOURLY.map(h => ({
    hour: h.hour,
    avg: Math.round(Object.values(h.levels).reduce((s, v) => s + v, 0) / 4),
  }));
  const bestHour   = avgHourly.reduce((a, b) => a.avg < b.avg ? a : b);
  const bestVendor = VENDORS.reduce((a, b) => (kitchenLoads[a.id] || a.kitchenLoad) < (kitchenLoads[b.id] || b.kitchenLoad) ? a : b);
  const avgLoad    = Math.round(VENDORS.reduce((s, v) => s + (kitchenLoads[v.id] || v.kitchenLoad), 0) / VENDORS.length);

  const TABS = [
    { id: 'vendors', label: '🍳 Vendors' },
    { id: 'slots',   label: '🔒 Slots'   },
    { id: 'trends',  label: '📈 Trends'  },
  ];

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.2rem' }}>📊 Queue & Load</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Live kitchen intelligence — avoid waits, order smart
        </p>
      </div>

      {/* ── Smart Summary Card ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,22,35,0.95), rgba(8,12,20,0.98))',
        border: `1px solid ${loadColor(avgLoad)}33`,
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem',
        marginBottom: '1.25rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 120, height: 120,
          background: `radial-gradient(circle, ${loadBg(avgLoad)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
          🧠 Smart Recommendation
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.7rem' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Best vendor now</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--green)' }}>
              {bestVendor.emoji} {bestVendor.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--green)', marginTop: '0.15rem' }}>
              {kitchenLoads[bestVendor.id] || bestVendor.kitchenLoad}% load — Fast
            </div>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.7rem' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Best time today</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)' }}>
              {bestHour.hour}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--yellow)', marginTop: '0.15rem' }}>
              Rush level: {bestHour.avg}/10
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.85rem' }}
          onClick={() => onNavigateToVendor(bestVendor.id)}
        >
          Order from {bestVendor.emoji} {bestVendor.name} — Lowest Load →
        </button>
      </div>

      {/* ── Tab navigation ── */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '0.5rem 0.3rem', borderRadius: 'var(--radius-sm)',
              border: activeTab === tab.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: activeTab === tab.id ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.73rem', fontWeight: 700,
              transition: 'all 0.18s',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── TAB: VENDORS ── */}
      {activeTab === 'vendors' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 className="stu-section-title">🍳 Kitchen Load — Live</h2>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem',
              color: 'var(--green)', fontWeight: 700,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-live 1.5s ease-in-out infinite', display: 'inline-block' }} />
              Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[...VENDORS].sort((a, b) => (kitchenLoads[a.id] || a.kitchenLoad) - (kitchenLoads[b.id] || b.kitchenLoad)).map(v => {
              const load = kitchenLoads[v.id] || v.kitchenLoad;
              const color = loadColor(load);
              return (
                <button
                  key={v.id}
                  className="queue-card"
                  onClick={() => onNavigateToVendor(v.id)}
                  style={{
                    cursor: 'pointer', display: 'block', width: '100%',
                    textAlign: 'left', fontFamily: 'inherit',
                    border: `1px solid ${color}33`,
                    background: loadBg(load),
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    transition: 'transform 0.15s, border-color 0.25s',
                    position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: color, opacity: 0.6 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <KitchenArc load={load} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.15rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{v.emoji}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{v.name}</span>
                        {v.id === bestVendor.id && (
                          <span style={{
                            background: 'rgba(16,185,129,0.15)', color: 'var(--green)',
                            borderRadius: 99, padding: '0.08rem 0.5rem', fontSize: '0.6rem', fontWeight: 700,
                          }}>⚡ Best Now</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color, fontSize: '0.8rem' }}>{loadLabel(load)}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>~{v.wait} min wait</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>📍 {v.location}</span>
                      </div>
                    </div>
                  </div>
                  {/* Load bar */}
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: `${load}%`, height: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color}99)`,
                      borderRadius: 99, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {[['<40%','Fast','var(--green)'],['40–80%','Mod','var(--yellow)'],['>80%','Slow','var(--red)']].map(([pct, lbl, c]) => (
                        <div key={pct} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />{pct} {lbl}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)' }}>Order →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: SLOTS ── */}
      {activeTab === 'slots' && (
        <div>
          <div style={{ marginBottom: '0.85rem' }}>
            <h2 className="stu-section-title" style={{ marginBottom: '0.25rem' }}>🔒 Pickup Slot Availability</h2>
            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              Slots are locked once capacity is reached — book early
            </p>
          </div>

          {/* Next free slot banner */}
          {(() => {
            const nextFree = TIME_SLOTS.find(s => !s.full);
            return nextFree ? (
              <div style={{
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--green)', marginBottom: '0.1rem' }}>
                    Next available slot: {nextFree.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {nextFree.capacity - nextFree.booked} spots remaining
                  </div>
                </div>
                <button
                  style={{
                    marginLeft: 'auto', background: 'var(--green)', border: 'none',
                    borderRadius: 99, padding: '0.3rem 0.85rem', fontSize: '0.72rem',
                    fontWeight: 700, color: '#000', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  onClick={() => onNavigate('cart')}
                >Book →</button>
              </div>
            ) : null;
          })()}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {TIME_SLOTS.map(slot => {
              const pct = Math.round((slot.booked / slot.capacity) * 100);
              const color = slot.full ? 'var(--red)' : pct > 70 ? 'var(--yellow)' : 'var(--green)';
              return (
                <div key={slot.id} style={{
                  background: 'var(--bg-card)', border: `1px solid ${slot.full ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  opacity: slot.full ? 0.65 : 1,
                }}>
                  <div style={{ minWidth: 90 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{slot.label}</div>
                    <div style={{ fontSize: '0.65rem', color: slot.full ? 'var(--red)' : 'var(--text-muted)', marginTop: '0.1rem', fontWeight: 700 }}>
                      {slot.full ? '🔒 FULL' : `${slot.booked}/${slot.capacity} booked`}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 800, fontSize: '0.82rem', color,
                    minWidth: 36, textAlign: 'right',
                  }}>{pct}%</div>
                </div>
              );
            })}
          </div>

          <button
            className="btn btn-primary"
            style={{ justifyContent: 'center', marginBottom: '1rem' }}
            onClick={() => onNavigate('cart')}
          >Reserve My Slot Now →</button>
        </div>
      )}

      {/* ── TAB: TRENDS ── */}
      {activeTab === 'trends' && (
        <div>
          {/* Hourly Chart */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <p className="card-title"><span className="icon">📈</span> Queue Trend Today</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: 90, paddingTop: '0.5rem' }}>
              {avgHourly.map((h, i) => {
                const isCurrent = i === Math.min(Math.max(currentHour - 9, 0), avgHourly.length - 1);
                const isBest    = h.hour === bestHour.hour;
                return (
                  <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    {isBest && !isCurrent && (
                      <div style={{ fontSize: '0.5rem', color: 'var(--green)', fontWeight: 700, whiteSpace: 'nowrap' }}>Best</div>
                    )}
                    {isCurrent && (
                      <div style={{ fontSize: '0.5rem', color: 'var(--accent)', fontWeight: 700 }}>Now</div>
                    )}
                    {!isBest && !isCurrent && <div style={{ fontSize: '0.5rem' }}>&nbsp;</div>}
                    <div style={{
                      width: '100%', height: `${(h.avg / 10) * 75}px`,
                      background: isCurrent ? 'var(--accent)' : isBest ? 'var(--green)' : `${rushColor(h.avg)}77`,
                      borderRadius: '4px 4px 0 0',
                      border: isCurrent ? '1px solid var(--accent)' : isBest ? '1px solid var(--green)' : 'none',
                      transition: 'height 0.4s ease', position: 'relative',
                    }} />
                    <span style={{ fontSize: '0.48rem', color: 'var(--text-muted)' }}>{h.hour}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
              Avg queue level (all vendors) · <span style={{ color: 'var(--accent)' }}>Blue = Now</span> · <span style={{ color: 'var(--green)' }}>Green = Best time</span>
            </div>
          </div>

          {/* Weekly Heatmap */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <p className="card-title"><span className="icon">🗓️</span> Weekly Rush Heatmap</p>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 280 }}>
                <div style={{ display: 'flex', paddingLeft: '2.5rem', gap: '2px', marginBottom: '4px' }}>
                  {HOUR_LABELS.map(h => (
                    <div key={h} style={{ flex: 1, fontSize: '0.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{h}</div>
                  ))}
                </div>
                {QUEUE_HEATMAP.map(row => (
                  <div key={row.day} style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '2rem', textAlign: 'right', paddingRight: '4px' }}>{row.day}</span>
                    {row.hours.map((lvl, i) => (
                      <div key={i}
                        title={`${row.day} ${HOUR_LABELS[i]}: ${RUSH_LABEL[lvl]}`}
                        style={{ flex: 1, height: 22, borderRadius: 3, background: rushColor(lvl), opacity: 0.8, cursor: 'default' }}
                      />
                    ))}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {[['#4ade80','Low'],['#facc15','Medium'],['#fb923c','High'],['#f87171','Critical']].map(([color, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />{label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="smart-tip-banner" style={{ marginBottom: '1.25rem' }}>
            <div className="smart-tip-icon">💡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.15rem' }}>Pro Tip</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Order before <strong style={{ color: 'var(--yellow)' }}>12 PM</strong> to skip the lunch rush.
                The best window is <strong style={{ color: 'var(--green)' }}>{bestHour.hour}</strong> with the lowest queue.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentQueue;
