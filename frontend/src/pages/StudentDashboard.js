import React, { useState, useCallback } from 'react';

import StudentHome         from './student/StudentHome';
import StudentMenu         from './student/StudentMenu';
import StudentCart         from './student/StudentCart';
import StudentTracking     from './student/StudentTracking';
import StudentHistory      from './student/StudentHistory';
import StudentProfile      from './student/StudentProfile';
import StudentItemDetail   from './student/StudentItemDetail';
import StudentNotifications from './student/StudentNotifications';
import StudentReviews      from './student/StudentReviews';
import StudentFavorites    from './student/StudentFavorites';
import StudentQueue        from './student/StudentQueue';
import StudentOffers       from './student/StudentOffers';
import StudentInsights     from './student/StudentInsights';
import StudentAIRecommend  from './student/StudentAIRecommend';
import StudentComplaint    from './student/StudentComplaint';

import { MOCK_PAST_ORDERS, MENU_ITEMS, DEFAULT_FAVORITES, MOCK_NOTIFICATIONS } from './student/data';
import '../styles.css';

/* ── Bottom nav tabs ── */
const NAV_TABS = [
  { id: 'home',    label: 'Home',   icon: '🏠' },
  { id: 'menu',    label: 'Menu',   icon: '🍽️' },
  { id: 'queue',   label: 'Queue',  icon: '🧠' },
  { id: 'history', label: 'Orders', icon: '📋' },
  { id: 'more',    label: 'More',   icon: '◼◼◼' },
];

/* ── "More" drawer items ── */
const MORE_ITEMS = [
  { id: 'profile',      icon: '👤', label: 'Profile'          },
  { id: 'notifications',icon: '🔔', label: 'Notifications'    },
  { id: 'favorites',    icon: '❤️', label: 'Favorites'        },
  { id: 'ai',           icon: '🤖', label: 'AI Picks'         },
  { id: 'offers',       icon: '🎁', label: 'Offers & Deals'   },
  { id: 'insights',     icon: '📊', label: 'My Insights'      },
  { id: 'reviews',      icon: '⭐', label: 'Reviews'          },
  { id: 'complaint',    icon: '💬', label: 'Help & Support'   },
];

/* ── Views that map to a bottom tab highlight ── */
const TAB_VIEW_MAP = {
  home: 'home', menu: 'menu', queue: 'queue',
  cart: 'menu',
  history: 'history', tracking: 'history',
  profile: 'more', notifications: 'more', favorites: 'more',
  ai: 'more', offers: 'more', insights: 'more', reviews: 'more', complaint: 'more',
};

/**
 * StudentDashboard — OptiMeal Student App Shell (v2)
 * --------------------------------------------------
 * Full 15-page system with all state managed here.
 */
