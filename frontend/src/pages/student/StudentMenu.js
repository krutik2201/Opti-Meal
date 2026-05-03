import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, VENDORS } from './data';

function StudentMenu({ cart, onNavigate, onAddToCart, updateQty, onOpenItem, initialVendor, onClearVendorFilter, kitchenLoads }) {
  const [vendor, setVendor] = useState(initialVendor || 'all');
  const [filter, setFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'

  const ALL_VENDORS = [{ id: 'all', name: 'All', emoji: '🏪' }, ...VENDORS];

  const items = useMemo(() => {
    let list = MENU_ITEMS.filter(i => i.available);
    if (vendor !== 'all') list = list.filter(i => i.vendorId === vendor);
    if (filter === 'veg') list = list.filter(i => i.veg);
    if (filter === 'nonveg') list = list.filter(i => !i.veg);
    return list;
  }, [vendor, filter]);

  const getCartQty = (id) => {
    const found = cart.find(c => c.item.id === id);
    return found ? found.qty : 0;
  };

  return (
    <div className="simple-menu">
      {/* Title */}
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Menu</h1>

      {/* Veg / Non-veg filter */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'veg', label: '🟢 Veg' },
          { key: 'nonveg', label: '🔴 Non-Veg' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: 99,
              border: filter === f.key ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: filter === f.key ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: filter === f.key ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.18s',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Vendor filter — horizontal scroll */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.2rem' }}>
        {ALL_VENDORS.map(v => (
          <button
            key={v.id}
            onClick={() => { setVendor(v.id); if (v.id === 'all') onClearVendorFilter?.(); }}
            style={{
              flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: 99, whiteSpace: 'nowrap',
              border: vendor === v.id ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: vendor === v.id ? 'var(--accent-dim)' : 'var(--bg-card)',
              color: vendor === v.id ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', fontWeight: 600,
            }}
          >{v.emoji} {v.name}</button>
        ))}
      </div>

      {/* Item count */}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        {items.length} items
      </div>

      {/* Item Grid */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</div>
          <div style={{ fontWeight: 600 }}>No items found</div>
          <button
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}
            onClick={() => { setFilter('all'); setVendor('all'); }}
          >Clear filters</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '6rem',
        }}>
          {items.map(item => {
            const qty = getCartQty(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'flex', flexDirection: 'column',
                  transition: 'border-color 0.2s, transform 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Emoji image area */}
                <div
                  onClick={() => onOpenItem?.(item)}
                  style={{
                    width: '100%', height: 80, borderRadius: 'var(--radius-sm)',
                    background: item.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', marginBottom: '0.65rem',
                  }}
                >
                  {item.emoji}
                </div>

                {/* Name */}
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem', lineHeight: 1.3 }}>
                  {item.name}
                </div>

                {/* Price */}
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  ₹{item.price}
                </div>

                {/* Add / Qty control */}
                {qty > 0 ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem',
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); updateQty(item.id, -1); }}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--accent)',
                        background: 'transparent', color: 'var(--accent)', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'inherit',
                      }}
                    >−</button>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent)', minWidth: 20, textAlign: 'center' }}>{qty}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); updateQty(item.id, 1); }}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--accent)',
                        background: 'transparent', color: 'var(--accent)', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'inherit',
                      }}
                    >+</button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                    style={{
                      width: '100%', padding: '0.45rem',
                      background: 'var(--accent)', color: '#000',
                      border: 'none', borderRadius: 'var(--radius-sm)',
                      fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >Add</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky cart bar */}
      {cart.length > 0 && (
        <div style={{
          position: 'sticky', bottom: '4.5rem', background: 'var(--bg)',
          borderTop: '1px solid var(--border)', padding: '0.75rem 0',
        }}>
          <button
            className="btn btn-primary"
            style={{ justifyContent: 'space-between', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
            onClick={() => onNavigate('cart')}
          >
            <span>View Cart</span>
            <span>{cart.reduce((s, c) => s + c.qty, 0)} items · ₹{cart.reduce((s, c) => s + c.item.price * c.qty, 0)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentMenu;
