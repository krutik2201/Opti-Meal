import React from 'react';
import { PERSONAL_INSIGHTS } from './data';

function Bar({ value, max, color, label, prefix = '' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '2.2rem', textAlign: 'right' }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color, borderRadius: 99,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', width: '2.5rem' }}>{prefix}{value}</span>
    </div>
  );
}

function StudentInsights({ orderHistory, onNavigate }) {
  const ins = PERSONAL_INSIGHTS;
  const maxSpend = Math.max(...ins.weeklySpend, 1);
  const totalSpent = orderHistory.reduce((s, o) => s + o.total, 0);
  const ordersPlaced = orderHistory.length;

  const streakDots = Array.from({ length: 7 }, (_, i) => i < ins.currentStreak);

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>📊 My Insights</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your personal food & spending analytics</p>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '📦', val: ins.ordersThisWeek, lbl: 'Orders This Week', color: 'var(--accent)'  },
          { icon: '💸', val: `₹${ins.spentThisWeek}`, lbl: 'Spent This Week',  color: 'var(--yellow)' },
          { icon: '💚', val: `₹${ins.savedThisWeek}`, lbl: 'Saved via Combos',  color: 'var(--green)'  },
          { icon: '🏆', val: ordersPlaced,        lbl: 'Total Orders',      color: 'var(--accent)'  },
        ].map(s => (
          <div key={s.lbl} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Weekly Spend Chart ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">📅</span> Weekly Spend</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: 80 }}>
          {ins.weeklySpend.map((amt, i) => {
            const isToday = i === new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
            const pct = maxSpend > 0 ? (amt / maxSpend) : 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                {amt > 0 && (
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>₹{amt}</span>
                )}
                <div style={{
                  width: '100%',
                  height: pct > 0 ? `${pct * 60}px` : '4px',
                  background: amt > 0 ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.6s ease',
                  minHeight: 4,
                }} />
                <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>{ins.weekDays[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🍱</span> Category Breakdown</p>
        {ins.topCategories.map(cat => (
          <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.1rem', width: '1.5rem' }}>{cat.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cat.name}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{cat.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${cat.pct}%`, height: '100%',
                  background: cat.color, borderRadius: 99,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Streaks ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🔥</span> Order Streak</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: i < ins.currentStreak
                  ? 'linear-gradient(135deg, var(--yellow), #fb923c)'
                  : 'rgba(255,255,255,0.06)',
                border: `2px solid ${i < ins.currentStreak ? 'var(--yellow)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'transform 0.2s',
              }}
            >
              {i < ins.currentStreak ? '🔥' : ''}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Current streak: <span style={{ color: 'var(--yellow)' }}>{ins.currentStreak} days</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Best: {ins.longestStreak} days in a row
        </div>
      </div>

      {/* ── Personal Bests ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🏅</span> Your Favorites</p>
        {[
          { icon: '🍵', label: 'Favorite Item',    val: ins.favoriteItem   },
          { icon: '🏪', label: 'Favorite Vendor',  val: ins.favoriteVendor },
          { icon: '⏰', label: 'Peak Order Time',   val: ins.peakOrderTime  },
          { icon: '💳', label: 'Total Spent (All)', val: `₹${totalSpent}`  },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.55rem 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1rem' }}>{row.icon}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.label}</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{row.val}</span>
          </div>
        ))}
      </div>

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentInsights;
