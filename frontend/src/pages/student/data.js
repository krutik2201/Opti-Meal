/* ─────────────────────────────────────────────────────────────────
   data.js  ·  OptiMeal Student App – all mock data (v2 – complete)
   ───────────────────────────────────────────────────────────────── */

export const VENDORS = [
  { id: 'canteen', name: 'Main Canteen',  emoji: '🍛', location: 'Block A – Ground Floor', wait: 12, rush: 'High',   open: true,  kitchenLoad: 82, batchGroup: 'meals'  },
  { id: 'cafe',    name: 'Campus Café',   emoji: '☕', location: 'Library Wing',           wait: 5,  rush: 'Low',    open: true,  kitchenLoad: 35, batchGroup: 'drinks' },
  { id: 'juice',   name: 'Juice Center',  emoji: '🥤', location: 'Main Gate',              wait: 8,  rush: 'Medium', open: true,  kitchenLoad: 58, batchGroup: 'drinks' },
  { id: 'snacks',  name: 'Spice Route',   emoji: '🌮', location: 'Block B – Ground Floor', wait: 15, rush: 'High',   open: true,  kitchenLoad: 91, batchGroup: 'snacks' },
];

export const TIME_SLOTS = [
  { id: 't1', label: '12:30 – 12:40', full: false, capacity: 8,  booked: 6 },
  { id: 't2', label: '12:40 – 12:50', full: false, capacity: 8,  booked: 3 },
  { id: 't3', label: '12:50 – 1:00',  full: true,  capacity: 8,  booked: 8 },
  { id: 't4', label: '1:00 – 1:10',   full: false, capacity: 8,  booked: 2 },
  { id: 't5', label: '1:10 – 1:20',   full: false, capacity: 8,  booked: 1 },
  { id: 't6', label: '1:20 – 1:30',   full: false, capacity: 8,  booked: 0 },
];

/* ── Decision Intelligence ── */
export const DECISION_PRESETS = {
  usual:   { label: 'Your Usual',      emoji: '🔄', items: [6, 1],  reason: 'Ordered 12 times last month'    },
  trending:{ label: 'Most Ordered Now',emoji: '🔥', items: [18, 12], reason: '142 orders in last 2 hours'    },
  fastest: { label: 'Fastest Ready',   emoji: '⚡', items: [6, 13], reason: 'Ready in under 4 minutes'       },
};

export const SESSION_LABELS = {
  morning: { label: '🌅 Morning Menu',  range: 'Best before 11 AM', highlight: ['Breakfast','Drinks']   },
  lunch:   { label: '🍛 Lunch Time',    range: '11 AM – 3 PM',      highlight: ['Meals','Snacks']       },
  evening: { label: '☕ Evening Snacks', range: 'After 3 PM',        highlight: ['Snacks','Drinks']      },
};

export const REORDER_HINT = {
  text:    'You usually order again around this time',
  items:   [6, 1],
  lastAt:  '12:45 PM',
};

