import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getAdminDashboardData } from '../services/api';
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAdminDashboardData();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(() => setTime(new Date()), 1000);
    const poller = setInterval(fetchData, 30000); // refresh every 30s
    return () => { clearInterval(t); clearInterval(poller); };
  }, []);

  if (loading && !data) return <div style={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background:'#020617', color:'#fff' }}>Loading Admin Control Panel...</div>;

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
          <Nav id="alerts" label="Alerts" icon="⚠️" badge={0} />
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
          {error && <div style={{ background:C.red+'10', border:`1px solid ${C.red}30`, padding:'1rem', borderRadius:12, color:C.red, marginBottom:'1.5rem', fontWeight:700 }}>⚠️ {error}</div>}

          {/* ════ PAGE: OVERVIEW ════ */}
          {page === 'overview' && data && (
            <div>
              {/* 5 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.15rem', marginBottom: '2.5rem' }}>
                {[
                  { label: 'Orders Today', value: data.total_orders_today, color: C.blue, icon: '📦' },
                  { label: 'Active Orders', value: data.active_orders, color: C.yellow, icon: '⚡' },
                  { label: 'Total Vendors', value: data.vendors_count, color: C.green, icon: '🏪' },
                  { label: 'Total Students', value: '2.5K', color: C.purple, icon: '🎓' },
                  { label: 'Revenue Today', value: '₹' + data.total_revenue.toLocaleString(), color: C.green, icon: '💰' },
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
                    { icon: '🔥', label: 'Top Item', value: data.top_items[0]?.name || 'N/A', color: C.green, bg: 'rgba(16,185,129,0.06)' },
                    { icon: '🍔', label: 'Demand', value: data.top_items[0]?.count ? `${data.top_items[0].count} units` : '0 units', color: C.green, bg: 'rgba(16,185,129,0.06)' },
                    { icon: '📉', label: 'Avg Wait', value: '8.5 min', color: C.blue, bg: 'rgba(59,130,246,0.06)' },
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
                    { icon: '🚀', text: 'Peak rush expected at 12:30 PM', color: C.blue },
                    { icon: '🥐', text: `Most popular today: ${data.top_items[0]?.name || '...'}`, color: C.yellow },
                    { icon: '📊', text: `${data.active_orders} orders being prepared`, color: C.green },
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
          {page === 'insights' && data && (
            <div>
              {/* Graph */}
              <div style={{ ...card(), padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Orders Throughout the Day</h3>
                    <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#64748b' }}>Identify peak hours and system load</p>
                  </div>
                  <span style={{ background: 'rgba(59,130,246,0.1)', color: C.blue, padding: '4px 12px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 800 }}>LIVE TRACKING</span>
                </div>
                <div style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.peak_hour_data}>
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
            </div>
          )}

          {/* ════ PAGE: VENDOR STATUS ════ */}
          {page === 'vendors' && data && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {data.vendor_performance.map(v => {
                  const statusColor = v.rush_level === 'High' ? C.red : v.rush_level === 'Medium' ? C.yellow : C.green;
                  return (
                    <div key={v.name} style={{ ...card(), display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${statusColor}10`, border: `1px solid ${statusColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: statusColor, flexShrink: 0 }}>{v.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.15rem' }}>{v.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Wait: {v.current_wait} mins</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 90 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: C.blue }}>{v.orders}</div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>orders today</div>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 900, padding: '4px 12px', borderRadius: 6, textTransform: 'uppercase', background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}25`, minWidth: 65, textAlign: 'center' }}>{v.rush_level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
