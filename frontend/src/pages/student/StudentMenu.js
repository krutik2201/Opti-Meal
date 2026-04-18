import React, { useState } from 'react';
import { MENU_ITEMS, VENDORS } from './data';

const CATEGORIES = ['All', 'Snacks', 'Meals', 'Drinks', 'Breakfast', 'Bakery'];

function StudentMenu({ cart, onAddToCart, updateQty, favorites, onToggleFavorite, onOpenItem, initialVendor = 'all', onClearVendorFilter }) {
  const [search,         setSearch]         = useState('');
  const [vegFilter,      setVegFilter]      = useState('all');
  const [vendorFilter,   setVendorFilter]   = useState(initialVendor);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy,         setSortBy]         = useState('default');

  // Keep vendor filter in sync if parent changes it (e.g. navigating back from home)
  React.useEffect(() => {
    setVendorFilter(initialVendor);
  }, [initialVendor]);

  const selectedVendor = VENDORS.find(v => v.id === vendorFilter);

  const getQty = (itemId) => {
    const found = cart.find(c => c.item.id === itemId);
    return found ? found.qty : 0;
  };

  const filtered = MENU_ITEMS.filter(item => {
    const q = search.toLowerCase();
    const matchSearch   = !q || item.name.toLowerCase().includes(q) || item.vendorName.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    const matchVeg      = vegFilter === 'all' || (vegFilter === 'veg' ? item.veg : !item.veg);
    const matchVendor   = vendorFilter === 'all' || item.vendorId === vendorFilter;
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchSearch && matchVeg && matchVendor && matchCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating')     return b.rating - a.rating;
    if (sortBy === 'popular')    return b.reviews - a.reviews;
    return 0;
  });

  const clearAll = () => {
    setSearch(''); setVegFilter('all'); setVendorFilter('all'); setCategoryFilter('All'); setSortBy('default');
  };

  const clearVendorFilter = () => {
    setVendorFilter('all');
    if (onClearVendorFilter) onClearVendorFilter();
  };

  return (
    <div>
      {/* ── Canteen banner — shown when a specific vendor is pre-selected ── */}
      {selectedVendor && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.06))',
          border: '1px solid rgba(56,189,248,0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{ fontSize: '1.6rem' }}>{selectedVendor.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {selectedVendor.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              📍 {selectedVendor.location} &nbsp;·&nbsp;
              {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              ⏱ {selectedVendor.wait} min wait
            </div>
            <button
              onClick={clearVendorFilter}
              style={{
                background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.3)',
                color: 'var(--accent)',
                borderRadius: 99,
                padding: '0.2rem 0.65rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✕ Show All
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky search + filter row ── */}
      <div className="menu-search-row">
        <div className="menu-search-input-wrap">
          <span className="menu-search-icon">🔍</span>
          <input
            className="menu-search-input"
            type="text"
            placeholder="Search samosa, tea, sandwich…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="menu-search"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem',
              }}
            >✕</button>
          )}
        </div>

        {/* Veg + Category chips */}
        <div className="filter-chips" style={{ marginBottom: '0.4rem' }}>
          <button className={`filter-chip ${vegFilter === 'all' ? 'active' : ''}`} onClick={() => setVegFilter('all')}>🥗 All</button>
          <button
            className={`filter-chip ${vegFilter === 'veg' ? 'active' : ''}`}
            onClick={() => setVegFilter('veg')}
            style={vegFilter !== 'veg' ? { borderColor: 'rgba(16,185,129,0.4)', color: 'var(--green)' } : {}}
          >🟢 Veg</button>
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <button
              key={cat}
              className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat === categoryFilter ? 'All' : cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Vendor + Sort chips */}
        <div className="filter-chips" style={{ marginBottom: '0.4rem' }}>
          <button className={`filter-chip ${vendorFilter === 'all' ? 'active' : ''}`} onClick={() => setVendorFilter('all')}>🏪 All</button>
          {VENDORS.map(v => (
            <button
              key={v.id}
              className={`filter-chip ${vendorFilter === v.id ? 'active' : ''}`}
              onClick={() => setVendorFilter(vendorFilter === v.id ? 'all' : v.id)}
            >{v.emoji} {v.name}</button>
          ))}
        </div>

        {/* Sort chips */}
        <div className="filter-chips">
          {[
            { id: 'default',    label: '↕ Default'     },
            { id: 'rating',     label: '⭐ Top Rated'  },
            { id: 'popular',    label: '🔥 Popular'     },
            { id: 'price-asc',  label: '⬆ Price'       },
            { id: 'price-desc', label: '⬇ Price'       },
          ].map(s => (
            <button
              key={s.id}
              className={`filter-chip ${sortBy === s.id ? 'active' : ''}`}
              onClick={() => setSortBy(s.id === sortBy ? 'default' : s.id)}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <div style={{ padding: '0.5rem 0 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
        {search && <span> for "<strong style={{ color: 'var(--text-primary)' }}>{search}</strong>"</span>}
      </div>

      {/* ── Menu grid ── */}
      {filtered.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🔍</div>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No items found</p>
          <p style={{ fontSize: '0.85rem' }}>Try a different search or filter</p>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', marginTop: '1rem', padding: '0.6rem 1.25rem' }}
            onClick={clearAll}
          >Clear Filters</button>
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.map(item => {
            const qty = getQty(item.id);
            const isFav = favorites && favorites.has(item.id);
            return (
              <div
                key={item.id}
                className={`menu-card ${!item.available ? 'unavailable' : ''}`}
              >
                {/* Emoji area */}
                <div
                  className="menu-card-emoji-area"
                  style={{ background: item.gradient, cursor: 'pointer' }}
                  onClick={() => onOpenItem && onOpenItem(item)}
                >
                  <span style={{ fontSize: '2.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>{item.emoji}</span>

                  {/* Favorites heart */}
                  {onToggleFavorite && (
                    <button
                      onClick={e => { e.stopPropagation(); onToggleFavorite(item.id); }}
                      style={{
                        position: 'absolute', top: '0.4rem', right: '0.4rem',
                        background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
                        width: 26, height: 26, cursor: 'pointer', fontSize: '0.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.15s',
                      }}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  )}

                  {item.tags.includes('bestseller') && (
                    <span style={{
                      position: 'absolute', top: '0.4rem', left: '0.4rem',
                      background: 'var(--yellow)', color: '#000', fontSize: '0.6rem',
                      fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px',
                    }}>⭐ BEST</span>
                  )}
                  {!item.available && (
                    <span style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: '#f87171',
                    }}>Sold Out</span>
                  )}
                </div>

                <div className="menu-card-body" style={{ position: 'relative' }}>
                  <div className="menu-card-top">
                    <div
                      className="menu-card-name"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onOpenItem && onOpenItem(item)}
                    >{item.name}</div>
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
                    <div className={`veg-dot ${item.veg ? 'veg' : 'non-veg'}`} title={item.veg ? 'Vegetarian' : 'Non-vegetarian'} />
                    {qty > 0 ? (
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                        <span className="qty-num">{qty}</span>
                        <button className="qty-btn" onClick={() => onAddToCart(item)}>+</button>
                      </div>
                    ) : (
                      <button
                        className="add-btn"
                        onClick={() => onAddToCart(item)}
                        disabled={!item.available}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentMenu;
