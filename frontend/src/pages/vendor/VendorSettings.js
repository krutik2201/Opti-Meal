import React, { useState } from 'react';

export default function VendorSettings() {
  const [slotLimit, setSlotLimit] = useState(15);
  const [autoPacing, setAutoPacing] = useState(true);
  const [heavyItems, setHeavyItems] = useState(true);

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#fff' }}>Kitchen Settings</h1>
        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Control your capacity and system preferences.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Capacity Controls */}
        <div className="surface-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Capacity Controls</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Maximum Orders per Slot</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>System will auto-close slots when this limit is reached.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => setSlotLimit(Math.max(5, slotLimit - 5))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', width: '30px', textAlign: 'center' }}>{slotLimit}</span>
              <button onClick={() => setSlotLimit(slotLimit + 5)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', width: '30px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Auto-Pacing Assistance</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enable AI pacing recommendations.</div>
            </div>
            <button 
              onClick={() => setAutoPacing(!autoPacing)}
              style={{
                width: '40px', height: '24px', borderRadius: '12px', cursor: 'pointer', border: 'none', position: 'relative',
                background: autoPacing ? 'var(--green)' : 'var(--border)', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: autoPacing ? '18px' : '2px', width: '20px', height: '20px',
                background: '#fff', borderRadius: '50%', transition: 'left 0.2s'
              }} />
            </button>
          </div>
        </div>

        {/* Menu Controls */}
        <div className="surface-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Menu Management</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Heavy Items Availability</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>If disabled, complex items are hidden from students to reduce load.</div>
            </div>
            <button 
              onClick={() => setHeavyItems(!heavyItems)}
              style={{
                width: '40px', height: '24px', borderRadius: '12px', cursor: 'pointer', border: 'none', position: 'relative',
                background: heavyItems ? 'var(--green)' : 'var(--border)', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: heavyItems ? '18px' : '2px', width: '20px', height: '20px',
                background: '#fff', borderRadius: '50%', transition: 'left 0.2s'
              }} />
            </button>
          </div>
        </div>

        <button style={{ padding: '0.8rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
