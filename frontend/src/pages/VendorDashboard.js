import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INITIAL_ORDERS, MENU_ITEMS, TOP_SELLING, ALERTS, STATUS_CONFIG } from './vendor/vendorData';
import '../styles.css';

const C = (x={}) => ({ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'20px', padding:'1.5rem', ...x });

function VendorDashboard({ auth, onLogout }) {
  const [page, setPage] = useState('orders');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [menu, setMenu] = useState(MENU_ITEMS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [completed, setCompleted] = useState(32);
  const [revenue, setRevenue] = useState(3500);
  const [time, setTime] = useState(new Date());
  const [kitchenMode, setKitchenMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ name:'', price:'', category:'Snack', stock:'' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const active = orders.length;
  const loadLbl = active > 8 ? 'High' : active > 4 ? 'Moderate' : 'Low';
  const loadClr = active > 8 ? '#ef4444' : active > 4 ? '#f59e0b' : '#10b981';
  const estTime = active > 8 ? '10-12 min' : active > 4 ? '6-8 min' : '4-5 min';

  const handleAction = (id) => {
    setOrders(prev => {
      const o = prev.find(x => x.id === id);
      if (!o) return prev;
      const nxt = STATUS_CONFIG[o.status].next;
      if (nxt === 'Completed') { setCompleted(c => c+1); setRevenue(r => r + 80); return prev.filter(x => x.id !== id); }
      return prev.map(x => x.id === id ? { ...x, status: nxt, est: nxt === 'Ready' ? 0 : x.est } : x);
    });
  };

  const toggleAvail = (id) => setMenu(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m));
  const deleteMenuItem = (id) => setMenu(prev => prev.filter(m => m.id !== id));
  const saveEdit = () => { setMenu(prev => prev.map(m => m.id === editItem.id ? editItem : m)); setEditItem(null); };
  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu(prev => [...prev, { id: 'm'+Date.now(), name: newItem.name, price: Number(newItem.price), category: newItem.category, available: true, stock: Number(newItem.stock) || 0 }]);
    setNewItem({ name:'', price:'', category:'Snack', stock:'' }); setShowAdd(false);
  };

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

  const inp = (v, set, ph, w='100%') => <input value={v} onChange={e => set(e.target.value)} placeholder={ph} style={{ width:w, padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-primary)', fontSize:'0.85rem', fontFamily:'inherit' }} />;

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
          <Nav id="alerts" label="Smart Alerts" icon="🔔" badge={alerts.length} />
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
            <h2 style={{ fontSize:'1.15rem', fontWeight:800, margin:0 }}>{page === 'orders' ? '📦 Live Orders' : page === 'menu' ? '📋 Menu & Stock' : page === 'insights' ? '📈 Business Insights' : '🔔 Smart Alerts'}</h2>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>Kitchen Active · {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })} · Est. Prep: {estTime}</div>
          </div>
          <div style={{ display:'flex', gap:'1.25rem' }}>
            {[{ l:'Active', v:active, c:'var(--accent)' }, { l:'Done', v:completed, c:'var(--green)' }, { l:'Revenue', v:'₹'+revenue, c:'var(--green)' }, { l:'Load', v:loadLbl, c:loadClr }].map(s => (
              <div key={s.l} style={{ textAlign:'center', borderLeft:'1px solid var(--border)', paddingLeft:'1.25rem' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase' }}>{s.l}</div>
                <div style={{ fontSize:'1.05rem', fontWeight:900, color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
        </header>

        <div style={{ padding:'1.75rem 2rem', maxWidth:1200 }}>

          {/* ════ ORDERS ════ */}
          {page === 'orders' && (
            <div style={{ display:'grid', gridTemplateColumns: kitchenMode ? 'repeat(auto-fill,minmax(280px,1fr))' : 'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
              {orders.length === 0 ? (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'5rem', background:'rgba(255,255,255,0.02)', borderRadius:24, border:'1px dashed var(--border)' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✨</div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem' }}>No active orders</div>
                  <div style={{ color:'var(--text-muted)', marginTop:'0.4rem' }}>New orders appear here automatically.</div>
                </div>
              ) : orders.map(o => {
                const cfg = STATUS_CONFIG[o.status];
                return (
                  <div key={o.id} style={{ ...C(), border: o.express ? '2px solid var(--accent)' : '1px solid var(--border)', boxShadow: o.express ? '0 0 20px rgba(59,130,246,0.12)' : 'none', display:'flex', flexDirection:'column', gap: kitchenMode ? '0.75rem' : '1rem', position:'relative', padding: kitchenMode ? '1.25rem' : '1.5rem' }}>
                    {o.express && <div style={{ position:'absolute', top:-10, right:14, background:'var(--accent)', color:'#000', fontSize:'0.62rem', fontWeight:900, padding:'2px 8px', borderRadius:6 }}>⚡ EXPRESS</div>}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'0.82rem', fontWeight:800, color:'var(--text-muted)' }}>{o.id}</span>
                      <span style={{ fontSize:'0.62rem', fontWeight:900, background:cfg.bg, color:cfg.color, padding:'3px 8px', borderRadius:6, textTransform:'uppercase' }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: kitchenMode ? '1.3rem' : '1.1rem', fontWeight:800 }}>{o.items}</div>
                    {!kitchenMode && (
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'var(--text-secondary)' }}>
                        <span>Pickup: <b style={{ color:'var(--text-primary)' }}>{o.pickup}</b></span>
                        {o.est > 0 && <span style={{ color:'var(--yellow)', fontWeight:700 }}>⏱ ~{o.est}m</span>}
                      </div>
                    )}
                    <button onClick={() => handleAction(o.id)} style={{ width:'100%', padding: kitchenMode ? '1rem' : '0.85rem', background:cfg.color, color:'#000', border:'none', borderRadius:12, fontWeight:900, fontSize: kitchenMode ? '1.1rem' : '0.92rem', cursor:'pointer', transition:'transform 0.1s' }}
                      onMouseDown={e => e.currentTarget.style.transform='scale(0.96)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
                    >{cfg.button}</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ MENU & STOCK ════ */}
          {page === 'menu' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                <h3 style={{ margin:0, fontWeight:800 }}>Menu Items ({menu.length})</h3>
                <button onClick={() => setShowAdd(!showAdd)} style={{ background:'var(--accent)', color:'#000', border:'none', padding:'0.55rem 1.2rem', borderRadius:10, fontWeight:800, fontSize:'0.82rem', cursor:'pointer' }}>{showAdd ? '✕ Cancel' : '+ Add Item'}</button>
              </div>

              {showAdd && (
                <div style={{ ...C(), marginBottom:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:'0.75rem', alignItems:'end' }}>
                  <div><div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>NAME</div>{inp(newItem.name, v => setNewItem(p => ({...p, name:v})), 'Samosa')}</div>
                  <div><div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>PRICE (₹)</div>{inp(newItem.price, v => setNewItem(p => ({...p, price:v})), '20')}</div>
                  <div><div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>CATEGORY</div>
                    <select value={newItem.category} onChange={e => setNewItem(p => ({...p, category:e.target.value}))} style={{ width:'100%', padding:'0.6rem 0.8rem', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-primary)', fontSize:'0.85rem' }}>
                      <option value="Snack">Snack</option><option value="Beverage">Beverage</option><option value="Main">Main</option>
                    </select>
                  </div>
                  <div><div style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>STOCK</div>{inp(newItem.stock, v => setNewItem(p => ({...p, stock:v})), '50')}</div>
                  <button onClick={addItem} style={{ background:'var(--green)', color:'#000', border:'none', padding:'0.6rem 1.2rem', borderRadius:10, fontWeight:800, fontSize:'0.85rem', cursor:'pointer', height:40 }}>Save</button>
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
                {menu.map(m => (
                  <div key={m.id} style={{ ...C(), opacity: m.available ? 1 : 0.5, display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                    {editItem?.id === m.id ? (
                      <>
                        {inp(editItem.name, v => setEditItem(p => ({...p, name:v})), 'Name')}
                        <div style={{ display:'flex', gap:'0.5rem' }}>
                          {inp(editItem.price, v => setEditItem(p => ({...p, price:Number(v)})), '₹', '50%')}
                          {inp(editItem.stock, v => setEditItem(p => ({...p, stock:Number(v)})), 'Stock', '50%')}
                        </div>
                        <div style={{ display:'flex', gap:'0.5rem' }}>
                          <button onClick={saveEdit} style={{ flex:1, background:'var(--green)', color:'#000', border:'none', padding:'0.5rem', borderRadius:8, fontWeight:800, fontSize:'0.8rem', cursor:'pointer' }}>Save</button>
                          <button onClick={() => setEditItem(null)} style={{ flex:1, background:'none', border:'1px solid var(--border)', color:'var(--text-muted)', padding:'0.5rem', borderRadius:8, fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontWeight:800, fontSize:'1rem' }}>{m.name}</span>
                          <span style={{ fontSize:'0.65rem', fontWeight:800, background: m.available ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: m.available ? 'var(--green)' : 'var(--red)', padding:'3px 8px', borderRadius:6 }}>{m.available ? 'Available' : 'Out of Stock'}</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', color:'var(--text-secondary)' }}>
                          <span>₹{m.price} · {m.category}</span>
                          <span style={{ fontWeight:700, color: m.stock < 10 ? 'var(--red)' : 'var(--text-primary)' }}>Stock: {m.stock} {m.stock < 10 && m.stock > 0 ? '⚠️' : ''}</span>
                        </div>
                        <div style={{ display:'flex', gap:'0.5rem' }}>
                          <button onClick={() => toggleAvail(m.id)} style={{ flex:1, background: m.available ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border:`1px solid ${m.available ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, color: m.available ? 'var(--red)' : 'var(--green)', padding:'0.45rem', borderRadius:8, fontWeight:700, fontSize:'0.75rem', cursor:'pointer' }}>{m.available ? 'Mark Unavailable' : 'Mark Available'}</button>
                          <button onClick={() => setEditItem({...m})} style={{ background:'none', border:'1px solid var(--border)', color:'var(--accent)', padding:'0.45rem 0.8rem', borderRadius:8, fontWeight:700, fontSize:'0.75rem', cursor:'pointer' }}>✏️</button>
                          <button onClick={() => deleteMenuItem(m.id)} style={{ background:'none', border:'1px solid var(--border)', color:'var(--red)', padding:'0.45rem 0.8rem', borderRadius:8, fontWeight:700, fontSize:'0.75rem', cursor:'pointer' }}>🗑</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ INSIGHTS ════ */}
          {page === 'insights' && (
            <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'2rem', alignItems:'start' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                <div style={C()}>
                  <h3 style={{ margin:'0 0 1.5rem', fontWeight:800 }}>📊 Top Selling Items Today</h3>
                  <div style={{ height:280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TOP_SELLING} layout="vertical" margin={{ left:0, right:25 }}>
                        <XAxis type="number" hide /><YAxis dataKey="name" type="category" width={85} tick={{ fill:'var(--text-secondary)', fontSize:13, fontWeight:700 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid var(--border)', borderRadius:10 }} />
                        <Bar dataKey="value" radius={[0,12,12,0]} barSize={28}>{TOP_SELLING.map((e,i) => <Cell key={i} fill={e.color} />)}</Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={C()}>
                  <h3 style={{ margin:'0 0 1rem', fontWeight:800 }}>📊 Business Summary</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                    {[{ l:'Most Profitable', v:'Pav Bhaji', c:'var(--green)' }, { l:'Peak Time', v:'12:30 PM', c:'var(--accent)' }, { l:'Unsold Today', v:'3 items', c:'var(--red)' }].map(s => (
                      <div key={s.l} style={{ padding:'1rem', background:'rgba(255,255,255,0.02)', borderRadius:14, border:'1px solid var(--border)', textAlign:'center' }}>
                        <div style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>{s.l}</div>
                        <div style={{ fontSize:'1rem', fontWeight:900, color:s.c }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                <div style={C()}>
                  <h3 style={{ margin:'0 0 1rem', fontWeight:800 }}>📉 Quick Insights</h3>
                  {[{ l:'🔥 Most Selling', v:'Samosa', c:'var(--green)' }, { l:'⚠️ Least Selling', v:'Burger', c:'var(--red)' }].map(s => (
                    <div key={s.l} style={{ display:'flex', justifyContent:'space-between', padding:'0.85rem', background:'rgba(255,255,255,0.02)', borderRadius:12, marginBottom:'0.6rem' }}>
                      <span style={{ fontWeight:600, fontSize:'0.88rem' }}>{s.l}</span><span style={{ fontWeight:800, color:s.c }}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div style={C()}>
                  <h3 style={{ margin:'0 0 1rem', fontWeight:800 }}>💡 Smart Suggestions</h3>
                  {['🚀 Prepare more Samosas for lunch rush', '📉 Reduce Burger prep to avoid waste', '⏱ Avg prep time: 8min (target: 6min)', '📦 Stock up on Tea — running low'].map((t,i) => (
                    <div key={i} style={{ display:'flex', gap:'0.6rem', fontSize:'0.85rem', color:'var(--text-secondary)', padding:'0.5rem 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ ALERTS ════ */}
          {page === 'alerts' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
                <h3 style={{ margin:0, fontWeight:800 }}>🔔 System Notifications</h3>
                <button onClick={() => setAlerts([])} style={{ background:'none', border:'none', color:'var(--accent)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>Clear All</button>
              </div>
              {alerts.length === 0 ? (
                <div style={{ textAlign:'center', padding:'5rem', background:'rgba(255,255,255,0.02)', borderRadius:24 }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div><div style={{ fontWeight:800 }}>All clear!</div>
                </div>
              ) : alerts.map(a => (
                <div key={a.id} style={{ ...C(), marginBottom:'1rem', display:'flex', alignItems:'flex-start', gap:'1.25rem', borderLeft:`4px solid ${a.type === 'warning' ? 'var(--yellow)' : 'var(--accent)'}` }}>
                  <span style={{ fontSize:'1.5rem' }}>{a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:'0.95rem', color: a.type === 'warning' ? 'var(--yellow)' : 'var(--text-primary)' }}>{a.text}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop:3 }}>{a.sub}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:4 }}>{a.time}</div>
                  </div>
                  <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1rem' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default VendorDashboard;