export const MENU_ITEMS = [
  /* ── Main Canteen ── */
  { id: 1,  vendorId: 'canteen', vendorName: 'Main Canteen', name: 'Samosa',         price: 20, category: 'Snacks',    veg: true,  rating: 4.5, reviews: 128, available: true,  emoji: '🥟', tags: ['popular','bestseller'], desc: 'Crispy fried pastry with spiced potato filling',       gradient: 'linear-gradient(135deg,#78350f,#92400e)', calories: 150, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['lunch','evening'] },
  { id: 2,  vendorId: 'canteen', vendorName: 'Main Canteen', name: 'Dal Rice',       price: 60, category: 'Meals',     veg: true,  rating: 4.2, reviews: 89,  available: true,  emoji: '🍛', tags: [],                    desc: 'Slow-cooked dal with steamed basmati rice',            gradient: 'linear-gradient(135deg,#1e3a2f,#14532d)', calories: 480, prepTime: '10 min', prepMins: 10, instantReady: false, session: ['lunch'] },
  { id: 3,  vendorId: 'canteen', vendorName: 'Main Canteen', name: 'Paneer Roll',    price: 45, category: 'Snacks',    veg: true,  rating: 4.6, reviews: 203, available: true,  emoji: '🌯', tags: ['popular'],            desc: 'Grilled paneer in tandoor roti with mint chutney',     gradient: 'linear-gradient(135deg,#3b1d1d,#5c1a1a)', calories: 320, prepTime: '8 min',  prepMins: 8,  instantReady: false, session: ['lunch','evening'] },
  { id: 4,  vendorId: 'canteen', vendorName: 'Main Canteen', name: 'Idli Sambar',    price: 30, category: 'Breakfast', veg: true,  rating: 4.3, reviews: 156, available: true,  emoji: '🫓', tags: [],                    desc: 'Soft steamed rice cakes with coconut chutney & sambar', gradient: 'linear-gradient(135deg,#1a2e3b,#164e63)', calories: 220, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['morning'] },
  { id: 5,  vendorId: 'canteen', vendorName: 'Main Canteen', name: 'Rajma Chawal',   price: 65, category: 'Meals',     veg: true,  rating: 4.4, reviews: 74,  available: true,  emoji: '🫘', tags: [],                    desc: 'Rich red kidney bean curry with basmati rice',          gradient: 'linear-gradient(135deg,#2d1b0a,#7c2d12)', calories: 510, prepTime: '12 min', prepMins: 12, instantReady: false, session: ['lunch'] },

  /* ── Campus Café ── */
  { id: 6,  vendorId: 'cafe',    vendorName: 'Campus Café',  name: 'Masala Tea',     price: 15, category: 'Drinks',    veg: true,  rating: 4.7, reviews: 342, available: true,  emoji: '🍵', tags: ['popular','bestseller'], desc: 'Fresh brewed spiced Indian chai – strong and aromatic', gradient: 'linear-gradient(135deg,#292524,#44403c)', calories: 80,  prepTime: '3 min',  prepMins: 3,  instantReady: true,  session: ['morning','lunch','evening'] },
  { id: 7,  vendorId: 'cafe',    vendorName: 'Campus Café',  name: 'Veg Sandwich',   price: 40, category: 'Snacks',    veg: true,  rating: 4.1, reviews: 67,  available: true,  emoji: '🥪', tags: [],                    desc: 'Toasted with cucumber, tomato, cheese and mint mayo',   gradient: 'linear-gradient(135deg,#14532d,#166534)', calories: 280, prepTime: '7 min',  prepMins: 7,  instantReady: false, session: ['morning','lunch'] },
  { id: 8,  vendorId: 'cafe',    vendorName: 'Campus Café',  name: 'Cold Coffee',    price: 55, category: 'Drinks',    veg: true,  rating: 4.8, reviews: 289, available: true,  emoji: '🧋', tags: ['popular'],            desc: 'Blended espresso with chilled milk, ice and syrup',     gradient: 'linear-gradient(135deg,#1e1b4b,#1e3a5f)', calories: 180, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['morning','lunch','evening'] },
  { id: 9,  vendorId: 'cafe',    vendorName: 'Campus Café',  name: 'Blueberry Muffin',price:35, category: 'Bakery',   veg: true,  rating: 4.0, reviews: 44,  available: false, emoji: '🧁', tags: [],                    desc: 'Freshly baked blueberry muffin – sold out by noon',    gradient: 'linear-gradient(135deg,#3b1c5c,#4c1d95)', calories: 350, prepTime: '–',      prepMins: 99, instantReady: false, session: ['morning'] },
  { id: 10, vendorId: 'cafe',    vendorName: 'Campus Café',  name: 'Frankie',        price: 45, category: 'Snacks',    veg: true,  rating: 4.3, reviews: 91,  available: true,  emoji: '🌮', tags: [],                    desc: 'Spiced masala wrap with veggies and mayo',             gradient: 'linear-gradient(135deg,#431407,#9a3412)', calories: 310, prepTime: '8 min',  prepMins: 8,  instantReady: false, session: ['lunch','evening'] },

  /* ── Juice Center ── */
  { id: 11, vendorId: 'juice',   vendorName: 'Juice Center', name: 'Sweet Lime',     price: 30, category: 'Drinks',    veg: true,  rating: 4.6, reviews: 178, available: true,  emoji: '🍋', tags: ['popular'],            desc: 'Fresh squeezed sweet lime with chaat masala',          gradient: 'linear-gradient(135deg,#365314,#3f6212)', calories: 90,  prepTime: '4 min',  prepMins: 4,  instantReady: true,  session: ['morning','lunch','evening'] },
  { id: 12, vendorId: 'juice',   vendorName: 'Juice Center', name: 'Mango Shake',    price: 50, category: 'Drinks',    veg: true,  rating: 4.9, reviews: 401, available: true,  emoji: '🥭', tags: ['bestseller','popular'],desc: 'Thick alphonso mango blended with milk and honey',    gradient: 'linear-gradient(135deg,#78350f,#b45309)', calories: 240, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['lunch','evening'] },
  { id: 13, vendorId: 'juice',   vendorName: 'Juice Center', name: 'Watermelon',     price: 25, category: 'Drinks',    veg: true,  rating: 4.4, reviews: 91,  available: true,  emoji: '🍉', tags: [],                    desc: 'Chilled fresh watermelon with mint and lemon',         gradient: 'linear-gradient(135deg,#15803d,#166534)', calories: 70,  prepTime: '3 min',  prepMins: 3,  instantReady: true,  session: ['morning','lunch','evening'] },
  { id: 14, vendorId: 'juice',   vendorName: 'Juice Center', name: 'Sugarcane Juice',price: 20, category: 'Drinks',    veg: true,  rating: 4.5, reviews: 133, available: true,  emoji: '🌿', tags: [],                    desc: 'Fresh pressed sugarcane with ginger and lemon',        gradient: 'linear-gradient(135deg,#1a3a1a,#14532d)', calories: 110, prepTime: '4 min',  prepMins: 4,  instantReady: true,  session: ['morning','lunch','evening'] },

  /* ── Spice Route ── */
  { id: 15, vendorId: 'snacks',  vendorName: 'Spice Route',  name: 'Pav Bhaji',      price: 50, category: 'Meals',     veg: true,  rating: 4.5, reviews: 213, available: true,  emoji: '🥘', tags: ['popular'],            desc: 'Spiced mashed vegetable curry with buttered pav',      gradient: 'linear-gradient(135deg,#7c2d12,#9a3412)', calories: 420, prepTime: '10 min', prepMins: 10, instantReady: false, session: ['lunch'] },
  { id: 16, vendorId: 'snacks',  vendorName: 'Spice Route',  name: 'Vada Pav',       price: 20, category: 'Snacks',    veg: true,  rating: 4.3, reviews: 167, available: true,  emoji: '🍔', tags: ['bestseller'],         desc: 'Mumbai street food – potato fritter in bread',         gradient: 'linear-gradient(135deg,#292524,#57534e)', calories: 280, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['lunch','evening'] },
  { id: 17, vendorId: 'snacks',  vendorName: 'Spice Route',  name: 'Chole Bhature',  price: 65, category: 'Meals',     veg: true,  rating: 4.6, reviews: 89,  available: true,  emoji: '🫓', tags: [],                    desc: 'Spiced chickpeas with fluffy fried bread',             gradient: 'linear-gradient(135deg,#451a03,#78350f)', calories: 560, prepTime: '12 min', prepMins: 12, instantReady: false, session: ['lunch'] },
  { id: 18, vendorId: 'snacks',  vendorName: 'Spice Route',  name: 'Pani Puri',      price: 30, category: 'Snacks',    veg: true,  rating: 4.8, reviews: 322, available: true,  emoji: '🫙', tags: ['popular','bestseller'],desc: 'Crispy hollow puri with tangy tamarind chutney water',  gradient: 'linear-gradient(135deg,#1a2e3b,#0c4a6e)', calories: 200, prepTime: '5 min',  prepMins: 5,  instantReady: false, session: ['lunch','evening'] },
  { id: 19, vendorId: 'snacks',  vendorName: 'Spice Route',  name: 'Dahi Puri',      price: 35, category: 'Snacks',    veg: true,  rating: 4.4, reviews: 98,  available: true,  emoji: '🍱', tags: [],                    desc: 'Yogurt-filled puri with tamarind and sev',             gradient: 'linear-gradient(135deg,#1e3a5f,#1e40af)', calories: 220, prepTime: '6 min',  prepMins: 6,  instantReady: false, session: ['lunch','evening'] },
];