function StudentDashboard({ auth, onLogout }) {
  const [view,          setView]          = useState('home');
  const [cart,          setCart]          = useState([]);
  const [currentOrder,  setCurrentOrder]  = useState(null);
  const [orderHistory,  setOrderHistory]  = useState(MOCK_PAST_ORDERS);
  const [toast,         setToast]         = useState('');
  const [favorites,     setFavorites]     = useState(DEFAULT_FAVORITES);
  const [showMore,      setShowMore]      = useState(false);
  const [detailItem,    setDetailItem]    = useState(null);
  const [menuVendor,    setMenuVendor]    = useState('all');   // ← pre-selected vendor for menu
  const [unreadCount,   setUnreadCount]   = useState(
    MOCK_NOTIFICATIONS.filter(n => !n.read).length
  );

  /* ── Cart helpers ── */
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const exists = prev.find(c => c.item.id === item.id);
      return exists
        ? prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { item, qty: 1 }];
    });
    showToast(`✓ ${item.name} added to cart`);
  }, []);

  const updateQty = useCallback((itemId, delta) => {
    setCart(prev =>
      prev
        .map(c => c.item.id === itemId ? { ...c, qty: Math.max(0, c.qty + delta) } : c)
        .filter(c => c.qty > 0)
    );
  }, []);

  const clearCart = () => setCart([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  /* ── Place order ── */
  const placeOrder = ({ timeSlot, express }) => {
    const order = {
      id: `#OM-${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      items: cart.map(({ item, qty }) => ({
        name: item.name, qty, price: item.price, emoji: item.emoji,
      })),
      total: cartTotal + (express ? 10 : 0),
      status: 'Pending',
      pickupSlot: timeSlot,
      counter: Math.ceil(Math.random() * 3),
      express,
    };
    setCurrentOrder(order);
    setOrderHistory(prev => [order, ...prev]);
    clearCart();
    navigate('tracking');
  };

  /* ── Reorder ── */
  const reorder = (order) => {
    order.items.forEach(({ name, qty }) => {
      const item = MENU_ITEMS.find(m => m.name === name);
      if (item) {
        for (let i = 0; i < qty; i++) addToCart(item);
      }
    });
    navigate('cart');
  };

  /* ── Favorites ── */
  const toggleFavorite = useCallback((itemId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        showToast('Removed from favorites');
      } else {
        next.add(itemId);
        showToast('❤️ Added to favorites');
      }
      return next;
    });
  }, []);

  /* ── Navigation ── */
  const navigate = (v) => {
    setDetailItem(null);
    setShowMore(false);
    setView(v);
  };

  /* ── Navigate to menu filtered by a specific vendor ── */
  const navigateToVendor = (vendorId) => {
    setMenuVendor(vendorId);
    navigate('menu');
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'more') {
      setShowMore(s => !s);
    } else {
      setShowMore(false);
      navigate(tabId);
    }
  };

  /* ── Item detail ── */
  const openItem = (item) => setDetailItem(item);
  const closeItem = () => setDetailItem(null);

  /* ── Active tab ── */
  const activeTab = TAB_VIEW_MAP[view] || 'home';

  /* ── Render page ── */
  const renderContent = () => {
    switch (view) {
      case 'home':
        return <StudentHome auth={auth} onNavigate={navigate} onNavigateToVendor={navigateToVendor} onAddToCart={addToCart} cartCount={cartCount} />;
      case 'menu':
        return <StudentMenu cart={cart} onNavigate={navigate} onAddToCart={addToCart} updateQty={updateQty}
                  favorites={favorites} onToggleFavorite={toggleFavorite} onOpenItem={openItem}
                  initialVendor={menuVendor} onClearVendorFilter={() => setMenuVendor('all')} />;
      case 'cart':
        return <StudentCart cart={cart} cartTotal={cartTotal} updateQty={updateQty} clearCart={clearCart}
                  onPlaceOrder={placeOrder} onNavigate={navigate} />;
      case 'tracking':
        return <StudentTracking order={currentOrder} onNavigate={navigate} />;
      case 'history':
        return <StudentHistory orders={orderHistory} onReorder={reorder} onNavigate={navigate} />;
      case 'profile':
        return <StudentProfile auth={auth} onLogout={onLogout} orderHistory={orderHistory} onNavigate={navigate} />;
      case 'notifications':
        return <StudentNotifications onNavigate={navigate} />;
      case 'reviews':
        return <StudentReviews onNavigate={navigate} />;
      case 'favorites':
        return <StudentFavorites favorites={favorites} onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite} onNavigate={navigate} onOpenItem={openItem} />;
      case 'queue':
        return <StudentQueue onNavigate={navigate} onNavigateToVendor={navigateToVendor} />;
      case 'offers':
        return <StudentOffers onAddToCart={addToCart} onNavigate={navigate} />;
      case 'insights':
        return <StudentInsights orderHistory={orderHistory} onNavigate={navigate} />;
      case 'ai':
        return <StudentAIRecommend onAddToCart={addToCart} favorites={favorites} onNavigate={navigate} />;
      case 'complaint':
        return <StudentComplaint onNavigate={navigate} />;
      default:
        return null;
    }
  };

  return (
    <div className="student-app">

      {/* ── Top bar ── */}
      <header className="student-topbar">
        <div className="student-topbar-inner">
          <button
            className="student-topbar-brand"
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit' }}
            title="Go to Home"
          >
            <span>🍽️</span>
            <span className="student-topbar-name">
              Opti<span>Meal</span>
            </span>
            <span className="navbar-saas-label">SaaS</span>
          </button>

          <div className="student-topbar-actions">
            {/* Notifications bell */}
            <button
              className="student-cart-btn"
              onClick={() => navigate('notifications')}
              id="notif-btn"
              title="Notifications"
              style={{ marginRight: '0.35rem' }}
            >
              🔔
              {unreadCount > 0 && (
                <span className="student-cart-badge" style={{ background: 'var(--yellow)', color: '#000' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Cart */}
            <button
              className="student-cart-btn"
              onClick={() => navigate('cart')}
              id="cart-icon-btn"
              title="View cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="student-cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <main className="student-content">
        {renderContent()}
      </main>

      {/* ── Item Detail Overlay ── */}
      {detailItem && (
        <StudentItemDetail
          item={detailItem}
          onClose={closeItem}
          onAddToCart={addToCart}
          isFavorite={favorites.has(detailItem.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* ── More Drawer ── */}
      {showMore && (
        <div
          className="more-drawer-overlay"
          onClick={() => setShowMore(false)}
        >
          <div className="more-drawer" onClick={e => e.stopPropagation()}>
            <div className="more-drawer-handle" />
            <div className="more-drawer-grid">
              {MORE_ITEMS.map(item => (
                <button
                  key={item.id}
                  className="more-drawer-item"
                  onClick={() => { navigate(item.id); }}
                  id={`more-${item.id}`}
                >
                  <span className="more-drawer-item-icon">{item.icon}</span>
                  <span className="more-drawer-item-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && <div className="student-toast">{toast}</div>}

      {/* ── Bottom tab bar ── */}
      <nav className="student-bottom-nav" role="navigation" aria-label="Main navigation">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            className={`bottom-tab ${activeTab === tab.id || (tab.id === 'more' && showMore) ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            id={`nav-${tab.id}`}
          >
            <span className="bottom-tab-icon">
              {tab.id === 'more' ? (
                <span style={{ display: 'inline-flex', gap: '2px', transform: 'scale(0.55)', color: 'currentColor' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                </span>
              ) : tab.icon}
            </span>
            <span className="bottom-tab-label">{tab.label}</span>

            {/* Cart count badge on Menu tab */}
            {tab.id === 'menu' && cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: '50%', transform: 'translateX(180%)',
                background: 'var(--accent)', color: 'var(--bg)',
                width: 16, height: 16, borderRadius: '50%',
                fontSize: '0.6rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount > 9 ? '9+' : cartCount}</span>
            )}

            {/* Unread badge on More tab */}
            {tab.id === 'more' && unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: '50%', transform: 'translateX(80%)',
                background: 'var(--yellow)', color: '#000',
                width: 16, height: 16, borderRadius: '50%',
                fontSize: '0.6rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default StudentDashboard;
