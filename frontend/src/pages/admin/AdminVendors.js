import React, { useState } from 'react';
import { ADMIN_VENDORS, ADMIN_COLLEGES } from './adminData';

const EMPTY_FORM = { name: '', collegeId: '', email: '' };

export default function AdminVendors() {
  const [vendors,     setVendors]     = useState(ADMIN_VENDORS);
  const [search,      setSearch]      = useState('');
  const [filterCol,   setFilterCol]   = useState('All');
  const [filterStatus,setFilterStatus]= useState('All');
  const [showForm,    setShowForm]    = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [confirmRemove,setConfirmRemove]= useState(null);
  const [toast,       setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = vendors.filter(v => {
    const q = search.toLowerCase();
    return (
      (!q || v.name.toLowerCase().includes(q) || v.college.toLowerCase().includes(q)) &&
      (filterCol    === 'All' || v.collegeId === filterCol) &&
      (filterStatus === 'All' || v.status    === filterStatus)
    );
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.collegeId) return;
    const college = ADMIN_COLLEGES.find(c => c.id === form.collegeId);
    const newVendor = {
      id: `v${Date.now()}`, name: form.name, college: college?.name || '',
      collegeId: form.collegeId, status: 'Active', rating: 0,
      orders: 0, complaints: 0, revenue: 0, joined: 'Apr 2025',
    };
    setVendors(prev => [...prev, newVendor]);
    setShowForm(false);
    setForm(EMPTY_FORM);
    showToast(`✓ ${form.name} added successfully`);
  };

  const handleRemove = (id) => {
    setVendors(prev => prev.filter(v => v.id !== id));
    setConfirmRemove(null);
    showToast('Vendor removed');
  };

  const toggleStatus = (id) => {
    setVendors(prev => prev.map(v => v.id === id
      ? { ...v, status: v.status === 'Active' ? 'Inactive' : v.status === 'Inactive' ? 'Active' : 'Active' }
      : v
    ));
    showToast('Vendor status updated');
  };

  const statusColor = s => s === 'Active' ? 'green' : s === 'Warning' ? 'yellow' : 'red';

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Vendor Management</h1>
          <p className="adm-page-sub">{vendors.filter(v => v.status === 'Active').length} active vendors across {ADMIN_COLLEGES.length} colleges</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowForm(true)} id="add-vendor-btn">+ Add Vendor</button>
      </div>

      {/* ── Filters ── */}
      <div className="adm-filter-row">
        <div className="adm-search-wrap">
          <span>🔍</span>
          <input className="adm-search" placeholder="Search vendors or colleges…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="adm-filter-chips">
          {['All','Active','Warning','Inactive'].map(s => (
            <button key={s} className={`adm-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <div className="adm-filter-chips">
          <button className={`adm-chip ${filterCol === 'All' ? 'active' : ''}`} onClick={() => setFilterCol('All')}>All Colleges</button>
          {ADMIN_COLLEGES.filter(c => c.status === 'Active').map(c => (
            <button key={c.id} className={`adm-chip ${filterCol === c.id ? 'active' : ''}`} onClick={() => setFilterCol(filterCol === c.id ? 'All' : c.id)}>
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Vendor Cards Grid ── */}
      <div className="adm-vendor-grid">
        {filtered.map(v => (
          <div key={v.id} className="adm-vendor-card">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>{v.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {v.college}</div>
              </div>
              <span className={`adm-status-badge ${statusColor(v.status)}`}>
                {v.status === 'Active' ? '●' : v.status === 'Warning' ? '⚠️' : '○'} {v.status}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
              {[
                { icon: '📦', label: 'Orders', val: v.orders },
                { icon: '⭐', label: 'Rating',  val: v.rating || '—' },
                { icon: '💰', label: 'Revenue', val: v.revenue ? `₹${(v.revenue/1000).toFixed(0)}K` : '₹0' },
                { icon: '💬', label: 'Complaints', val: v.complaints, alert: v.complaints > 5 },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '0.5rem 0.65rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>{s.icon} {s.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: s.alert ? 'var(--red)' : 'var(--text-primary)' }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Rating bar */}
            {v.rating > 0 && (
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Rating</div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${(v.rating / 5) * 100}%`, height: '100%', background: v.rating >= 4 ? 'var(--green)' : v.rating >= 3 ? 'var(--yellow)' : 'var(--red)', borderRadius: 99 }} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`adm-btn adm-btn-sm ${v.status === 'Active' ? 'adm-btn-danger' : 'adm-btn-success'}`}
                style={{ flex: 1 }}
                onClick={() => toggleStatus(v.id)}
              >
                {v.status === 'Active' ? 'Disable' : 'Enable'}
              </button>
              <button className="adm-btn adm-btn-sm adm-btn-danger-outline" style={{ flex: 1 }} onClick={() => setConfirmRemove(v)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No vendors found</div>
        )}
      </div>

      {/* ── Add Vendor Modal ── */}
      {showForm && (
        <div className="adm-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">Add New Vendor</h2>
              <button className="adm-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <label className="adm-label">Vendor / Shop Name *</label>
              <input className="adm-input" placeholder="e.g. Central Canteen" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

              <label className="adm-label">Assign to College *</label>
              <select className="adm-input" value={form.collegeId} onChange={e => setForm(f => ({ ...f, collegeId: e.target.value }))}>
                <option value="">— Select College —</option>
                {ADMIN_COLLEGES.filter(c => c.status === 'Active').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <label className="adm-label">Contact Email</label>
              <input className="adm-input" type="email" placeholder="vendor@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleAdd} disabled={!form.name.trim() || !form.collegeId}>Add Vendor</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Remove ── */}
      {confirmRemove && (
        <div className="adm-modal-overlay" onClick={() => setConfirmRemove(null)}>
          <div className="adm-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">Remove Vendor</h2>
              <button className="adm-modal-close" onClick={() => setConfirmRemove(null)}>✕</button>
            </div>
            <div className="adm-modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Remove <strong style={{ color: 'var(--text-primary)' }}>{confirmRemove.name}</strong> from {confirmRemove.college}? This action cannot be undone.
              </p>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" onClick={() => setConfirmRemove(null)}>Cancel</button>
              <button className="adm-btn adm-btn-danger" onClick={() => handleRemove(confirmRemove.id)}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
