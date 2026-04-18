import React, { useState } from 'react';
import { ADMIN_ORDERS, PLATFORM_SUMMARY } from './adminData';

const STATUS_COLOR = { Completed: 'green', Preparing: 'yellow', Pending: 'gray', Cancelled: 'red' };
const ps = PLATFORM_SUMMARY;

export default function AdminOrders() {
  const [search,      setSearch]      = useState('');
  const [filterStatus,setFilterStatus]= useState('All');
  const [filterCol,   setFilterCol]   = useState('All');

  const colleges = [...new Set(ADMIN_ORDERS.map(o => o.college))];

  const filtered = ADMIN_ORDERS.filter(o => {
    const q = search.toLowerCase();
    return (
      (!q || o.id.toLowerCase().includes(q) || o.college.toLowerCase().includes(q) || o.vendor.toLowerCase().includes(q)) &&
      (filterStatus === 'All' || o.status  === filterStatus) &&
      (filterCol    === 'All' || o.college === filterCol)
    );
  });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Order Monitoring</h1>
          <p className="adm-page-sub">Platform-wide order view (read-only) · {ps.totalOrdersToday.toLocaleString()} orders today</p>
        </div>
        <span className="adm-badge adm-badge-yellow">👁️ View Only</span>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '📦', label: 'Total Today',   val: ps.totalOrdersToday.toLocaleString(), color: 'var(--accent)'  },
          { icon: '🔄', label: 'Active Orders',  val: ps.activeOrders,                      color: 'var(--yellow)'  },
          { icon: '✅', label: 'Completed',      val: ps.completedToday.toLocaleString(),   color: 'var(--green)'   },
          { icon: '❌', label: 'Cancelled',      val: ADMIN_ORDERS.filter(o => o.status === 'Cancelled').length, color: 'var(--red)' },
        ].map(s => (
          <div key={s.label} className="adm-kpi-card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="adm-filter-row">
        <div className="adm-search-wrap">
          <span>🔍</span>
          <input className="adm-search" placeholder="Search order ID, college, vendor…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-filter-chips">
          {['All','Pending','Preparing','Completed','Cancelled'].map(s => (
            <button key={s} className={`adm-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className="adm-filter-chips">
          <button className={`adm-chip ${filterCol === 'All' ? 'active' : ''}`} onClick={() => setFilterCol('All')}>All Colleges</button>
          {colleges.map(c => (
            <button key={c} className={`adm-chip ${filterCol === c ? 'active' : ''}`} onClick={() => setFilterCol(filterCol === c ? 'All' : c)}>
              {c.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Read-only notice ── */}
      <div style={{
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)',
      }}>
        <span>ℹ️</span>
        <span><strong style={{ color: 'var(--yellow)' }}>Admin View is read-only.</strong> Order modifications are handled by vendors. This panel provides platform-wide monitoring only.</span>
      </div>

      {/* ── Orders Table ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>{['Order ID','College','Vendor','Items','Total','Status','Time'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent)' }}>{o.id}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{o.college}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{o.vendor}</td>
                  <td style={{ fontWeight: 600 }}>{o.items}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>₹{o.total}</td>
                  <td>
                    <span className={`adm-status-badge ${STATUS_COLOR[o.status]}`}>
                      {o.status === 'Completed' ? '✓' : o.status === 'Preparing' ? '👨‍🍳' : o.status === 'Pending' ? '⏳' : '✕'} {o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
