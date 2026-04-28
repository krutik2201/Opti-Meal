import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell, AreaChart, Area,
} from 'recharts';
import {
  PLATFORM_SUMMARY, REVENUE_MONTHLY, HOURLY_ORDERS,
  ADMIN_COLLEGES, ADMIN_VENDORS, SMART_ALERTS,
} from './adminData';

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0c1220', border: '1px solid rgba(56,189,248,0.25)',
    borderRadius: '10px', fontSize: '0.82rem', color: '#f0f6ff',
  },
};

const ps = PLATFORM_SUMMARY;

function KPICard({ icon, label, value, sub, color, trend }) {
  return (
    <div className="adm-kpi-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{icon}</div>
        {trend != null && (
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: trend >= 0 ? 'var(--green)' : 'var(--red)', background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '0.15rem 0.5rem', borderRadius: 99 }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: color || 'var(--text-primary)', lineHeight: 1, marginBottom: '0.3rem' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

export default function AdminOverview({ onNavigate }) {
  const topCollege = [...ADMIN_COLLEGES].sort((a, b) => b.orders - a.orders)[0];
  const bottomCollege = [...ADMIN_COLLEGES].filter(c => c.status === 'Active').sort((a, b) => a.orders - b.orders)[0];

  return (
    <div>
      {/* ── Page header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">SaaS Control Center</h1>
          <p className="adm-page-sub">Global kitchen intelligence across {ps.activeColleges} campuses and {ps.activeVendors} vendors</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="adm-badge adm-badge-green">● Live Data</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Updated just now</span>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="adm-kpi-grid">
        <KPICard icon="🏫" label="Active Campuses"   value={ps.totalColleges}    sub={`${ps.activeColleges} online now`}      color="var(--accent)"  trend={ps.monthlyGrowth} />
        <KPICard icon="👨‍🍳" label="Kitchens Connected" value={ps.totalVendors}     sub={`${ps.activeVendors} active`}           color="var(--accent)"  />
        <KPICard icon="🎓" label="Total Students"    value={ps.totalStudents.toLocaleString()} sub="Across all colleges"    color="var(--text-primary)" />
        <KPICard icon="📦" label="Total Orders Today" value={ps.totalOrdersToday.toLocaleString()} sub={`${ps.activeOrders} processing now`} color="var(--yellow)" />
        <KPICard icon="💰" label="Monthly Revenue"   value={`₹${(ps.totalRevenueMRR/1000).toFixed(0)}K`} sub="MRR this month" color="var(--green)" trend={ps.monthlyGrowth} />
        <KPICard icon="⏱️" label="Avg Wait Reduction" value="18%"                sub="vs traditional queue"                   color="var(--green)" />
        <KPICard icon="🧠" label="Auto-Pacing Usage" value={`${ps.aiFeatureUsage}%`} sub="of active kitchens"               color="var(--accent)"  />
        <KPICard icon="🔒" label="Slot Locking Events" value="1,402"               sub="overload prevented"                   color="var(--yellow)"   />
      </div>

      {/* ── Charts row ── */}
      <div className="adm-two-col" style={{ marginBottom: '1.5rem' }}>
        {/* Revenue trend */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">💰 Monthly Revenue Trend</span>
            <span className="adm-badge adm-badge-green">+{ps.monthlyGrowth}% MoM</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: '#38bdf8', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly load distribution heatmap */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">📊 Global Load Distribution (Simulated Heatmap)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Peak Times: {ps.peakHour}</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ORDERS} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="hour" tick={{ fill: '#748aaa', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [v, 'Orders']} />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                  {HOURLY_ORDERS.map((h, i) => (
                    <Cell key={i} fill={h.orders > 400 ? '#ef4444' : h.orders > 200 ? '#f59e0b' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {[['#ef4444','Peak (400+)'], ['#f59e0b','High (200+)'], ['#38bdf8','Normal']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Smart Alerts ── */}
      <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-card-header">
          <span className="adm-card-title">🚨 Smart Alerts</span>
          <span className="adm-badge adm-badge-red">{SMART_ALERTS.filter(a => a.type === 'danger').length} Critical</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {SMART_ALERTS.map(alert => {
            const colors = { danger: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', dot: 'var(--red)' }, warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', dot: 'var(--yellow)' }, info: { bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', dot: 'var(--accent)' } };
            const c = colors[alert.type];
            return (
              <div key={alert.id} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '0.8rem 1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{alert.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.87rem', marginBottom: '0.15rem' }}>{alert.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.body}</div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>{alert.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Top / Bottom Colleges + AI Insights ── */}
      <div className="adm-two-col">
        {/* Top vs Bottom */}
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: '1rem' }}>🏆 Performance Extremes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>🥇 Most Active</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{topCollege.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{topCollege.orders} orders/day · ₹{topCollege.revenue.toLocaleString()} revenue</div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>📉 Least Active</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{bottomCollege.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{bottomCollege.orders} orders/day · Churn risk: <span style={{ color: 'var(--red)', fontWeight: 700 }}>{bottomCollege.churnRisk}</span></div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: '1rem' }}>🧠 Intelligence System Insights</div>
          {[
            { icon: '⏰', label: 'Global Peak Time', value: ps.peakHour },
            { icon: '📈', label: 'Projected Revenue (May)', value: `₹${(ps.forecastNextMonth/1000).toFixed(0)}K` },
            { icon: '🎯', label: 'Highest Kitchen Efficiency', value: 'Main Canteen (IIT B)' },
            { icon: '⚠️', label: 'Most Frequent Delay Spikes', value: 'Quick Bites (Delhi U)' },
            { icon: '🔄', label: 'Workload Smoothing Triggers', value: '3,205 today' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem' }}>{row.icon}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.label}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
