import React, { useState } from 'react';
import { ADMIN_USERS, ADMIN_COLLEGES } from './adminData';

export default function AdminUsers() {
  const [users,       setUsers]       = useState(ADMIN_USERS);
  const [search,      setSearch]      = useState('');
  const [filterRole,  setFilterRole]  = useState('All');
  const [filterStatus,setFilterStatus]= useState('All');
  const [filterCol,   setFilterCol]   = useState('All');
  const [toast,       setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (!q || u.name.toLowerCase().includes(q) || u.college.toLowerCase().includes(q)) &&
      (filterRole   === 'All' || u.role   === filterRole) &&
      (filterStatus === 'All' || u.status === filterStatus) &&
      (filterCol    === 'All' || u.college === filterCol)
    );
  });

  const toggleBlock = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' }
      : u
    ));
    const u = users.find(u => u.id === id);
    showToast(u.status === 'Blocked' ? `✓ ${u.name} unblocked` : `⛔ ${u.name} blocked`);
  };

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === 'Inactive' ? 'Active' : 'Inactive' }
      : u
    ));
    showToast('User status updated');
  };

  const statusColor = s => s === 'Active' ? 'var(--green)' : s === 'Blocked' ? 'var(--red)' : 'var(--text-muted)';
  const statusBg    = s => s === 'Active' ? 'green' : s === 'Blocked' ? 'red' : 'gray';

  const summary = {
    total:   users.length,
    active:  users.filter(u => u.status === 'Active').length,
    blocked: users.filter(u => u.status === 'Blocked').length,
    students:users.filter(u => u.role === 'student').length,
    vendors: users.filter(u => u.role === 'vendor' || u.role === 'vendorr').length,
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">User Monitoring</h1>
          <p className="adm-page-sub">{summary.total} users · {summary.blocked} blocked · {summary.vendors} vendors</p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users',      val: summary.total,    color: 'var(--accent)'  },
          { label: 'Active',           val: summary.active,   color: 'var(--green)'   },
          { label: 'Blocked',          val: summary.blocked,  color: 'var(--red)'     },
          { label: 'Students / Vendors',val: `${summary.students} / ${summary.vendors}`, color: 'var(--yellow)' },
        ].map(s => (
          <div key={s.label} className="adm-kpi-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="adm-filter-row">
        <div className="adm-search-wrap">
          <span>🔍</span>
          <input className="adm-search" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-filter-chips">
          {['All','student','vendor'].map(r => (
            <button key={r} className={`adm-chip ${filterRole === r ? 'active' : ''}`} onClick={() => setFilterRole(r)}>
              {r === 'student' ? '🎓 Students' : r === 'vendor' ? '🍽️ Vendors' : 'All Roles'}
            </button>
          ))}
        </div>
        <div className="adm-filter-chips">
          {['All','Active','Blocked','Inactive'].map(s => (
            <button key={s} className={`adm-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>{['User','Role','College','Status','Orders','Joined','Last Seen','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), #0ea5e9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', color: 'var(--bg)',
                        flexShrink: 0,
                      }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      {u.role === 'student' ? '🎓 Student' : '🍽️ Vendor'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{u.college}</td>
                  <td>
                    <span className={`adm-status-badge ${statusBg(u.status)}`}>
                      {u.status === 'Active' ? '●' : u.status === 'Blocked' ? '⛔' : '○'} {u.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{u.orders}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.joined}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.lastSeen}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className={`adm-btn adm-btn-sm ${u.status === 'Blocked' ? 'adm-btn-success' : 'adm-btn-danger'}`}
                        onClick={() => toggleBlock(u.id)}
                      >
                        {u.status === 'Blocked' ? 'Unblock' : 'Block'}
                      </button>
                      {u.status !== 'Blocked' && (
                        <button className="adm-btn adm-btn-sm" onClick={() => toggleActive(u.id)}>
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No users found</div>
          )}
        </div>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
