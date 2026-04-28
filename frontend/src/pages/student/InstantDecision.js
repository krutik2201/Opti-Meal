import React, { useState, useEffect } from 'react';
import { MENU_ITEMS, DECISION_PRESETS } from './data';

function InstantDecision({ onAddToCart, onNavigate, kitchenLoads }) {
  const [chosen,    setChosen]    = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [phase,     setPhase]     = useState('pick'); // 'pick' | 'confirm' | 'done'

  // Countdown to auto-confirm
  useEffect(() => {
    if (chosen && phase === 'confirm') {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase('done');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [chosen, phase]);

  useEffect(() => {
    if (phase === 'done' && chosen) {
      const preset = presets.find(p => p.key === chosen);
      if (preset) {
        preset.resolvedItems.forEach(item => onAddToCart(item));
        setTimeout(() => onNavigate('cart'), 600);
      }
    }
  }, [phase]); // eslint-disable-line

  const presets = Object.entries(DECISION_PRESETS).map(([key, p]) => ({
    key,
    ...p,
    resolvedItems: p.items.map(id => MENU_ITEMS.find(m => m.id === id)).filter(Boolean),
  }));

  const COLORS = {
    usual:    { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.4)',  text: 'var(--accent)',  glow: 'rgba(56,189,248,0.15)'  },
    trending: { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.4)',  text: 'var(--yellow)',  glow: 'rgba(245,158,11,0.12)'  },
    fastest:  { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.4)',  text: 'var(--green)',   glow: 'rgba(16,185,129,0.12)'  },
  };

  const handlePick = (key) => {
    setChosen(key);
    setPhase('confirm');
  };

  const cancelPick = () => {
    setChosen(null);
    setPhase('pick');
    setCountdown(null);
  };

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: '1.75rem',
        background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: 'var(--radius-md)', padding: '1.5rem 1rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 150,
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)',
          borderRadius: 99, padding: '0.35rem 1rem',
          fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa',
          marginBottom: '0.85rem',
        }}>
          🧠 INSTANT DECISION MODE
        </div>

        <h1 style={{ fontSize: '1.55rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.4rem' }}>
          Order in <span style={{ color: '#a78bfa' }}>&lt;3 Seconds</span>
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {phase === 'pick'
            ? 'Pick one preset. Cart fills instantly — no thinking required.'
            : phase === 'confirm'
            ? `Confirming in ${countdown}s... Tap anywhere to cancel`
            : 'Order added! Heading to cart…'}
        </p>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
        {presets.map(preset => {
          const c = COLORS[preset.key];
          const isChosen   = chosen === preset.key;
          const isOther    = chosen && chosen !== preset.key;
          const total      = preset.resolvedItems.reduce((s, i) => s + i.price, 0);
          const maxPrep    = preset.resolvedItems.length ? Math.max(...preset.resolvedItems.map(i => i.prepMins)) : 5;
          const prepColor  = maxPrep <= 4 ? 'var(--green)' : maxPrep <= 7 ? 'var(--yellow)' : 'var(--red)';

          return (
            <button
              key={preset.key}
              id={`instant-${preset.key}`}
              onClick={() => phase === 'pick' ? handlePick(preset.key) : null}
              disabled={phase !== 'pick'}
              style={{
                background: isChosen ? `rgba(16,185,129,0.12)` : c.bg,
                border: `2px solid ${isChosen ? 'var(--green)' : isOther ? 'var(--border)' : c.border}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: phase === 'pick' ? 'pointer' : 'default',
                fontFamily: 'inherit',
                textAlign: 'left', width: '100%',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                opacity: isOther ? 0.45 : 1,
                transform: isChosen ? 'scale(0.99)' : 'scale(1)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Animated border on chosen */}
              {isChosen && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, var(--green), var(--accent), var(--green))`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite',
                }} />
              )}

              {/* Label row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{preset.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: isChosen ? 'var(--green)' : c.text }}>
                    {preset.label}
                    {isChosen && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>✓ Selected</span>}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{preset.reason}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.5rem' }}>
                  <div style={{ fontWeight: 800, color: isChosen ? 'var(--green)' : c.text, fontSize: '1.1rem' }}>₹{total}</div>
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700, color: prepColor,
                    background: `${prepColor === 'var(--green)' ? 'rgba(16,185,129,0.12)' : prepColor === 'var(--yellow)' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'}`,
                    borderRadius: 99, padding: '0.1rem 0.4rem', marginTop: '0.2rem',
                    display: 'inline-block',
                  }}>⚡ ~{maxPrep} min</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                {preset.resolvedItems.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    background: 'rgba(0,0,0,0.3)', borderRadius: 99,
                    padding: '0.25rem 0.65rem', fontSize: '0.75rem',
                  }}>
                    <span>{item.emoji}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: '0.82rem', fontWeight: 700,
                color: isChosen ? 'var(--green)' : c.text,
              }}>
                {isChosen ? (
                  <span>⏳ Auto-confirming in {countdown}s…</span>
                ) : (
                  <span>Tap to order → {preset.resolvedItems.map(i => i.emoji).join(' ')}</span>
                )}
                {isChosen && (
                  <button
                    onClick={e => { e.stopPropagation(); cancelPick(); }}
                    style={{
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 99, padding: '0.2rem 0.65rem', fontSize: '0.7rem',
                      fontWeight: 700, color: 'var(--red)', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >Cancel</button>
                )}
              </div>

              {/* Countdown progress bar */}
              {isChosen && countdown !== null && (
                <div style={{ marginTop: '0.75rem', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${((3 - countdown) / 3) * 100}%`,
                    height: '100%', background: 'var(--green)',
                    borderRadius: 99, transition: 'width 1s linear',
                  }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Decision tip */}
      <div style={{
        background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', marginBottom: '1.25rem',
        fontSize: '0.78rem', color: 'var(--text-secondary)',
      }}>
        💡 <strong style={{ color: '#a78bfa' }}>How it works:</strong> Select a preset → Items auto-add to cart →
        Confirm in 3 seconds or head straight to checkout.
      </div>

      <button
        style={{
          width: '100%', padding: '0.85rem', background: 'none',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem',
        }}
        onClick={() => onNavigate('menu')}
      >
        Browse Full Menu Instead
      </button>
    </div>
  );
}

export default InstantDecision;
