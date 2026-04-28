/* ─────────────────────────────────────────────────────────────────
   adminData.js  ·  OptiMeal Admin Panel – all mock data
   ───────────────────────────────────────────────────────────────── */

export const ADMIN_COLLEGES = [
  { id: 'c1', name: 'IIT Bombay',         plan: 'Premium',  status: 'Active',   students: 4800, orders: 520, revenue: 52000, joined: 'Jan 2025', growth: +18, churnRisk: 'Low',    lastActive: '2 min ago'  },
  { id: 'c2', name: 'BITS Pilani',         plan: 'Standard', status: 'Active',   students: 3200, orders: 310, revenue: 31000, joined: 'Feb 2025', growth: +12, churnRisk: 'Low',    lastActive: '5 min ago'  },
  { id: 'c3', name: 'Delhi University',    plan: 'Premium',  status: 'Active',   students: 6100, orders: 480, revenue: 48000, joined: 'Jan 2025', growth: +7,  churnRisk: 'Medium', lastActive: '15 min ago' },
  { id: 'c4', name: 'VIT Vellore',         plan: 'Standard', status: 'Active',   students: 2900, orders: 290, revenue: 29000, joined: 'Mar 2025', growth: -3,  churnRisk: 'Medium', lastActive: '1 hr ago'   },
  { id: 'c5', name: 'Manipal University',  plan: 'Basic',    status: 'Active',   students: 1800, orders: 120, revenue: 12000, joined: 'Apr 2025', growth: -40, churnRisk: 'High',   lastActive: '3 hrs ago'  },
  { id: 'c6', name: 'NIT Trichy',          plan: 'Standard', status: 'Active',   students: 2200, orders: 185, revenue: 18500, joined: 'Feb 2025', growth: +5,  churnRisk: 'Low',    lastActive: '20 min ago' },
  { id: 'c7', name: 'Amity University',    plan: 'Basic',    status: 'Inactive', students: 1400, orders: 0,   revenue: 0,     joined: 'Mar 2025', growth: -100,churnRisk: 'High',   lastActive: '4 days ago' },
  { id: 'c8', name: 'SRM University',      plan: 'Premium',  status: 'Active',   students: 5100, orders: 420, revenue: 42000, joined: 'Jan 2025', growth: +14, churnRisk: 'Low',    lastActive: '8 min ago'  },
];

export const ADMIN_VENDORS = [
  { id: 'v1', name: 'Main Canteen',    college: 'IIT Bombay',        collegeId:'c1', status: 'Active',   rating: 4.5, orders: 180, complaints: 2,  revenue: 18000, joined: 'Jan 2025' },
  { id: 'v2', name: 'Campus Café',     college: 'IIT Bombay',        collegeId:'c1', status: 'Active',   rating: 4.8, orders: 210, complaints: 0,  revenue: 21000, joined: 'Jan 2025' },
  { id: 'v3', name: 'Juice Center',    college: 'BITS Pilani',       collegeId:'c2', status: 'Active',   rating: 4.6, orders: 130, complaints: 1,  revenue: 13000, joined: 'Feb 2025' },
  { id: 'v4', name: 'Spice Route',     college: 'BITS Pilani',       collegeId:'c2', status: 'Active',   rating: 4.3, orders: 95,  complaints: 4,  revenue: 9500,  joined: 'Feb 2025' },
  { id: 'v5', name: 'Green Bowl',      college: 'Delhi University',  collegeId:'c3', status: 'Active',   rating: 4.2, orders: 160, complaints: 5,  revenue: 16000, joined: 'Jan 2025' },
  { id: 'v6', name: 'Quick Bites',     college: 'Delhi University',  collegeId:'c3', status: 'Warning',  rating: 3.1, orders: 80,  complaints: 14, revenue: 8000,  joined: 'Mar 2025' },
  { id: 'v7', name: 'The Food Court',  college: 'VIT Vellore',       collegeId:'c4', status: 'Active',   rating: 4.0, orders: 110, complaints: 3,  revenue: 11000, joined: 'Mar 2025' },
  { id: 'v8', name: 'Sunrise Tiffin', college: 'Manipal University', collegeId:'c5', status: 'Inactive', rating: 2.8, orders: 0,   complaints: 8,  revenue: 0,     joined: 'Apr 2025' },
  { id: 'v9', name: 'Campus Dhaba',   college: 'NIT Trichy',         collegeId:'c6', status: 'Active',   rating: 4.4, orders: 120, complaints: 1,  revenue: 12000, joined: 'Feb 2025' },
  { id:'v10', name: 'Meal Express',   college: 'SRM University',     collegeId:'c8', status: 'Active',   rating: 4.7, orders: 195, complaints: 1,  revenue: 19500, joined: 'Jan 2025' },
];

