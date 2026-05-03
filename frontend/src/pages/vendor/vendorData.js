// Vendor Mock Data
export const INITIAL_ORDERS = [
  { id: '#101', items: '2 Samosa, 1 Tea', pickup: '12:30 PM', status: 'Pending', express: false, est: 5 },
  { id: '#102', items: '1 Pav Bhaji', pickup: '12:35 PM', status: 'Accepted', express: true, est: 8 },
  { id: '#103', items: '3 Masala Tea', pickup: '12:40 PM', status: 'Preparing', express: false, est: 4 },
  { id: '#104', items: '1 Cold Coffee, 1 Sandwich', pickup: '12:45 PM', status: 'Ready', express: false, est: 0 },
  { id: '#105', items: '2 Mango Shake', pickup: '12:50 PM', status: 'Pending', express: false, est: 6 },
  { id: '#106', items: '1 Paneer Roll', pickup: '12:55 PM', status: 'Pending', express: true, est: 7 },
];

export const MENU_ITEMS = [
  { id: 'm1', name: 'Samosa', price: 20, category: 'Snack', available: true, stock: 45 },
  { id: 'm2', name: 'Tea', price: 15, category: 'Beverage', available: true, stock: 60 },
  { id: 'm3', name: 'Pav Bhaji', price: 60, category: 'Main', available: true, stock: 20 },
  { id: 'm4', name: 'Cold Coffee', price: 40, category: 'Beverage', available: true, stock: 30 },
  { id: 'm5', name: 'Sandwich', price: 35, category: 'Snack', available: true, stock: 25 },
  { id: 'm6', name: 'Mango Shake', price: 50, category: 'Beverage', available: true, stock: 15 },
  { id: 'm7', name: 'Paneer Roll', price: 55, category: 'Main', available: true, stock: 18 },
  { id: 'm8', name: 'Burger', price: 45, category: 'Snack', available: false, stock: 0 },
];

export const TOP_SELLING = [
  { name: 'Samosa', value: 50, color: '#f59e0b' },
  { name: 'Tea', value: 40, color: '#38bdf8' },
  { name: 'Sandwich', value: 20, color: '#a78bfa' },
  { name: 'Burger', value: 12, color: '#ef4444' },
];

export const ALERTS = [
  { id: 1, text: 'Rush expected in 10 minutes', sub: 'Prepare extra samosa and tea', type: 'warning', time: '2m ago' },
  { id: 2, text: 'High demand for tea', sub: '40 orders today — 25% above average', type: 'info', time: '5m ago' },
  { id: 3, text: 'Platform wait time increased', sub: 'Average wait now 12min, target 8min', type: 'warning', time: '12m ago' },
];

export const STATUS_CONFIG = {
  'Pending':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', button: 'Accept Order',    next: 'Accepted' },
  'Accepted':  { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  button: 'Start Preparing',  next: 'Preparing' },
  'Preparing': { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  button: 'Mark as Ready',    next: 'Ready' },
  'Ready':     { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  button: 'Completed',        next: 'Completed' },
};
