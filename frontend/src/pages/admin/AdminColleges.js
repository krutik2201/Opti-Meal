import React, { useState } from 'react';
import { ADMIN_COLLEGES, SUBSCRIPTION_PLANS } from './adminData';

const PLAN_COLOR = { Premium: 'var(--yellow)', Standard: 'var(--accent)', Basic: 'var(--text-muted)' };
const RISK_COLOR = { Low: 'var(--green)', Medium: 'var(--yellow)', High: 'var(--red)' };

const EMPTY_FORM = { name: '', plan: 'Basic', city: '', email: '', students: '' };

export default function AdminColleges() {
  const [colleges,    setColleges]   = useState(ADMIN_COLLEGES);
  const [search,      setSearch]     = useState('');
  const [filterPlan,  setFilterPlan] = useState('All');
  const [filterStatus,setFilterStatus]= useState('All');
  const [showForm,    setShowForm]   = useState(false);
  const [editId,      setEditId]     = useState(null);
  const [form,        setForm]       = useState(EMPTY_FORM);
  const [confirmId,   setConfirmId]  = useState(null);

  const filtered = colleges.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q || c.name.toLowerCase().includes(q)) &&
      (filterPlan   === 'All' || c.plan   === filterPlan) &&
      (filterStatus === 'All' || c.status === filterStatus)
    );
  });

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (c) => { setForm({ name: c.name, plan: c.plan, city: '', email: '', students: c.students }); setEditId(c.id); setShowForm(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setColleges(prev => prev.map(c => c.id === editId ? { ...c, name: form.name, plan: form.plan, students: +form.students || c.students } : c));
    } else {
      const newCol = {
        id: `c${Date.now()}`, name: form.name, plan: form.plan, status: 'Active',
        students: +form.students || 0, orders: 0, revenue: 0, joined: 'Apr 2025',
        growth: 0, churnRisk: 'Low', lastActive: 'just now',
      };
      setColleges(prev => [...prev, newCol]);
    }
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    setColleges(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
    setConfirmId(null);
  };

  const upgradePlan = (id, newPlan) => {
    setColleges(prev => prev.map(c => c.id === id ? { ...c, plan: newPlan } : c));
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">College Management</h1>
          <p className="adm-page-sub">{colleges.filter(c => c.status === 'Active').length} active colleges · {colleges.length} total</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openAdd} id="add-college-btn">+ Add College</button>
      </div>

      {/* ── Filters ── */}
      <div className="adm-filter-row">
        <div className="adm-search-wrap">
          <span>🔍</span>
          <input className="adm-search" placeholder="Search colleges…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-filter-chips">
          {['All','Active','Inactive'].map(s => (
            <button key={s} className={`adm-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className="adm-filter-chips">
          {['All','Premium','Standard','Basic'].map(p => (
            <button key={p} className={`adm-chip ${filterPlan === p ? 'active' : ''}`} onClick={() => setFilterPlan(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>{['College','Plan','Status','Students','Orders/Day','Revenue','Growth','Churn Risk','Last Active','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Since {c.joined}</div>
                  </td>
                  <td>
                    <span style={{ color: PLAN_COLOR[c.plan], fontWeight: 700, fontSize: '0.8rem' }}>{c.plan}</span>
                    <div style={{ marginTop: '0.25rem' }}>
                      <select
                        className="adm-mini-select"
                        value={c.plan}
                        onChange={e => upgradePlan(c.id, e.target.value)}
                      >
                        {['Basic','Standard','Premium'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </td>
                  <td>
                    <span className={`adm-status-badge ${c.status === 'Active' ? 'green' : 'red'}`}>
                      {c.status === 'Active' ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>{c.students.toLocaleString()}</td>
                  <td style={{ fontWeight: 600 }}>{c.orders}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>₹{c.revenue.toLocaleString()}</td>
                  <td>
                    <span style={{ color: c.growth >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {c.growth >= 0 ? '▲' : '▼'} {Math.abs(c.growth)}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: RISK_COLOR[c.churnRisk], fontWeight: 600, fontSize: '0.8rem' }}>{c.churnRisk}</span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.lastActive}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="adm-btn adm-btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button
                        className={`adm-btn adm-btn-sm ${c.status === 'Active' ? 'adm-btn-danger' : 'adm-btn-success'}`}
                        onClick={() => setConfirmId(c.id)}
                      >
                        {c.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No colleges found</div>
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="adm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">{editId ? 'Edit College' : 'Add New College'}</h2>
              <button className="adm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <label className="adm-label">College Name *</label>
              <input className="adm-input" placeholder="e.g. IIT Delhi" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

              <label className="adm-label">Subscription Plan</label>
              <select className="adm-input" value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                {['Basic','Standard','Premium'].map(p => <option key={p} value={p}>{p} — ₹{SUBSCRIPTION_PLANS.find(s => s.name === p)?.price}/mo</option>)}
              </select>

              <label className="adm-label">Contact Email</label>
              <input className="adm-input" placeholder="admin@college.edu" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />

              <label className="adm-label">Approx. Students</label>
              <input className="adm-input" placeholder="e.g. 3500" type="number" value={form.students} onChange={e => setForm(f => ({ ...f, students: e.target.value }))} />
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={!form.name.trim()}>
                {editId ? 'Save Changes' : 'Add College'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Disable ── */}
      {confirmId && (
        <div className="adm-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="adm-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">Confirm Action</h2>
              <button className="adm-modal-close" onClick={() => setConfirmId(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Are you sure you want to {colleges.find(c => c.id === confirmId)?.status === 'Active' ? 'disable' : 'enable'} <strong style={{ color: 'var(--text-primary)' }}>{colleges.find(c => c.id === confirmId)?.name}</strong>?
                {colleges.find(c => c.id === confirmId)?.status === 'Active' && ' This will restrict access for all students and vendors at this college.'}
              </p>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={() => toggleStatus(confirmId)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