export const ADMIN_USERS = [
  { id: 'u1',  name: 'Arjun Mehta',    role: 'student', college: 'IIT Bombay',       status: 'Active',   orders: 22, joined: 'Jan 2025', lastSeen: '2 min ago'  },
  { id: 'u2',  name: 'Priya Sharma',   role: 'student', college: 'IIT Bombay',       status: 'Active',   orders: 18, joined: 'Feb 2025', lastSeen: '5 min ago'  },
  { id: 'u3',  name: 'Dev Kumar',      role: 'vendorr', college: 'BITS Pilani',       status: 'Active',   orders: 0,  joined: 'Feb 2025', lastSeen: '1 hr ago'   },
  { id: 'u4',  name: 'Sneha Rao',      role: 'student', college: 'Delhi University', status: 'Blocked',  orders: 45, joined: 'Jan 2025', lastSeen: '2 days ago' },
  { id: 'u5',  name: 'Rahul Singh',    role: 'student', college: 'BITS Pilani',       status: 'Active',   orders: 12, joined: 'Mar 2025', lastSeen: '30 min ago' },
  { id: 'u6',  name: 'Aisha Khan',     role: 'student', college: 'VIT Vellore',       status: 'Active',   orders: 9,  joined: 'Mar 2025', lastSeen: '10 min ago' },
  { id: 'u7',  name: 'Ravi Patel',     role: 'vendor',  college: 'SRM University',   status: 'Active',   orders: 0,  joined: 'Jan 2025', lastSeen: '4 min ago'  },
  { id: 'u8',  name: 'Meera Joshi',    role: 'student', college: 'SRM University',   status: 'Active',   orders: 29, joined: 'Jan 2025', lastSeen: '1 min ago'  },
  { id: 'u9',  name: 'Kiran Nair',     role: 'student', college: 'NIT Trichy',        status: 'Active',   orders: 16, joined: 'Feb 2025', lastSeen: '20 min ago' },
  { id:'u10',  name: 'Anjali Gupta',   role: 'student', college: 'Manipal University',status: 'Inactive', orders: 2,  joined: 'Apr 2025', lastSeen: '5 days ago' },
];

export const ADMIN_ORDERS = [
  { id: '#OM-201', college: 'IIT Bombay',       vendor: 'Campus Café',    items: 3, total: 125, status: 'Completed', time: '12:45 PM', date: 'Today'     },
  { id: '#OM-200', college: 'SRM University',    vendor: 'Meal Express',   items: 2, total: 90,  status: 'Completed', time: '12:43 PM', date: 'Today'     },
  { id: '#OM-199', college: 'BITS Pilani',        vendor: 'Juice Center',   items: 1, total: 30,  status: 'Preparing', time: '12:40 PM', date: 'Today'     },
  { id: '#OM-198', college: 'Delhi University',  vendor: 'Green Bowl',     items: 4, total: 180, status: 'Preparing', time: '12:38 PM', date: 'Today'     },
  { id: '#OM-197', college: 'NIT Trichy',         vendor: 'Campus Dhaba',   items: 2, total: 70,  status: 'Pending',   time: '12:36 PM', date: 'Today'     },
  { id: '#OM-196', college: 'IIT Bombay',       vendor: 'Main Canteen',   items: 3, total: 95,  status: 'Completed', time: '12:30 PM', date: 'Today'     },
  { id: '#OM-195', college: 'VIT Vellore',        vendor: 'The Food Court', items: 5, total: 230, status: 'Completed', time: '12:28 PM', date: 'Today'     },
  { id: '#OM-194', college: 'SRM University',    vendor: 'Meal Express',   items: 2, total: 80,  status: 'Completed', time: '12:20 PM', date: 'Today'     },
  { id: '#OM-193', college: 'IIT Bombay',       vendor: 'Campus Café',    items: 1, total: 55,  status: 'Cancelled', time: '12:15 PM', date: 'Today'     },
  { id: '#OM-192', college: 'BITS Pilani',        vendor: 'Spice Route',    items: 3, total: 115, status: 'Completed', time: '11:55 AM', date: 'Today'     },
];

