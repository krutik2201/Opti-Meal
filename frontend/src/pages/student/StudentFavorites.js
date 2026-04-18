import React, { useState } from 'react';
import { MENU_ITEMS } from './data';

function StudentFavorites({ favorites, onAddToCart, onToggleFavorite, onNavigate, onOpenItem }) {
  const [filter, setFilter] = useState('all');

  const favItems = MENU_ITEMS.filter(item => favorites.has(item.id));
  const filtered = filter === 'all'
    ? favItems
    : favItems.filter(item => item.category.toLowerCase() === filter);

  const categories = [...new Set(favItems.map(i => i.category))];

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          My Favorites
          <span style={{ marginLeft: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ({favItems.length})
          </span>
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Your saved items for quick reordering</p>
      </div>

      {favItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">❤️</div>
          <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No favorites yet</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Tap the heart icon on any item to save it here!
          </p>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.7rem 1.5rem' }}
            onClick={() => onNavigate('menu')}
          >
            Browse Menu →
          </button>
        </div>
      ) : (
        <>
          {/* ── Category filter ── */}
          {categories.length > 1 && (
            <div className="filter-chips" style={{ marginBottom: '1.25rem' }}>
              <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                ❤️ All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${filter === cat.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFilter(filter === cat.toLowerCase() ? 'all' : cat.toLowerCase())}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ── Quick add all ── */}
          {favItems.length > 1 && (
            <button
              className="btn btn-primary"
              style={{ marginBottom: '1.25rem', justifyContent: 'center', padding: '0.7rem' }}
              onClick={() => favItems.filter(i => i.available).forEach(i => onAddToCart(i))}
            >
              🛒 Add All to Cart
            </button>
          )}

          {/* ── Items grid ── */}
          <div className="menu-grid">
            {filtered.map(item => (
              <div key={item.id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
                <div
                  className="menu-card-emoji-area"
                  style={{ background: item.gradient, cursor: 'pointer' }}
                  onClick={() => onOpenItem && onOpenItem(item)}
                >
                  <span style={{ fontSize: '2.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>{item.emoji}</span>

                  {/* Favorite heart */}
                  <button
                    onClick={e => { e.stopPropagation(); onToggleFavorite(item.id); }}
                    style={{
                      position: 'absolute', top: '0.4rem', right: '0.4rem',
                      background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                      width: 28, height: 28, cursor: 'pointer', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>

                  {!item.available && (
                    <span style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: '#f87171',
                    }}>Sold Out</span>
                  )}
                </div>

                <div className="menu-card-body">
                  <div className="menu-card-top">
                    <div className="menu-card-name">{item.name}</div>
                    <div className="menu-card-price">₹{item.price}</div>
                  </div>
                  <div className="menu-card-vendor">{item.vendorName}</div>
                  <div className="menu-card-rating">
                    <span style={{ color: 'var(--yellow)' }}>⭐</span>
                    <span>{item.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({item.reviews})</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                  <div className="menu-card-footer">
                    <div className={`veg-dot ${item.veg ? 'veg' : 'non-veg'}`} />
                    <button
                      className="add-btn"
                      onClick={() => onAddToCart(item)}
                      disabled={!item.available}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentFavorites;
