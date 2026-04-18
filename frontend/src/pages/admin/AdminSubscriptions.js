import React, { useState } from 'react';
import { ADMIN_COLLEGES, SUBSCRIPTION_PLANS, REVENUE_MONTHLY } from './adminData';

const PLAN_COLOR  = { Premium: 'var(--yellow)', Standard: 'var(--accent)', Basic: 'var(--text-muted)' };
const PLAN_BORDER = { Premium: 'rgba(245,158,11,0.3)', Standard: 'rgba(56,189,248,0.3)', Basic: 'rgba(255,255,255,0.1)' };

export default function AdminSubscriptions() {
  const [colleges, setColleges] = useState(ADMIN_COLLEGES);
  const [toast, setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const changePlan = (id, newPlan) => {
    setColleges(prev => prev.map(c => c.id === id ? { ...c, plan: newPlan } : c));
    const col = colleges.find(c => c.id === id);
    showToast(`✓ ${col?.name} updated to ${newPlan} plan`);
  };

  const totalMRR = ADMIN_COLLEGES.reduce((sum, c) => {
    const p = SUBSCRIPTION_PLANS.find(s => s.name === c.plan);
    return sum + (p?.price || 0);
  }, 0);

  const planCounts = SUBSCRIPTION_PLANS.map(p => ({
    ...p,
    count: colleges.filter(c => c.plan === p.name).length,
    mrr: SUBSCRIPTION_PLANS.find(s => s.name === p.name)?.price *
         colleges.filter(c => c.plan === p.name).length,
  }));

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Subscription Management</h1>
          <p className="adm-page-sub">Manage plans for all colleges · Total MRR ₹{totalMRR.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {planCounts.map(plan => (
          <div key={plan.id} style={{
            background: 'var(--adm-surface)',
            border: `1px solid ${PLAN_BORDER[plan.name]}`,
            borderRadius: 16, overflow: 'hidden',
            boxShadow: plan.name === 'Premium' ? '0 0 20px rgba(245,158,11,0.1)' : 'none',
          }}>
            {plan.name === 'Premium' && (
              <div style={{ background: 'linear-gradient(90deg, #f59e0b, #fb923c)', padding: '0.3rem 0', textAlign: 'center', fontSize: '0.68rem', fontWeight: 800, color: '#000', letterSpacing: '0.1em' }}>
                ⭐ MOST VALUE
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: PLAN_COLOR[plan.name], marginBottom: '0.2rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{plan.count} college{plan.count !== 1 ? 's' : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: PLAN_COLOR[plan.name], lineHeight: 1 }}>₹{plan.price}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>/month</div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)', marginBottom: '0.75rem' }}>
                MRR: ₹{(plan.mrr || 0).toLocaleString()}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: PLAN_COLOR[plan.name] }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ── Per-college subscription table ── */}
      <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="adm-card-title">📋 College Subscriptions</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>{['College','Current Plan','Monthly Fee','Status','Orders/Day','Joined','Change Plan'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {colleges.map(c => {
                const plan = SUBSCRIPTION_PLANS.find(p => p.name === c.plan);
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                    </td>
                    <td>
                      <span style={{ color: PLAN_COLOR[c.plan], fontWeight: 800, fontSize: '0.88rem' }}>{c.plan}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--green)' }}>₹{plan?.price || 0}</td>
                    <td>
                      <span className={`adm-status-badge ${c.status === 'Active' ? 'green' : 'red'}`}>
                        {c.status === 'Active' ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.orders}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {['Basic','Standard','Premium'].filter(p => p !== c.plan).map(p => (
                          <button
                            key={p}
                            className="adm-btn adm-btn-sm"
                            style={{ color: PLAN_COLOR[p], border: `1px solid ${PLAN_BORDER[p]}`, background: 'transparent' }}
                            onClick={() => changePlan(c.id, p)}
                          >
                            → {p}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Revenue summary ── */}
      <div className="adm-card" style={{ marginTop: '1.5rem' }}>
        <div className="adm-card-title" style={{ marginBottom: '1rem' }}>💰 Revenue Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {[
            { label: 'Total MRR',          val: `₹${totalMRR.toLocaleString()}`,  color: 'var(--green)' },
            { label: 'May Forecast',        val: '₹87,000',                        color: 'var(--accent)' },
            { label: 'Active Subscriptions',val: colleges.filter(c => c.status === 'Active').length, color: 'var(--yellow)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, marginBottom: '0.25rem' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