export const SUBSCRIPTION_PLANS = [
  { id: 'basic',    name: 'Basic',    price: 499,  colleges: 2, features: ['Up to 2 vendors','Order tracking','Basic analytics']         },
  { id: 'standard', name: 'Standard', price: 999,  colleges: 4, features: ['Up to 5 vendors','AI recommendations','Priority support']    },
  { id: 'premium',  name: 'Premium',  price: 1999, colleges: 2, features: ['Unlimited vendors','Full AI suite','Custom integrations','Dedicated support'] },
];

export const REVENUE_MONTHLY = [
  { month: 'Nov', revenue: 38000, colleges: 5 },
  { month: 'Dec', revenue: 45000, colleges: 5 },
  { month: 'Jan', revenue: 58000, colleges: 7 },
  { month: 'Feb', revenue: 63000, colleges: 7 },
  { month: 'Mar', revenue: 71000, colleges: 8 },
  { month: 'Apr', revenue: 78000, colleges: 8 },
];

export const HOURLY_ORDERS = [
  { hour: '8AM',  orders: 45  },
  { hour: '9AM',  orders: 120 },
  { hour: '10AM', orders: 88  },
  { hour: '11AM', orders: 210 },
  { hour: '12PM', orders: 520 },
  { hour: '1PM',  orders: 480 },
  { hour: '2PM',  orders: 310 },
  { hour: '3PM',  orders: 175 },
  { hour: '4PM',  orders: 95  },
  { hour: '5PM',  orders: 60  },
];

export const SMART_ALERTS = [
  { id: 'a1', type: 'danger',  icon: '🚨', title: 'Critical Delay Spike',    body: 'Delhi University (Green Bowl) wait times exceeded 25 mins. Recovery mode active.', time: '2 min ago' },
  { id: 'a2', type: 'warning', icon: '⚠️', title: 'Kitchen Overload',         body: 'Campus Café hitting 95% load capacity consistently this hour.',  time: '15 min ago'   },
  { id: 'a3', type: 'warning', icon: '📉', title: 'Low Throughput',       body: 'Amity University has processed 0 orders during peak lunch hour. Investigate.',       time: '1 hr ago'  },
  { id: 'a4', type: 'info',    icon: '📈', title: 'Optimization Milestone',   body: 'Platform-wide wait times reduced by 14% using Workload Smoothing today.',                  time: '5 hrs ago'  },
  { id: 'a5', type: 'info',    icon: '💰', title: 'Revenue Target',     body: 'Platform hit ₹78,000 MRR — 8% above April forecast.',                       time: '6 hrs ago'  },
];

export const PLATFORM_SUMMARY = {
  totalColleges:    8,
  activeColleges:   7,
  totalVendors:     10,
  activeVendors:    8,
  totalStudents:    27500,
  totalOrdersToday: 2285,
  activeOrders:     3,
  completedToday:   2279,
  totalRevenueMRR:  78000,
  monthlyGrowth:    9.8,
  newCollegesMonth: 1,
  avgRating:        4.2,
  totalComplaints:  38,
  forecastNextMonth:87000,
  peakHour:         '12 PM – 1 PM',
  mostActiveCollege:'IIT Bombay',
  leastActiveCollege:'Amity University',
  qrOrderingUsage:  68,
  aiFeatureUsage:   45,
};
