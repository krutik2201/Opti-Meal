import React, { useState, useEffect } from 'react';
import { getVendorOrders, updateOrderStatus } from '../services/api';
import '../styles.css';

const C = (x={}) => ({ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'1.5rem', ...x });

const STATUS_CONFIG = {
  'pending': { button: 'Accept Order', next: 'preparing', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  'preparing': { button: 'Mark as Ready', next: 'ready', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'ready': { button: 'Hand over / Done', next: 'completed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'completed': { button: 'Completed', next: null, color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
};

function VendorDashboard({ auth, onLogout }) {
  const [page, setPage] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [kitchenMode, setKitchenMode] = useState(false);
  
  const vendorId = auth?.vendorId || 1; // Default to 1 for demo

  const fetchOrders = async () => {
    try {
      const res = await getVendorOrders(vendorId);
      setOrders(res.filter(o => o.status !== 'completed'));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const t = setInterval(() => setTime(new Date()), 1000);
    const poller = setInterval(fetchOrders, 5000);
    return () => { clearInterval(t); clearInterval(poller); };
  }, []);

  const handleAction = async (id, currentStatus) => {
    const nextStatus = STATUS_CONFIG[currentStatus].next;
    if (!nextStatus) return;
    try {
      await updateOrderStatus(id, nextStatus);
      fetchOrders();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const active = orders.length;
  const loadLbl = active > 8 ? 'High' : active > 4 ? 'Moderate' : 'Low';
  const loadClr = active > 8 ? '#ef4444' : active > 4 ? '#f59e0b' : '#10b981';
  const estTime = active > 8 ? '10-12 min' : active > 4 ? '6-8 min' : '4-5 min';

  const Nav = ({ id, label, icon, badge }) => (
    <button onClick={() => setPage(id)} style={{
      width:'100%', padding:'0.9rem 1.4rem', display:'flex', alignItems:'center', gap:'0.7rem', background: page===id ? 'rgba(59,130,246,0.1)' : 'transparent',
      border:'none', borderLeft: `3px solid ${page===id ? 'var(--accent)' : 'transparent'}`, color: page===id ? 'var(--accent)' : 'var(--text-secondary)',
      fontSize:'0.88rem', fontWeight: page===id ? 800 : 600, cursor:'pointer', textAlign:'left', transition:'all 0.15s', marginBottom:'2px'
    }}>
      <span style={{ fontSize:'1.1rem' }}>{icon}</span>{label}
      {badge > 0 && <span style={{ marginLeft:'auto', background:'var(--accent)', color:'#000', fontSize:'0.6rem', fontWeight:900, padding:'2px 7px', borderRadius:10 }}>{badge}</span>}
    </button>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)', color:'var(--text-primary)' }}>
      {/* SIDEBAR */}
      <aside style={{ width:250, background:'rgba(15,23,42,0.5)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', zIndex:110 }}>
        <div style={{ padding:'1.25rem', borderBottom:'1px solid var(--border)', marginBottom:'0.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ fontSize:'1.4rem' }}>🍳</span>
            <h1 style={{ fontSize:'1.1rem', fontWeight:800, margin:0 }}>Opti<span style={{ color:'var(--accent)' }}>Meal</span></h1>
          </div>
          <div style={{ fontSize:'0.6rem', color:'var(--accent)', fontWeight:700, marginTop:3, letterSpacing:'0.04em' }}>VENDOR KITCHEN v3.0</div>
        </div>
        <nav style={{ flex:1 }}>
          <Nav id="orders" label="Live Orders" icon="📦" badge={active} />
          <Nav id="menu" label="Menu & Stock" icon="📋" />
          <Nav id="insights" label="Business Insights" icon="📈" />
        </nav>
        <div style={{ padding:'0.75rem 1rem', borderTop:'1px solid var(--border)' }}>
          <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.78rem', fontWeight:700, color:'var(--text-secondary)', cursor:'pointer', padding:'0.5rem 0.6rem', borderRadius:10, background:'rgba(255,255,255,0.03)' }}>
            <input type="checkbox" checked={kitchenMode} onChange={e => setKitchenMode(e.target.checked)} style={{ accentColor:'var(--accent)' }} />
            👨‍🍳 Kitchen Mode
          </label>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem', marginTop:'0.5rem' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#000', fontSize:'0.7rem' }}>V</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.78rem', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{auth?.userName || 'Vendor'}</div>
              <div style={{ fontSize:'0.6rem', color:'var(--text-muted)' }}>Main Canteen</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width:'100%', marginTop:'0.5rem', background:'none', border:'1px solid var(--border)', color:'var(--red)', padding:'0.45rem', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:'0.72rem' }}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {/* TOPBAR */}
        <header style={{ padding:'0.75rem 2rem', borderBottom:'1px solid var(--border)', background:'rgba(8,12,20,0.85)', backdropFilter:'blur(10px)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100 }}>
          <div>
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, margin:0 }}>Live Orders</h2>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>Kitchen Active · {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })} · Est. Prep: {estTime}</div>
          </div>
          <div style={{ display:'flex', gap:'1.25rem' }}>
            {[{ l:'Active', v:active, c:'var(--accent)' }, { l:'Load', v:loadLbl, c:loadClr }].map(s => (
              <div key={s.l} style={{ textAlign:'center', borderLeft:'1px solid var(--border)', paddingLeft:'1.25rem' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{s.l}</div>
                <div style={{ fontSize:'1.05rem', fontWeight:900, color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </header>

        <div style={{ padding:'1.75rem 2rem', maxWidth:1200 }}>
          {loading && <div style={{ textAlign:'center', padding:'3rem' }}>Loading Orders...</div>}
          {error && <div style={{ color:'var(--red)', padding:'1rem', background:'rgba(239,68,68,0.1)', borderRadius:12, marginBottom:'1rem' }}>⚠️ {error}</div>}

          {page === 'orders' && !loading && (
            <div style={{ display:'grid', gridTemplateColumns: kitchenMode ? 'repeat(auto-fill,minmax(280px,1fr))' : 'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
              {orders.length === 0 ? (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'5rem', background:'rgba(255,255,255,0.02)', borderRadius:24, border:'1px dashed var(--border)' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✨</div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem' }}>No active orders</div>
                </div>
              ) : orders.map(o => {
                const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG['pending'];
                return (
                  <div key={o.order_id} style={{ ...C(), border: o.is_express ? '2px solid var(--accent)' : '1px solid var(--border)', position:'relative' }}>
                    {o.is_express && <div style={{ position:'absolute', top:-10, right:14, background:'var(--accent)', color:'#000', fontSize:'0.62rem', fontWeight:900, padding:'2px 8px', borderRadius:6 }}>⚡ EXPRESS</div>}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <span style={{ fontSize:'0.82rem', fontWeight:800, color:'var(--text-muted)' }}>#{o.order_id}</span>
                      <span style={{ fontSize:'0.62rem', fontWeight:900, background:cfg.bg, color:cfg.color, padding:'3px 8px', borderRadius:6, textTransform:'uppercase' }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: kitchenMode ? '1.3rem' : '1.1rem', fontWeight:800, marginBottom:10 }}>
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'var(--text-secondary)', marginBottom:15 }}>
                      <span>Slot: <b style={{ color:'var(--text-primary)' }}>{o.pickup_slot}</b></span>
                    </div>
                    {cfg.next && (
                      <button onClick={() => handleAction(o.order_id, o.status)} style={{ width:'100%', padding: '0.85rem', background:cfg.color, color:'#000', border:'none', borderRadius:12, fontWeight:900, fontSize: '0.92rem', cursor:'pointer' }}>{cfg.button}</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default VendorDashboard;
