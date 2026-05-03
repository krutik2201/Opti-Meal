import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PLATFORM_SUMMARY as ps, ADMIN_VENDORS, HOURLY_ORDERS, SMART_ALERTS } from './admin/adminData';
import '../styles.css';

const C = {
  green: '#10b981', yellow: '#f59e0b', red: '#ef4444',
  blue: '#3b82f6', purple: '#8b5cf6',
  card: 'rgba(30,41,59,0.45)', border: 'rgba(255,255,255,0.07)',
};
const card = (x = {}) => ({ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '1.5rem', backdropFilter: 'blur(12px)', ...x });

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f172a', border: `1px solid ${C.border}`, padding: '10px 14px', borderRadius: 10 }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>{payload[0].payload.hour}</div>
      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.blue }}>{payload[0].value} orders</div>
    </div>
  );
};

function AdminDashboard({ auth, onLogout }) {
  const [page, setPage] = useState('overview');
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState(SMART_ALERTS.filter(a => a.type !== 'info'));

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const topVendor = ADMIN_VENDORS.find(v => v.id === 'v10') || ADMIN_VENDORS[0];
  const lowVendor = ADMIN_VENDORS.find(v => v.id === 'v8') || ADMIN_VENDORS[7];

  const Nav = ({ id, label, icon, badge }) => (
    <button onClick={() => setPage(id)} style={{
      width: '100%', padding: '0.9rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.7rem',
      background: page === id ? 'rgba(59,130,246,0.1)' : 'transparent',
      border: 'none', borderLeft: `3px solid ${page === id ? C.blue : 'transparent'}`,
      color: page === id ? C.blue : '#94a3b8', fontSize: '0.88rem',
      fontWeight: page === id ? 800 : 600, cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.15s', marginBottom: 2,
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>{label}
      {badge > 0 && <span style={{ marginLeft: 'auto', background: C.red, color: '#fff', fontSize: '0.6rem', fontWeight: 900, padding: '2px 7px', borderRadius: 10 }}>{badge}</span>}
    </button>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 250, background: 'rgba(15,23,42,0.5)', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', zIndex: 110 }}>
        <div style={{ padding: '1.25rem', borderBottom: `1px solid ${C.border}`, marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, background: C.blue, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>O</div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>Opti<span style={{ color: C.blue }}>Meal</span></span>
          </div>
          <div style={{ fontSize: '0.58rem', color: C.blue, fontWeight: 700, marginTop: 3, letterSpacing: '0.04em' }}>ADMIN CONTROL PANEL</div>
        </div>

        <nav style={{ flex: 1 }}>
          <Nav id="overview" label="Overview" icon="📊" />
          <Nav id="insights" label="System Insights" icon="📈" />
          <Nav id="vendors" label="Vendor Status" icon="🏪" />
          <Nav id="alerts" label="Alerts" icon="⚠️" badge={alerts.length} />
        </nav>

        <div style={{ padding: '0.75rem 1rem', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: '#fff' }}>{auth?.userName?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auth?.userName || 'Admin'}</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Administrator</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', marginTop: '0.5rem', background: 'none', border: `1px solid ${C.border}`, color: C.red, padding: '0.45rem', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'inherit' }}>Logout</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TOP HEADER */}
        <header style={{ padding: '0.85rem 2.5rem', borderBottom: `1px solid ${C.border}`, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {page === 'overview' ? '📊 Overview' : page === 'insights' ? '📈 System Insights' : page === 'vendors' ? '🏪 Vendor Status' : '⚠️ Alerts'}
            </h2>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Monitor and manage your entire system</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.35rem 0.85rem', borderRadius: 8 }}>
              <span style={{ width: 7, height: 7, background: C.green, borderRadius: '50%', boxShadow: `0 0 8px ${C.green}` }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.green }}>System Healthy</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>{time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem 2.5rem', maxWidth: 1300 }}>

          {/* ════ PAGE: OVERVIEW ════ */}
          {page === 'overview' && (
            <div>
              {/* 5 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.15rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Orders Today', value: ps.totalOrdersToday.toLocaleString(), color: C.blue, icon: '📦' },
                  { label: 'Active Orders', value: ps.activeOrders, color: C.yellow, icon: '⚡' },
                  { label: 'Total Vendors', value: ps.totalVendors, color: C.green, icon: '🏪' },
                  { label: 'Total Students', value: (ps.totalStudents / 1000).toFixed(1) + 'K', color: C.purple, icon: '🎓' },
                  { label: 'Revenue Today', value: '₹' + Math.round(ps.totalRevenueMRR / 30).toLocaleString(), color: C.green, icon: '💰' },
                ].map(m => (
                  <div key={m.label} style={{ ...card(), textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{m.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: m.color, lineHeight: 1.1, marginBottom: '0.35rem' }}>{m.value}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Performance + Smart Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={card()}>
                  <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '1.05rem' }}>📊 Performance Summary</h3>
                  {[
                    { icon: '🔥', label: 'Top Vendor', value: topVendor.name, color: C.green, bg: 'rgba(16,185,129,0.06)' },
                    { icon: '⚠️', label: 'Low Performing', value: lowVendor.name, color: C.red, bg: 'rgba(239,68,68,0.06)' },
                    { icon: '🍔', label: 'Most Ordered', value: 'Samosa', color: C.green, bg: 'rgba(16,185,129,0.06)' },
                    { icon: '📉', label: 'Least Ordered', value: 'Burger', color: C.red, bg: 'rgba(239,68,68,0.06)' },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', borderRadius: 12, background: s.bg, marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                      <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>{s.label}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: s.color }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <div style={card()}>
                  <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '1.05rem' }}>🧠 Smart Insights</h3>
                  {[
                    { icon: '🚀', text: 'Peak rush at 12:30 PM today', color: C.blue },
                    { icon: '🥐', text: 'High demand for quick snacks', color: C.yellow },
                    { icon: '📉', text: 'Low activity expected after 2 PM', color: '#64748b' },
                    { icon: '📊', text: `Peak hour: ${ps.peakHour}`, color: C.blue },
                    { icon: '🏫', text: `Most active: ${ps.mostActiveCollege}`, color: C.green },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 0.85rem', borderRadius: 12, background: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: s.color }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ PAGE: SYSTEM INSIGHTS ════ */}
          {page === 'insights' && (
            <div>
              {/* Graph */}
              <div style={{ ...card(), padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Orders Throughout the Day</h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#64748b' }}>Identify peak hours and system load</p>
                  </div>
                  <span style={{ background: 'rgba(59,130,246,0.1)', color: C.blue, padding: '4px 12px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 800 }}>PEAK: {ps.peakHour}</span>
                </div>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HOURLY_ORDERS}>
                      <defs>
                        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.blue} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.blue, strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="orders" stroke={C.blue} strokeWidth={3} fillOpacity={1} fill="url(#aGrad)" dot={false} activeDot={{ r: 5, fill: C.blue, stroke: '#020617', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.15rem' }}>
                {[
                  { label: 'Peak Hour', value: ps.peakHour, icon: '⏰', color: C.blue },
                  { label: 'Avg Rating', value: ps.avgRating + '★', icon: '⭐', color: C.yellow },
                  { label: 'Monthly Growth', value: '+' + ps.monthlyGrowth + '%', icon: '📈', color: C.green },
                  { label: 'Complaints', value: ps.totalComplaints, icon: '📋', color: C.red },
                ].map(s => (
                  <div key={s.label} style={{ ...card(), textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, marginBottom: '0.3rem' }}>{s.value}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ PAGE: VENDOR STATUS ════ */}
          {page === 'vendors' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {ADMIN_VENDORS.map(v => {
                  const isInactive = v.status === 'Inactive';
                  const isBusy = v.orders > 150;
                  const isWarning = v.status === 'Warning';
                  const statusLabel = isInactive ? 'Inactive' : isWarning ? 'Warning' : isBusy ? 'Busy' : 'Normal';
                  const statusColor = isInactive ? '#64748b' : isWarning ? C.yellow : isBusy ? C.red : C.green;

                  return (
                    <div key={v.id} style={{ ...card(), display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: isInactive ? 0.5 : 1 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${statusColor}10`, border: `1px solid ${statusColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: statusColor, flexShrink: 0 }}>{v.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.15rem' }}>{v.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.college} · Rating: {v.rating}★ · {v.complaints} complaints</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 90 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: C.blue }}>{v.orders}</div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>orders</div>
                      </div>
                      <div style={{ width: 100 }}>
                        <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min((v.orders / 220) * 100, 100)}%`, background: statusColor, borderRadius: 99, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 80 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: C.green }}>₹{(v.revenue / 1000).toFixed(0)}K</div>
                        <div style={{ fontSize: '0.6rem', color: '#64748b' }}>revenue</div>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 900, padding: '4px 12px', borderRadius: 6, textTransform: 'uppercase', background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}25`, minWidth: 65, textAlign: 'center' }}>{statusLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ PAGE: ALERTS ════ */}
          {page === 'alerts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontWeight: 800 }}>System Notifications</h3>
                <button onClick={() => setAlerts([])} style={{ background: 'none', border: 'none', color: C.blue, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>Clear All</button>
              </div>
              {alerts.length === 0 ? (
                <div style={{ ...card(), textAlign: 'center', padding: '5rem', borderStyle: 'dashed' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                  <div style={{ fontWeight: 800, color: C.green, fontSize: '1.1rem' }}>All systems clear!</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>No warnings at this time</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {alerts.map(a => {
                    const isUrgent = a.type === 'danger';
                    const aColor = isUrgent ? C.red : C.yellow;
                    return (
                      <div key={a.id} style={{ ...card(), padding: '1.5rem', background: `${aColor}06`, borderLeft: `4px solid ${aColor}`, display: 'flex', gap: '1.25rem', position: 'relative' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${aColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{isUrgent ? '🔴' : '🟡'}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: aColor, marginBottom: '0.35rem' }}>{a.title}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>{a.body}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', marginTop: '0.6rem', textTransform: 'uppercase' }}>Detected {a.time}</div>
                        </div>
                        <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
