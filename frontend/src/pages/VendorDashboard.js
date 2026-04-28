import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import VendorOverview from './vendor/VendorOverview';
import VendorOrders from './vendor/VendorOrders';
import VendorIntelligence from './vendor/VendorIntelligence';
import VendorAlerts from './vendor/VendorAlerts';
import VendorSettings from './vendor/VendorSettings';

// --- Shared Mock Data ---
const MOCK_FAST_ORDERS = [
  { id: '#OM-442', item: 'Masala Tea', qty: 3, timeWaiting: '1m', status: 'pending', emoji: '🍵' },
  { id: '#OM-445', item: 'Samosa', qty: 5, timeWaiting: '0m', status: 'pending', emoji: '🥟' },
  { id: '#OM-448', item: 'Sweet Lime', qty: 1, timeWaiting: '2m', status: 'preparing', emoji: '🍋' },
];

const MOCK_HEAVY_ORDERS = [
  { id: '#OM-440', item: 'Chole Bhature', qty: 2, timeWaiting: '6m', status: 'preparing', emoji: '🫓' },
  { id: '#OM-441', item: 'Pav Bhaji', qty: 1, timeWaiting: '4m', status: 'preparing', emoji: '🥘' },
  { id: '#OM-447', item: 'Dal Rice', qty: 3, timeWaiting: '2m', status: 'pending', emoji: '🍛' },
];

const MOMENTUM = [
  { item: 'Samosa', trend: 'up', emoji: '📈', color: 'var(--yellow)' },
  { item: 'Masala Tea', trend: 'stable', emoji: '➡️', color: 'var(--text-muted)' },
  { item: 'Pav Bhaji', trend: 'down', emoji: '📉', color: 'var(--green)' },
];

const ALERTS = [
  { id: 1, type: 'trigger', icon: '🔔', title: 'Start preparing Samosa now', desc: 'Peak expected in 8 minutes (15+ orders)' },
  { id: 2, type: 'delay', icon: '⚠️', title: 'Delay risk in 5 minutes', desc: 'Heavy lane is backing up. Focus on Chole Bhature.' },
  { id: 3, type: 'smoothing', icon: '🔄', title: 'Workload Smoothed', desc: 'Auto-moved 4 incoming orders from 12:30 to 12:40 slot to prevent overload.' },
];

const NAV_LINKS = [
  { path: 'overview', icon: '📊', label: 'Dashboard' },
  { path: 'orders', icon: '📦', label: 'Orders' },
  { path: 'intelligence', icon: '🧠', label: 'Kitchen Intelligence' },
  { path: 'alerts', icon: '🔔', label: 'Alerts & Insights' },
  { path: 'settings', icon: '⚙️', label: 'Settings' },
];

