import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Cell,
} from 'recharts';
import { REVENUE_MONTHLY, ADMIN_COLLEGES, ADMIN_VENDORS, PLATFORM_SUMMARY } from './adminData';

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0c1220', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 10, fontSize: '0.82rem', color: '#f0f6ff' },
};
const ps = PLATFORM_SUMMARY;

export default function AdminAnalytics() {
  const sortedColleges = [...ADMIN_COLLEGES].sort((a, b) => b.orders - a.orders);
  const topVendors     = [...ADMIN_VENDORS].sort((a, b) => b.orders - a.orders).slice(0, 5);
  const lowVendors     = [...ADMIN_VENDORS].filter(v => v.status !== 'Inactive').sort((a, b) => a.rating - b.rating).slice(0, 3);

  const collegeBarData = sortedColleges.map(c => ({
    name: c.name.split(' ').slice(0, 2).join(' '),
    orders: c.orders, revenue: c.revenue / 1000,
    churn: c.churnRisk === 'High' ? 1 : 0,
  }));

  const featureData = [
    { name: 'QR Ordering',      usage: ps.qrOrderingUsage },
    { name: 'AI Picks',         usage: ps.aiFeatureUsage  },
    { name: 'Smart Queue',      usage: 58 },
    { name: 'Express Order',    usage: 34 },
    { name: 'Meal Plans',       usage: 22 },
  ];

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Platform Analytics</h1>
          <p className="adm-page-sub">Business intelligence across {ps.totalColleges} colleges</p>
        </div>
        <span className="adm-badge adm-badge-green">● Live</span>
      </div>

      {/* ── Revenue Charts row ── */}
      <div className="adm-two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">💰 Revenue Growth</span>
            <span className="adm-badge adm-badge-green">+{ps.monthlyGrowth}% MoM</span>
          </div>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_MONTHLY}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#aGrad)" dot={{ fill: '#10b981', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
            {[
              { label: 'Current MRR',  val: `₹${(ps.totalRevenueMRR/1000).toFixed(0)}K`, color: 'var(--green)'  },
              { label: 'May Forecast', val: `₹${(ps.forecastNextMonth/1000).toFixed(0)}K`,color: 'var(--accent)' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{s.label}</div>
                <div style={{ fontWeight: 800, color: s.color, fontSize: '1.1rem' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* College performance bar */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">🏫 Orders per College</span>
          </div>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeBarData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#748aaa', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#748aaa', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip {...TOOLTIP_STYLE} formatter={v => [v, 'Orders/day']} />
                <Bar dataKey="orders" radius={[0, 4, 4, 0]}>
                  {collegeBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.orders > 400 ? '#10b981' : entry.orders > 200 ? '#38bdf8' : entry.orders < 50 ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Feature Usage ── */}
      <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
        <div className="adm-card-header">
          <span className="adm-card-title">📱 Feature Adoption Rate</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>% of active colleges using each feature</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {featureData.map(f => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, width: '8rem', flexShrink: 0 }}>{f.name}</span>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${f.usage}%`, height: '100%', borderRadius: 99,
                  background: f.usage >= 60 ? 'var(--green)' : f.usage >= 40 ? 'var(--accent)' : 'var(--yellow)',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', width: '2.5rem', textAlign: 'right' }}>{f.usage}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-two-col">
        {/* Top Vendors */}
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: '1rem' }}>🏆 Top Performing Vendors</div>
          {topVendors.map((v, i) => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === 0 ? '#facc15' : i === 1 ? '#94a3b8' : i === 2 ? '#fb923c' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.75rem', color: i < 3 ? '#000' : 'var(--text-muted)',
                flexShrink: 0,
              }}>
                {i < 3 ? ['🥇','🥈','🥉'][i] : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.87rem' }}>{v.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.college}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v.orders} orders</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--yellow)' }}>⭐ {v.rating}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Churn Risk */}
        <div className="adm-card">
          <div className="adm-card-title" style={{ marginBottom: '1rem' }}>⚠️ Churn Risk Detection</div>
          {ADMIN_COLLEGES.filter(c => c.churnRisk !== 'Low').sort((a, b) => {
            const order = { High: 0, Medium: 1 };
            return order[a.churnRisk] - order[b.churnRisk];
          }).map(c => (
            <div key={c.id} style={{
              background: c.churnRisk === 'High' ? 'rgba(239,68,68,0.07)' : 'rgba(245,158,11,0.07)',
              border: `1px solid ${c.churnRisk === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
              borderRadius: 10, padding: '0.8rem 1rem', marginBottom: '0.6rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: c.churnRisk === 'High' ? 'var(--red)' : 'var(--yellow)', background: c.churnRisk === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', padding: '0.15rem 0.5rem', borderRadius: 99 }}>
                  {c.churnRisk} Risk
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {c.growth < 0 ? `Usage dropped ${Math.abs(c.growth)}% this month` : 'Activity below threshold'} · Last seen: {c.lastActive}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