export const AI_COMBOS = [
  { id: 'c1', items: ['Samosa', 'Masala Tea'],      itemIds: [1, 6],   reason: '🔥 Ordered together 94 times today',     saving: 5,  badge: 'Save ₹5'  },
  { id: 'c2', items: ['Cold Coffee', 'Veg Sandwich'], itemIds: [8, 7], reason: '📈 Trending this week',                  saving: 0,  badge: 'Trending' },
  { id: 'c3', items: ['Mango Shake', 'Pani Puri'],  itemIds: [12, 18], reason: '⭐ Top-rated afternoon combo',            saving: 5,  badge: 'Save ₹5'  },
  { id: 'c4', items: ['Paneer Roll', 'Sweet Lime'], itemIds: [3, 11],  reason: '💪 High protein + hydration',            saving: 0,  badge: 'Healthy'  },
  { id: 'c5', items: ['Idli Sambar', 'Masala Tea'], itemIds: [4, 6],   reason: '🌅 Perfect breakfast combo',             saving: 5,  badge: 'Breakfast' },
];

export const MOCK_PAST_ORDERS = [
  {
    id: '#OM-084',
    date: '17 Apr 2026, 1:15 PM',
    items: [
      { name: 'Samosa',    qty: 2, price: 20, emoji: '🥟' },
      { name: 'Masala Tea',qty: 1, price: 15, emoji: '🍵' },
    ],
    total: 55, status: 'Delivered', pickupSlot: '1:10 – 1:20', counter: 2,
    vendorId: 'canteen',
  },
  {
    id: '#OM-073',
    date: '16 Apr 2026, 12:45 PM',
    items: [
      { name: 'Mango Shake', qty: 1, price: 50, emoji: '🥭' },
      { name: 'Pav Bhaji',   qty: 1, price: 50, emoji: '🥘' },
    ],
    total: 100, status: 'Delivered', pickupSlot: '12:40 – 12:50', counter: 1,
    vendorId: 'juice',
  },
  {
    id: '#OM-061',
    date: '15 Apr 2026, 2:00 PM',
    items: [
      { name: 'Cold Coffee', qty: 2, price: 55, emoji: '🧋' },
      { name: 'Paneer Roll', qty: 1, price: 45, emoji: '🌯' },
    ],
    total: 155, status: 'Delivered', pickupSlot: '1:50 – 2:00', counter: 3,
    vendorId: 'cafe',
  },
  {
    id: '#OM-049',
    date: '14 Apr 2026, 1:30 PM',
    items: [
      { name: 'Vada Pav',   qty: 2, price: 20, emoji: '🍔' },
      { name: 'Sweet Lime', qty: 1, price: 30, emoji: '🍋' },
    ],
    total: 70, status: 'Delivered', pickupSlot: '1:20 – 1:30', counter: 2,
    vendorId: 'snacks',
  },
  {
    id: '#OM-038',
    date: '12 Apr 2026, 12:55 PM',
    items: [
      { name: 'Dal Rice',   qty: 1, price: 60, emoji: '🍛' },
      { name: 'Masala Tea', qty: 1, price: 15, emoji: '🍵' },
    ],
    total: 75, status: 'Delivered', pickupSlot: '12:50 – 1:00', counter: 1,
    vendorId: 'canteen',
  },
];