function VendorDashboard({ auth, onLogout }) {
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [activeFast, setActiveFast] = useState(MOCK_FAST_ORDERS);
  const [activeHeavy, setActiveHeavy] = useState(MOCK_HEAVY_ORDERS);
  const [alerts, setAlerts] = useState(ALERTS);
  const [currentPace, setCurrentPace] = useState(5);
  const [recommendedPace, setRecommendedPace] = useState(7);
  
  const location = useLocation();

  const activeCount = activeFast.length + activeHeavy.length;
  const maxCapacity = 15;
  const computedLoad = Math.min(100, Math.round((activeCount / maxCapacity) * 100));
  
  let queueLevel = 'Low';
  if (activeCount >= 10) queueLevel = 'High';
  else if (activeCount >= 5) queueLevel = 'Medium';

  const [kitchenLoad, setKitchenLoad] = useState(computedLoad);

  // Sync with Student orders from localStorage
  useEffect(() => {
    const poll = setInterval(() => {
      const shared = JSON.parse(localStorage.getItem('optimeal_shared_orders') || '[]');
      
      // We only care about orders that aren't already processed out
      shared.forEach(sharedOrder => {
        // Simple heuristic: if it has > 2 items or has a heavy item, it's heavy
        const isHeavy = sharedOrder.items.length > 2 || sharedOrder.items.some(i => ['Chole Bhature', 'Pav Bhaji', 'Dal Rice', 'Burger'].includes(i.name));
        
        // Convert to vendor format
        const vendorFmt = {
          id: sharedOrder.id,
          item: sharedOrder.items.map(i => i.name).join(' + '),
          qty: sharedOrder.items.reduce((sum, i) => sum + i.qty, 0),
          timeWaiting: 'Just now',
          status: sharedOrder.status.toLowerCase(),
          emoji: sharedOrder.items[0]?.emoji || '📦'
        };

        // Check if we already have it in either list
        setActiveFast(prev => {
          if (!isHeavy && !prev.find(o => o.id === vendorFmt.id)) return [...prev, vendorFmt];
          return prev;
        });
        setActiveHeavy(prev => {
          if (isHeavy && !prev.find(o => o.id === vendorFmt.id)) return [...prev, vendorFmt];
          return prev;
        });
      });
    }, 1000);
    return () => clearInterval(poll);
  }, []);

  // Update load based on active orders, but still allow recovery mode to override
  useEffect(() => {
    if (!recoveryMode) {
      setKitchenLoad(computedLoad);
    } else {
      setKitchenLoad(prev => Math.max(40, prev - 2));
    }
  }, [computedLoad, recoveryMode]);

  useEffect(() => {
    const pTick = setInterval(() => {
      setCurrentPace(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(3, Math.min(10, prev + delta));
      });
    }, 6000);
    return () => clearInterval(pTick);
  }, []);

  const advanceOrder = (lane, id) => {
    const updateFn = prev => {
      const order = prev.find(o => o.id === id);
      if (!order) return prev;
      
      let nextStatus = '';
      if (order.status === 'pending') nextStatus = 'preparing';
      else if (order.status === 'preparing') nextStatus = 'ready';
      else if (order.status === 'ready') nextStatus = 'completed';
      
      // Sync back to localStorage for student
      const shared = JSON.parse(localStorage.getItem('optimeal_shared_orders') || '[]');
      const updatedShared = shared.map(s => {
        if (s.id === id) {
           return { ...s, status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) };
        }
        return s;
      });
      localStorage.setItem('optimeal_shared_orders', JSON.stringify(updatedShared));

      if (nextStatus === 'completed') return prev.filter(o => o.id !== id);
      return prev.map(o => o.id === id ? { ...o, status: nextStatus } : o);
    };
    
    if (lane === 'fast') setActiveFast(updateFn);
    else setActiveHeavy(updateFn);
  };

  const toggleRecovery = () => {
    setRecoveryMode(!recoveryMode);
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const pendingCount = activeFast.filter(o => o.status === 'pending').length + activeHeavy.filter(o => o.status === 'pending').length;
  const preparingCount = activeFast.filter(o => o.status === 'preparing').length + activeHeavy.filter(o => o.status === 'preparing').length;

  const sharedProps = {
    kitchenLoad, queueLevel, recoveryMode, toggleRecovery,
    currentPace, recommendedPace,
    activeFast, activeHeavy, advanceOrder,
    alerts, dismissAlert, momentum: MOMENTUM,
    pendingCount, preparingCount, activeCount
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <Navbar userName={auth.userName} role={auth.role} onLogout={onLogout} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ width: '250px', background: '#0b101e', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            Smart Kitchen
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {NAV_LINKS.map(link => {
              const isActive = location.pathname.includes(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)', textDecoration: 'none',
                    fontWeight: isActive ? 700 : 600,
                    background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<VendorOverview {...sharedProps} />} />
            <Route path="orders" element={<VendorOrders {...sharedProps} />} />
            <Route path="intelligence" element={<VendorIntelligence {...sharedProps} />} />
            <Route path="alerts" element={<VendorAlerts {...sharedProps} />} />
            <Route path="settings" element={<VendorSettings {...sharedProps} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;
