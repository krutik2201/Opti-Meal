import React, { useState, useCallback, useEffect } from 'react';

import StudentHome     from './student/StudentHome';
import StudentMenu     from './student/StudentMenu';
import StudentCart     from './student/StudentCart';
import StudentTracking from './student/StudentTracking';
import StudentProfile  from './student/StudentProfile';
import StudentItemDetail from './student/StudentItemDetail';

import { MOCK_PAST_ORDERS, MENU_ITEMS, VENDORS } from './student/data';
import '../styles.css';

/* ═══════════════════════════════════════════════════════
   4-TAB NAVIGATION: Home | Menu | Orders | Profile
   ═══════════════════════════════════════════════════════ */
const NAV_TABS = [
  { id: 'home',     label: 'Home',    icon: '🏠' },
  { id: 'menu',     label: 'Menu',    icon: '🍽️' },
  { id: 'tracking', label: 'Orders',  icon: '📦' },
  { id: 'profile',  label: 'Profile', icon: '👤' },
];

const TAB_MAP = {
  home: 'home', menu: 'menu', cart: 'menu',
  tracking: 'tracking', profile: 'profile',
};

function StudentDashboard({ auth, onLogout }) {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(MOCK_PAST_ORDERS);
  const [toast, setToast] = useState('');
  const [detailItem, setDetailItem] = useState(null);
  const [menuVendor, setMenuVendor] = useState('all');

  /* ── Simulated live kitchen loads ── */
  const [kitchenLoads, setKitchenLoads] = useState(
    Object.fromEntries(VENDORS.map(v => [v.id, v.kitchenLoad]))
  );

  useEffect(() => {
    const tick = setInterval(() => {
      setKitchenLoads(prev => {
        const next = { ...prev };
        VENDORS.forEach(v => {
          const delta = Math.floor(Math.random() * 5) - 2;
          next[v.id] = Math.max(15, Math.min(97, prev[v.id] + delta));
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(tick);
  }, []);

  /* ── Poll for order updates from Vendor ── */
  useEffect(() => {
    if (!currentOrder) return;
    const poll = setInterval(() => {
      const shared = JSON.parse(localStorage.getItem('optimeal_shared_orders') || '[]');
      const updated = shared.find(o => o.id === currentOrder.id);
      if (updated && updated.status !== currentOrder.status) {
        setCurrentOrder(updated);
        if (updated.status === 'Ready') {
          showToast(`✅ Your order ${updated.id} is Ready!`);
        }
      }
    }, 1000);
    return () => clearInterval(poll);
  }, [currentOrder]);

  /* ── Cart helpers ── */
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const exists = prev.find(c => c.item.id === item.id);
      return exists
        ? prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { item, qty: 1 }];
    });
    showToast(`✓ ${item.name} added`);
  }, []);

  const updateQty = useCallback((itemId, delta) => {
    setCart(prev =>
      prev.map(c => c.item.id === itemId ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
          .filter(c => c.qty > 0)
    );
  }, []);

  const clearCart = () => setCart([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  /* ── Place order ── */
  const placeOrder = ({ timeSlot, express, readyTime, confidence, kitchenLoad }) => {
    const order = {
      id: `#OM-${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: cart.map(({ item, qty }) => ({ name: item.name, qty, price: item.price, emoji: item.emoji })),
      total: cartTotal + (express ? 10 : 0),
      status: 'Pending',
      pickupSlot: timeSlot,
      counter: Math.ceil(Math.random() * 3),
      express,
      readyTime,
      confidence,
      kitchenLoad: kitchenLoad || 60,
    };
    
    // Sync to localStorage for Vendor dashboard
    const existing = JSON.parse(localStorage.getItem('optimeal_shared_orders') || '[]');
    localStorage.setItem('optimeal_shared_orders', JSON.stringify([...existing, order]));

    setCurrentOrder(order);
    setOrderHistory(prev => [order, ...prev]);
    clearCart();
    navigate('tracking');
  };

  /* ── Navigation ── */
  const navigate = (v) => { setDetailItem(null); setView(v); };
  const navigateToVendor = (vendorId) => { setMenuVendor(vendorId); navigate('menu'); };
  const activeTab = TAB_MAP[view] || 'home';

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <StudentHome auth={auth} onNavigate={navigate} onNavigateToVendor={navigateToVendor} onAddToCart={addToCart} currentOrder={currentOrder} kitchenLoads={kitchenLoads} />;
      case 'menu':
        return <StudentMenu cart={cart} onNavigate={navigate} onAddToCart={addToCart} updateQty={updateQty} onOpenItem={(item) => setDetailItem(item)} initialVendor={menuVendor} onClearVendorFilter={() => setMenuVendor('all')} kitchenLoads={kitchenLoads} />;
      case 'cart':
        return <StudentCart cart={cart} cartTotal={cartTotal} updateQty={updateQty} clearCart={clearCart} onPlaceOrder={placeOrder} onNavigate={navigate} kitchenLoads={kitchenLoads} />;
      case 'tracking':
        return <StudentTracking order={currentOrder} onNavigate={navigate} />;
      case 'profile':
        return <StudentProfile auth={auth} onLogout={onLogout} orderHistory={orderHistory} onNavigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="student-app">

      {/* ── Top Bar ── */}
      <header className="student-topbar">
        <div className="student-topbar-inner">
          <button
            className="student-topbar-brand"
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit' }}
          >
            <span>⏱️</span>
            <span className="student-topbar-name">Opti<span>Meal</span></span>
          </button>

          <div className="student-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button className="student-cart-btn" onClick={() => navigate('cart')} id="cart-icon-btn" title="View cart">
              🛒
              {cartCount > 0 && <span className="student-cart-badge">{cartCount}</span>}
            </button>
            <button
              onClick={onLogout}
              id="topbar-logout-btn"
              title="Logout"
              style={{
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.7rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.20)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
            >
              ↩ Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="student-content" style={{ paddingBottom: '90px' }}>{renderContent()}</main>

      {/* ── Item detail overlay ── */}
      {detailItem && (
        <StudentItemDetail
          item={detailItem} onClose={() => setDetailItem(null)} onAddToCart={addToCart}
          isFavorite={false} onToggleFavorite={() => {}}
        />
      )}

      {/* ── Toast ── */}
      {toast && <div className="student-toast">{toast}</div>}

      {/* ── Bottom Nav — 4 tabs only ── */}
      <nav className="student-bottom-nav" role="navigation" aria-label="Main navigation">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            className={`bottom-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => navigate(tab.id)}
            id={`nav-${tab.id}`}
          >
            <span className="bottom-tab-icon">
              {tab.icon}
            </span>
            <span className="bottom-tab-label">{tab.label}</span>
            {tab.id === 'tracking' && currentOrder && (
              <span style={{
                position: 'absolute', top: 6, right: '50%', transform: 'translateX(150%)',
                background: 'var(--green)', width: 8, height: 8, borderRadius: '50%',
                animation: 'pulse-live 1.5s ease-in-out infinite',
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default StudentDashboard;