/* ── Notifications ── */
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'order',  icon: '✅', title: 'Order Ready!',             body: 'Your order #OM-084 is ready at Counter 2.',                         time: '2 min ago',  read: false, link: 'history'  },
  { id: 'n2', type: 'offer',  icon: '🎁', title: 'New Combo Deal!',          body: 'Samosa + Tea combo at ₹30 today only. Save ₹5!',                    time: '1 hr ago',   read: false, link: 'offers'   },
  { id: 'n3', type: 'order',  icon: '👨\u200d🍳', title: 'Preparing your order',     body: 'Order #OM-084 is being prepared. ETA 5 min.',                       time: '15 min ago', read: true,  link: 'history'  },
  { id: 'n4', type: 'system', icon: '⏰', title: 'Beat the rush!',            body: 'Queue is low right now at Campus Café. Order now!',                  time: '30 min ago', read: true,  link: 'queue'    },
  { id: 'n5', type: 'offer',  icon: '⚡', title: 'Flash Deal — 30 min left', body: 'Mango Shake at ₹40 (save ₹10). Ends at 1:00 PM.',                   time: '45 min ago', read: true,  link: 'offers'   },
  { id: 'n6', type: 'order',  icon: '📋', title: 'Order Confirmed',          body: 'Your order #OM-084 has been accepted by Main Canteen.',              time: '1 hr ago',   read: true,  link: 'history'  },
  { id: 'n7', type: 'system', icon: '🌟', title: 'Rate your last order',     body: 'How was your Mango Shake & Pav Bhaji? Share your feedback!',        time: '2 hrs ago',  read: true,  link: 'reviews'  },
];

