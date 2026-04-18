import React, { useState, useEffect } from 'react';
import { MOCK_OFFERS, MOCK_COUPONS, MENU_ITEMS } from './data';

function Countdown({ minutes }) {
  const [secs, setSecs] = useState(minutes * 60);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const isUrgent = secs < 600;

  if (secs === 0) return <span style={{ color: 'var(--red)', fontWeight: 700 }}>Expired</span>;

  return (
    <span style={{ color: isUrgent ? 'var(--red)' : 'var(--yellow)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
      {isUrgent && '⚡ '}
      {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')} left
    </span>
  );
}

function StudentOffers({ onAddToCart, onNavigate }) {
  const [couponInput, setCouponInput]   = useState('');
  const [appliedCode, setAppliedCode]   = useState(null);
  const [couponMsg,   setCouponMsg]     = useState('');
  const [claimedIds, setClaimedIds]     = useState(new Set());
  const [points] = useState(148);

  const handleApplyCoupon = () => {
    const code = MOCK_COUPONS.find(c => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!code) {
      setCouponMsg('❌ Invalid coupon code');
      setAppliedCode(null);
    } else if (!code.active) {
      setCouponMsg('⚠️ This coupon has expired');
      setAppliedCode(null);
    } else {
      setCouponMsg(`✅ Coupon applied! You save ${code.discount}`);
      setAppliedCode(code);
    }
    setTimeout(() => setCouponMsg(''), 3000);
  };

  const handleClaim = (offerId, itemIds) => {
    setClaimedIds(prev => new Set([...prev, offerId]));
    itemIds.forEach(id => {
      const item = MENU_ITEMS.find(m => m.id === id);
      if (item) onAddToCart(item);
    });
  };

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>🎁 Offers & Deals</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Exclusive combos and discounts just for you</p>
      </div>

      {/* ── Loyalty Points Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(251,146,60,0.12))',
        border: '1px solid rgba(250,204,21,0.25)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.25rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>🌟 Loyalty Points</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Earn 1 point per ₹10 spent</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--yellow)', lineHeight: 1 }}>{points}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>points</div>
        </div>
      </div>

      {/* ── Deal of the Day ── */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 className="stu-section-title" style={{ marginBottom: '0.75rem' }}>🔥 Today's Deals</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {MOCK_OFFERS.map(offer => {
            const isClaimed = claimedIds.has(offer.id);
            return (
              <div
                key={offer.id}
                style={{
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  opacity: isClaimed ? 0.65 : 1,
                  transition: 'opacity 0.3s',
                }}
              >
                {/* Gradient header */}
                <div style={{
                  background: offer.gradient,
                  padding: '1rem 1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)',
                      padding: '0.2rem 0.5rem', borderRadius: 99, marginBottom: '0.4rem', display: 'inline-block',
                    }}>{offer.badge}</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{offer.emoji}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                    }}>
                      ₹{offer.offerPrice}
                      <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                        ₹{offer.originalPrice}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)',
                      padding: '0.15rem 0.45rem', borderRadius: 99, fontWeight: 700,
                    }}>{offer.tag}</span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{
                  background: 'var(--surface)', padding: '0.85rem 1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{offer.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{offer.desc}</div>
                    {offer.expiresIn < 999 && (
                      <div style={{ fontSize: '0.75rem' }}>
                        <Countdown minutes={offer.expiresIn} />
                      </div>
                    )}
                  </div>
                  <button
                    className={`btn ${isClaimed ? '' : 'btn-primary'}`}
                    style={{
                      width: 'auto', padding: '0.55rem 1rem', fontSize: '0.82rem',
                      flexShrink: 0,
                      background: isClaimed ? 'var(--green-dim)' : undefined,
                      color: isClaimed ? 'var(--green)' : undefined,
                      border: isClaimed ? '1px solid rgba(16,185,129,0.3)' : undefined,
                    }}
                    onClick={() => !isClaimed && handleClaim(offer.id, offer.itemIds)}
                    disabled={isClaimed}
                  >
                    {isClaimed ? '✓ Added to Cart' : 'Claim Deal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Coupon Section ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">🎟️</span> Coupon Code</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            className="menu-search-input"
            style={{ position: 'static', flex: 1, height: 'auto', padding: '0.6rem 0.9rem' }}
            placeholder="Enter coupon code…"
            value={couponInput}
            onChange={e => setCouponInput(e.target.value.toUpperCase())}
            id="coupon-input"
          />
          <button
            className="btn btn-primary"
            style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem', flexShrink: 0 }}
            onClick={handleApplyCoupon}
          >
            Apply
          </button>
        </div>
        {couponMsg && <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>{couponMsg}</div>}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {MOCK_COUPONS.map(c => (
            <button
              key={c.code}
              className="filter-chip"
              style={!c.active ? { opacity: 0.45 } : {}}
              onClick={() => c.active && setCouponInput(c.code)}
            >
              {c.code}
              {!c.active && ' (Expired)'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentOffers;
