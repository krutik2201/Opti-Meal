import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from './data';

const TYPE_COLOR = {
  order:  { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.2)',  dot: 'var(--accent)' },
  offer:  { bg: 'rgba(250,204,21,0.1)',  border: 'rgba(250,204,21,0.2)',  dot: 'var(--yellow)' },
  system: { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)', dot: 'var(--green)'  },
};

/* Arrow label based on destination */
const LINK_LABEL = {
  history: '→ View Orders',
  offers:  '→ See Offers',
  queue:   '→ Check Queue',
  reviews: '→ Leave Review',
  menu:    '→ Browse Menu',
};

function StudentNotifications({ onNavigate }) {
  const [notes,    setNotes]   = useState(MOCK_NOTIFICATIONS);
  const [filter,   setFilter]  = useState('all');
  const [tapping,  setTapping] = useState(null);   // visual press feedback

  const unread = notes.filter(n => !n.read).length;

  const markAllRead = () => setNotes(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss     = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const handleTap = (note) => {
    /* 1. mark as read */
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, read: true } : n));
    /* 2. brief press animation */
    setTapping(note.id);
    setTimeout(() => setTapping(null), 140);
    /* 3. navigate if the notification has a destination */
    if (note.link) {
      setTimeout(() => onNavigate(note.link), 150);
    }
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.type === filter);

  return (
    <div style={{ paddingTop: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Notifications
            {unread > 0 && (
              <span style={{
                marginLeft: '0.6rem', background: 'var(--accent)', color: '#000',
                fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem',
                borderRadius: 99, verticalAlign: 'middle',
              }}>{unread} new</span>
            )}
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Tap any notification to go to the relevant page
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              fontSize: '0.75rem', color: 'var(--accent)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* ── Filter chips ── */}
      <div className="filter-chips" style={{ marginBottom: '1.25rem' }}>
        {['all', 'order', 'offer', 'system'].map(f => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '🔔 All' : f === 'order' ? '📦 Orders' : f === 'offer' ? '🎁 Offers' : '⚙️ System'}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {filtered.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🔔</div>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No notifications</p>
          <p style={{ fontSize: '0.85rem' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {filtered.map(note => {
            const s = TYPE_COLOR[note.type] || TYPE_COLOR.system;
            const isTapping = tapping === note.id;
            const hasLink   = Boolean(note.link);

            return (
              <button
                key={note.id}
                onClick={() => handleTap(note)}
                className="notif-card"
                style={{
                  /* layout */
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  cursor: hasLink ? 'pointer' : 'default',
                  /* appearance */
                  background:   note.read ? 'var(--surface)' : s.bg,
                  border:       `1px solid ${note.read ? 'var(--border)' : s.border}`,
                  opacity:      note.read ? 0.75 : 1,
                  /* press feedback */
                  transform:    isTapping ? 'scale(0.985)' : 'scale(1)',
                  transition:   'transform 0.1s ease, border-color 0.2s, box-shadow 0.2s',
                  /* hover glow only if clickable */
                  boxShadow:    hasLink && !note.read ? `0 0 0 0 ${s.dot}` : 'none',
                }}
                onMouseEnter={e => {
                  if (hasLink) e.currentTarget.style.borderColor = s.dot;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = note.read ? 'var(--border)' : s.border;
                }}
              >
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  {/* Icon circle */}
                  <div style={{
                    fontSize: '1.4rem', width: 44, height: 44, borderRadius: '50%',
                    background: s.bg, border: `1px solid ${s.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {note.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>
                        {note.title}
                      </div>
                      {!note.read && (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: s.dot, flexShrink: 0, marginTop: 5,
                        }} />
                      )}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {note.body}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{note.time}</div>
                      {hasLink && (
                        <div style={{
                          fontSize: '0.7rem', fontWeight: 700, color: s.dot,
                          background: `${s.bg}`,
                          border: `1px solid ${s.border}`,
                          borderRadius: 99,
                          padding: '0.15rem 0.6rem',
                        }}>
                          {LINK_LABEL[note.link] || '→ Open'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dismiss ✕ */}
                  <button
                    onClick={e => { e.stopPropagation(); dismiss(note.id); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: '1rem',
                      padding: '0.1rem', lineHeight: 1, flexShrink: 0,
                    }}
                    title="Dismiss"
                  >×</button>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ height: '1rem' }} />
    </div>
  );
}

export default StudentNotifications;