/* ── Reviews Mock Data ── */
export const MOCK_ITEM_REVIEWS = {
  1:  [{ user: 'Riya S.',   rating: 5, text: 'Perfectly crispy! Best samosa on campus.',         time: '2 days ago' },
       { user: 'Arjun M.',  rating: 4, text: 'Great taste, could be slightly less oily.',         time: '4 days ago' },
       { user: 'Priya K.',  rating: 5, text: 'Addictive! I order these every single day.',        time: '5 days ago' }],
  6:  [{ user: 'Dev P.',    rating: 5, text: 'Perfect strength, never disappoints.',              time: '1 day ago'  },
       { user: 'Sneha R.',  rating: 5, text: 'The masala ratio is spot on. Love it!',             time: '3 days ago' }],
  8:  [{ user: 'Karan T.',  rating: 5, text: 'Best cold coffee on campus, hands down.',           time: '1 day ago'  },
       { user: 'Meera J.',  rating: 4, text: 'Very good but could be stronger.',                  time: '2 days ago' }],
  12: [{ user: 'Aarav B.',  rating: 5, text: 'Thick, creamy, real mango flavor. 10/10.',          time: '3 hrs ago'  },
       { user: 'Tanya V.',  rating: 5, text: 'Reminds me of home. Always my go-to!',              time: '6 hrs ago'  },
       { user: 'Rohit P.',  rating: 4, text: 'Amazing taste, just wish it was bigger.',           time: '1 day ago'  }],
  18: [{ user: 'Ananya L.', rating: 5, text: 'The tangiest pani puri I\'ve ever had!',            time: '2 hrs ago'  },
       { user: 'Sahil D.',  rating: 5, text: 'Incredible. Worth every rupee.',                    time: '1 day ago'  }],
};

/* ── Offers & Deals ── */
export const MOCK_OFFERS = [
  {
    id: 'o1', type: 'combo', badge: '⚡ Flash Deal',
    title: 'Samosa + Masala Tea',
    desc: 'The classic campus combo',
    originalPrice: 35, offerPrice: 30,
    itemIds: [1, 6], emoji: '🥟🍵',
    expiresIn: 45, // minutes
    gradient: 'linear-gradient(135deg, #7c2d12, #b45309)',
    tag: 'Save ₹5',
  },
  {
    id: 'o2', type: 'combo', badge: '🔥 Hot Deal',
    title: 'Cold Coffee + Sandwich',
    desc: 'Study fuel combo',
    originalPrice: 95, offerPrice: 85,
    itemIds: [8, 7], emoji: '🧋🥪',
    expiresIn: 120,
    gradient: 'linear-gradient(135deg, #1e1b4b, #1e3a5f)',
    tag: 'Save ₹10',
  },
  {
    id: 'o3', type: 'combo', badge: '⭐ Top Pick',
    title: 'Mango Shake + Pani Puri',
    desc: 'Afternoon delight combo',
    originalPrice: 80, offerPrice: 70,
    itemIds: [12, 18], emoji: '🥭🫙',
    expiresIn: 200,
    gradient: 'linear-gradient(135deg, #78350f, #0c4a6e)',
    tag: 'Save ₹10',
  },
  {
    id: 'o4', type: 'loyalty', badge: '🎁 Loyalty',
    title: 'Free Masala Tea',
    desc: 'With any meal order above ₹60',
    originalPrice: 15, offerPrice: 0,
    itemIds: [6], emoji: '🍵',
    expiresIn: 999,
    gradient: 'linear-gradient(135deg, #292524, #44403c)',
    tag: 'Free',
  },
];

