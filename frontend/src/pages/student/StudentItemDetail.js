import React, { useState } from 'react';
import { MOCK_ITEM_REVIEWS, MENU_ITEMS } from './data';

const RATING_DIST = { 1: 5, 2: 8, 3: 15, 4: 32, 5: 40 }; // fallback dist

function StarRow({ rating, size = '1rem', interactive = false, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          onClick={() => interactive && onChange && onChange(n)}
          style={{
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default',
            color: n <= rating ? '#facc15' : 'rgba(255,255,255,0.2)',
            transition: 'transform 0.15s',
            display: 'inline-block',
          }}
        >★</span>
      ))}
    </div>
  );
}

function StudentItemDetail({ item, onClose, onAddToCart, isFavorite, onToggleFavorite }) {
  const [userRating, setUserRating]   = useState(0);
  const [reviewText, setReviewText]   = useState('');
  const [submitted,  setSubmitted]    = useState(false);
  const [qty,        setQty]          = useState(0);

  if (!item) return null;

  const itemReviews = MOCK_ITEM_REVIEWS[item.id] || [];
  const dist = RATING_DIST;
  const maxDist = Math.max(...Object.values(dist));

  const similarItems = MENU_ITEMS
    .filter(m => m.id !== item.id && (m.category === item.category || m.vendorId === item.vendorId) && m.available)
    .slice(0, 4);

  const handleAdd = () => {
    onAddToCart(item);
    setQty(q => q + 1);
  };

  const handleSubmitReview = () => {
    if (userRating === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="item-detail-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="item-detail-sheet">

        {/* ── Top controls ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1rem 0' }}>
          <button className="detail-back-btn" onClick={onClose}>← Back</button>
          <button
            onClick={() => onToggleFavorite(item.id)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        {/* ── Hero ── */}
        <div className="item-detail-hero" style={{ background: item.gradient }}>
          <span className="item-detail-emoji">{item.emoji}</span>
          {item.tags.includes('bestseller') && (
            <span className="item-detail-badge">⭐ BESTSELLER</span>
          )}
          {!item.available && (
            <div className="item-detail-sold-out">Sold Out</div>
          )}
        </div>

        <div className="item-detail-body">

          {/* ── Name + price ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h2 className="item-detail-name">{item.name}</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.vendorName}</div>
            </div>
            <div className="item-detail-price">₹{item.price}</div>
          </div>

          {/* ── Rating row ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <StarRow rating={Math.round(item.rating)} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.rating}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({item.reviews} reviews)</span>
          </div>

          {/* ── Description ── */}
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {item.desc}
          </p>

          {/* ── Meta chips ── */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span className="meta-chip">{item.veg ? '🟢 Veg' : '🔴 Non-veg'}</span>
            <span className="meta-chip">🔥 {item.calories} kcal</span>
            <span className="meta-chip">⏱ {item.prepTime}</span>
            <span className="meta-chip">📂 {item.category}</span>
          </div>

          {/* ── Rating distribution ── */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <p className="card-title"><span className="icon">📊</span> Rating Breakdown</p>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', width: '2rem', color: 'var(--text-muted)' }}>{star}★</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(dist[star] / maxDist) * 100}%`,
                    height: '100%',
                    background: star >= 4 ? 'var(--green)' : star === 3 ? 'var(--yellow)' : 'var(--red)',
                    borderRadius: 99,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '2rem' }}>{dist[star]}%</span>
              </div>
            ))}
          </div>

          {/* ── User reviews ── */}
          {itemReviews.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Recent Reviews</h3>
              {itemReviews.map((rev, i) => (
                <div key={i} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="review-avatar">{rev.user.charAt(0)}</div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rev.user}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rev.time}</span>
                  </div>
                  <StarRow rating={rev.rating} size="0.85rem" />
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                    {rev.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Write a review ── */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <p className="card-title"><span className="icon">✍️</span> Rate This Item</p>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--green)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                <div style={{ fontWeight: 700 }}>Thanks for your review!</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '0.75rem' }}>
                  <StarRow rating={userRating} size="1.6rem" interactive onChange={setUserRating} />
                </div>
                <textarea
                  placeholder="Share your experience…"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="review-textarea"
                  rows={3}
                />
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', padding: '0.65rem', justifyContent: 'center', fontSize: '0.875rem' }}
                  onClick={handleSubmitReview}
                  disabled={userRating === 0}
                >
                  Submit Review
                </button>
              </>
            )}
          </div>

          {/* ── Similar items ── */}
          {similarItems.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>You Might Also Like</h3>
              <div className="h-scroll-row" style={{ gap: '0.75rem' }}>
                {similarItems.map(sim => (
                  <div key={sim.id} className="similar-card" onClick={() => onAddToCart(sim)}>
                    <div className="similar-card-emoji" style={{ background: sim.gradient }}>{sim.emoji}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '0.35rem' }}>{sim.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>₹{sim.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Sticky add to cart ── */}
        <div className="item-detail-footer">
          {item.available ? (
            qty === 0 ? (
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '1rem' }} onClick={handleAdd}>
                + Add to Cart • ₹{item.price}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                <div className="qty-ctrl" style={{ gap: '1rem' }}>
                  <button className="qty-btn" style={{ width: 40, height: 40 }} onClick={() => setQty(q => Math.max(0, q - 1))}>−</button>
                  <span className="qty-num" style={{ fontSize: '1.1rem' }}>{qty}</span>
                  <button className="qty-btn" style={{ width: 40, height: 40 }} onClick={handleAdd}>+</button>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>₹{item.price * qty}</div>
              </div>
            )
          ) : (
            <div style={{ flex: 1, textAlign: 'center', color: 'var(--red)', fontWeight: 600 }}>Currently Unavailable</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentItemDetail;
