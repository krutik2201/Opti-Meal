import React, { useState, useEffect } from 'react';
import { AI_COMBOS, MENU_ITEMS, MOCK_PAST_ORDERS } from './data';

const REASONS = [
  'Based on your order history',
  'Matches your taste profile',
  'Trending among students like you',
  'Perfect for this time of day',
  'High rated by similar users',
];

const MEAL_PLANS = [
  {
    id: 'mp1',
    title: 'Power Study Day 📚',
    desc: 'Keep your energy up through long lectures',
    meals: [
      { label: 'Breakfast',  item: 4  },
      { label: 'Snack',      item: 1  },
      { label: 'Lunch',      item: 2  },
      { label: 'Refresher',  item: 8  },
    ],
    gradient: 'linear-gradient(135deg, #1e1b4b, #1e3a5f)',
  },
  {
    id: 'mp2',
    title: 'Healthy Light Day 🥗',
    desc: 'Light and fresh for an active day',
    meals: [
      { label: 'Breakfast',  item: 4  },
      { label: 'Drink',      item: 11 },
      { label: 'Lunch',      item: 5  },
      { label: 'Snack',      item: 18 },
    ],
    gradient: 'linear-gradient(135deg, #1a3a1a, #14532d)',
  },
];

function AnimatedCard({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      {children}
    </div>
  );
}

function StudentAIRecommend({ onAddToCart, favorites, onNavigate }) {
  const [refreshed, setRefreshed] = useState(0);
  const [adding, setAdding] = useState(null);

  const handleAddCombo = (combo, comboItems) => {
    setAdding(combo.id);
    comboItems.forEach(item => onAddToCart(item));
    setTimeout(() => setAdding(null), 1500);
  };

  const refresh = () => setRefreshed(r => r + 1);

  // "AI" favorite item pick
  const favItems = MENU_ITEMS.filter(i => favorites.has(i.id) && i.available).slice(0, 2);
  const topRated = [...MENU_ITEMS].filter(i => i.available).sort((a, b) => b.rating - a.rating).slice(0, 3);
  const history  = MOCK_PAST_ORDERS;
  const lastOrder = history[0];

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>🤖 AI Picks</h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Personalized recs just for you</p>
        </div>
        <button
          onClick={refresh}
          style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(56,189,248,0.2)',
            color: 'var(--accent)', borderRadius: 'var(--radius-sm)',
            padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── AI Combo Cards ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="stu-section-title" style={{ marginBottom: '0.75rem' }}>🍽️ Recommended Combos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {AI_COMBOS.map((combo, idx) => {
            const comboItems = combo.itemIds.map(id => MENU_ITEMS.find(m => m.id === id)).filter(Boolean);
            const total = comboItems.reduce((s, i) => s + i.price, 0);
            const isAdding = adding === combo.id;
            const reason = REASONS[idx % REASONS.length];

            return (
              <AnimatedCard key={`${combo.id}-${refreshed}`} delay={idx * 120}>
                <div className="combo-card" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Reason bubble */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: 99, padding: '0.25rem 0.75rem', fontSize: '0.72rem',
                    color: 'var(--accent)', fontWeight: 600, alignSelf: 'flex-start',
                  }}>
                    🤖 {reason}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {/* Item emojis */}
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
                        {comboItems.map(i => i.emoji).join(' + ')}
                      </div>
                      <div className="combo-items">{combo.items.join(' + ')}</div>
                      <div className="combo-reason" style={{ marginTop: '0.25rem' }}>{combo.reason}</div>
                      <div style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{total - combo.saving}</span>
                        {combo.saving > 0 && (
                          <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.4rem', fontSize: '0.75rem' }}>₹{total}</span>
                        )}
                        {combo.saving > 0 && (
                          <span style={{ color: 'var(--green)', fontWeight: 700, marginLeft: '0.4rem', fontSize: '0.75rem' }}>Save ₹{combo.saving}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <span className="combo-badge">{combo.badge}</span>
                      <button
                        className="add-btn"
                        style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', opacity: isAdding ? 0.7 : 1 }}
                        onClick={() => handleAddCombo(combo, comboItems)}
                        disabled={isAdding}
                      >
                        {isAdding ? '✓ Added!' : '+ Add Combo'}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* ── Based on Favorites ── */}
      {favItems.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="stu-section-title" style={{ marginBottom: '0.75rem' }}>❤️ From Your Favorites</h2>
          <div className="h-scroll-row">
            {favItems.map((item, idx) => (
              <AnimatedCard key={item.id} delay={idx * 100}>
                <div className="popular-card" onClick={() => onAddToCart(item)} title={`Add ${item.name}`}>
                  <div className="popular-card-emoji" style={{ background: item.gradient }}>{item.emoji}</div>
                  <div className="popular-card-body">
                    <div className="popular-card-name">{item.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="popular-card-price">₹{item.price}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--yellow)' }}>⭐ {item.rating}</div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* ── Meal Plans ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="stu-section-title" style={{ marginBottom: '0.75rem' }}>🗓️ Meal Plans</h2>
        {MEAL_PLANS.map((plan, pi) => {
          const planItems = plan.meals.map(m => ({
            ...m, itemData: MENU_ITEMS.find(i => i.id === m.item),
          }));
          const planTotal = planItems.reduce((s, m) => s + (m.itemData?.price || 0), 0);

          return (
            <AnimatedCard key={plan.id} delay={pi * 150}>
              <div
                key={plan.id}
                style={{
                  borderRadius: 'var(--radius)', overflow: 'hidden',
                  border: '1px solid var(--border)', marginBottom: '0.85rem',
                }}
              >
                <div style={{ background: plan.gradient, padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.2rem' }}>{plan.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>{plan.desc}</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '0.9rem 1.25rem' }}>
                  {planItems.map((m, i) => m.itemData && (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.35rem 0',
                      borderBottom: i < planItems.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '4.5rem' }}>{m.label}</span>
                        <span>{m.itemData.emoji}</span>
                        <span style={{ fontSize: '0.82rem' }}>{m.itemData.name}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700 }}>₹{m.itemData.price}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Total: ₹{planTotal}</span>
                    <button
                      className="btn btn-primary"
                      style={{ width: 'auto', padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                      onClick={() => planItems.forEach(m => m.itemData && onAddToCart(m.itemData))}
                    >
                      Add All
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* ── Top Rated Section ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 className="stu-section-title" style={{ marginBottom: '0.75rem' }}>⭐ Campus Top Rated</h2>
        <div className="h-scroll-row">
          {topRated.map((item, idx) => (
            <AnimatedCard key={item.id} delay={idx * 100}>
              <div className="popular-card" onClick={() => onAddToCart(item)}>
                <div className="popular-card-emoji" style={{ background: item.gradient }}>{item.emoji}</div>
                <div className="popular-card-body">
                  <div className="popular-card-name">{item.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="popular-card-price">₹{item.price}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--yellow)', fontWeight: 700 }}>⭐ {item.rating}</div>
                  </div>
                  <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.reviews} reviews</div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentAIRecommend;