export const MOCK_COUPONS = [
  { code: 'FIRST10', discount: '10%',  desc: 'First order discount', active: true  },
  { code: 'LUNCH20', discount: '₹20',  desc: 'Lunch hour special',   active: true  },
  { code: 'CAMPUS5', discount: '₹5',   desc: 'Campus welcome offer', active: false },
];

/* ── Smart Queue Analytics ── */
export const QUEUE_HOURLY = [
  { hour: '9 AM',  levels: { canteen: 2, cafe: 1, juice: 1, snacks: 1 } },
  { hour: '10 AM', levels: { canteen: 3, cafe: 2, juice: 1, snacks: 2 } },
  { hour: '11 AM', levels: { canteen: 4, cafe: 3, juice: 2, snacks: 3 } },
  { hour: '12 PM', levels: { canteen: 9, cafe: 6, juice: 5, snacks: 8 } },
  { hour: '1 PM',  levels: { canteen: 10,cafe: 8, juice: 7, snacks: 9 } },
  { hour: '2 PM',  levels: { canteen: 7, cafe: 5, juice: 4, snacks: 6 } },
  { hour: '3 PM',  levels: { canteen: 5, cafe: 4, juice: 3, snacks: 4 } },
  { hour: '4 PM',  levels: { canteen: 3, cafe: 2, juice: 2, snacks: 3 } },
  { hour: '5 PM',  levels: { canteen: 2, cafe: 1, juice: 1, snacks: 2 } },
];

export const QUEUE_HEATMAP = [
  { day: 'Mon', hours: [1, 2, 4, 8, 10, 9, 7, 4, 2] },
  { day: 'Tue', hours: [1, 2, 5, 9, 10, 8, 6, 3, 2] },
  { day: 'Wed', hours: [2, 3, 6, 9, 8,  7, 5, 3, 1] },
  { day: 'Thu', hours: [1, 2, 4, 8, 10, 9, 6, 4, 1] },
  { day: 'Fri', hours: [2, 3, 7, 10,9,  8, 5, 2, 1] },
];

/* ── Personal Insights ── */
export const PERSONAL_INSIGHTS = {
  weeklySpend:   [55, 100, 75, 0, 70, 155, 0],
  weeklyOrders:  [1,  2,   1,  0, 1,  2,   0],
  weekDays:      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  topCategories: [
    { name: 'Drinks',  pct: 38, emoji: '🥤', color: '#38bdf8' },
    { name: 'Snacks',  pct: 32, emoji: '🥟', color: '#fb923c' },
    { name: 'Meals',   pct: 22, emoji: '🍛', color: '#4ade80' },
    { name: 'Bakery',  pct: 8,  emoji: '🧁', color: '#c084fc' },
  ],
  favoriteItem:    'Masala Tea',
  favoriteVendor:  'Campus Café',
  peakOrderTime:   '1:00 – 1:30 PM',
  ordersThisWeek:  7,
  spentThisWeek:   455,
  savedThisWeek:   28,
  longestStreak:   5,
  currentStreak:   3,
};

/* ── Complaint Categories ── */
export const COMPLAINT_CATEGORIES = [
  { id: 'delay',    emoji: '⏰', label: 'Order Delay',      desc: 'My order took longer than expected' },
  { id: 'wrong',    emoji: '❌', label: 'Wrong Order',       desc: 'I received the wrong items' },
  { id: 'quality',  emoji: '😞', label: 'Quality Issue',     desc: 'Food quality was not satisfactory' },
  { id: 'missing',  emoji: '📦', label: 'Missing Item',      desc: 'Item was missing from my order' },
  { id: 'payment',  emoji: '💳', label: 'Payment Issue',     desc: 'Problem with payment or refund' },
  { id: 'other',    emoji: '💬', label: 'Other',             desc: 'Something else happened' },
];

/* ── Default Favorites (pre-seeded) ── */
export const DEFAULT_FAVORITES = new Set([6, 12, 1]);
