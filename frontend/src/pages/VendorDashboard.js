import React, { useState, useEffect } from 'react';
import { getShops, predictDemand, wasteAnalysis as analyzeWaste } from '../services/api';
import Navbar from '../components/Navbar';

const DAY_LABELS = ['D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1'];

const STATUS_BADGE = {
  'Excellent':           'badge-green',
  'Good':                'badge-green',
  'No Waste / Shortage': 'badge-blue',
  'Moderate Waste':      'badge-yellow',
  'High Waste':          'badge-red',
};

/**
 * VendorDashboard
 * ----------------
 * Lets a vendor:
 *   1. Select their shop from a dropdown.
 *   2. Pick a menu item + time slot (auto-populated from shop data).
 *   3. Load sample history or enter custom values.
 *   4. Get a demand prediction + recommendation.
 *   5. Switch to Waste Analysis with actual consumption.
 *
 * Props:
 *   onBack() — return to RoleSelect
 */
function VendorDashboard({ auth, onLogout }) {
  /* ── Shop selection ── */
  const [shops,      setShops]      = useState([]);
  const [shopsError, setShopsError] = useState('');
  const [shopId,     setShopId]     = useState('');
  const [shopObj,    setShopObj]    = useState(null);

  /* ── Sub-nav ── */
  const [view, setView] = useState('predict'); // 'predict' | 'waste'

  /* ── Prediction form ── */
  const [menuItem,  setMenuItem]  = useState('');
  const [slot,      setSlot]      = useState('lunch');
  const [history,   setHistory]   = useState(Array(7).fill(''));
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [formError, setFormError] = useState('');

  /* ── Waste form ── */
  const [wItem,     setWItem]     = useState('');
  const [predicted, setPredicted] = useState('');
  const [actual,    setActual]    = useState('');
  const [wLoading,  setWLoading]  = useState(false);
  const [wResult,   setWResult]   = useState(null);
  const [wError,    setWError]    = useState('');

  // Fetch shop list on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getShops();
        setShops(data);
        if (data.length > 0) setShopId(data[0].id);
      } catch (err) {
        setShopsError(err.message || 'Could not load shops.');
      }
    })();
  }, []);

  // Resolve full shop object when shopId changes
  useEffect(() => {
    const found = shops.find((s) => s.id === shopId) || null;
    setShopObj(found);
    setMenuItem('');
    setHistory(Array(7).fill(''));
    setResult(null);
    setFormError('');
  }, [shopId, shops]);

  // Auto-select first menu item when shop changes
  useEffect(() => {
    if (shopObj && shopObj.menu.length > 0) {
      const first = shopObj.menu[0];
      setMenuItem(first.item);
      setSlot(first.time_slots[0] || 'lunch');
    }
  }, [shopObj]);

  /* ── Load sample data from shop JSON ── */
  const loadSampleData = () => {
    if (!shopObj) return;
    const key = `${menuItem}_${slot}`;
    const hist = shopObj.sample_history[key];
    if (hist) {
      setHistory(hist.map(String));
      setFormError('');
    } else {
      setFormError(`No sample data for "${menuItem} / ${slot}". Try another combination.`);
    }
  };

  /* ── When menu item changes, auto-update slot ── */
  const handleMenuChange = (item) => {
    setMenuItem(item);
    const menuEntry = shopObj?.menu.find((m) => m.item === item);
    if (menuEntry) setSlot(menuEntry.time_slots[0] || 'lunch');
    setHistory(Array(7).fill(''));
    setResult(null);
  };

  /* ── Prediction submit ── */
  const handlePredict = async (e) => {
    e.preventDefault();
    setFormError('');
    setResult(null);

    const histNums = history.map(Number);
    if (histNums.some((v) => isNaN(v) || v < 0)) {
      setFormError('All 7 history values must be non-negative numbers. Use "Load Sample Data" to pre-fill.');
      return;
    }

    setLoading(true);
    try {
      const data = await predictDemand(menuItem, histNums, slot);
      setResult(data);
      // Pre-fill waste form with predicted quantity
      setWItem(menuItem);
      setPredicted(String(data.recommended_quantity));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Waste analysis submit ── */
  const handleWaste = async (e) => {
    e.preventDefault();
    setWError('');
    setWResult(null);
    setWLoading(true);
    try {
      const data = await analyzeWaste(wItem.trim(), predicted, actual);
      setWResult(data);
    } catch (err) {
      setWError(err.message);
    } finally {
      setWLoading(false);
    }
  };

  /* ── Derived available time slots for selected item ── */
  const availableSlots = shopObj?.menu.find((m) => m.item === menuItem)?.time_slots || ['morning', 'lunch', 'evening'];

  return (
    <div className="app-layout">
      {/* ── Header ── */}
      <Navbar userName={auth.userName} role={auth.role} onLogout={onLogout} />

      <main className="page-content dashboard-page">
        {/* Error loading shops */}
        {shopsError && <div className="error-msg"><span>⚠️</span> {shopsError}</div>}

        {/* ── Shop Selector ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="page-header">
            <div className="page-header-text">
              <h1>Vendor Dashboard</h1>
              <p>Select your shop, enter weekly sales, and get your preparation plan.</p>
            </div>
          </div>

          <div className="shop-selector-banner">
            <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: 320 }}>
              <label className="form-label">Your Shop</label>
              <select
                className="form-select"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                id="shop-selector"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.type}</option>
                ))}
              </select>
            </div>

            {shopObj && (
              <div className="selected-shop-info">
                <div className="selected-shop-name">{shopObj.name}</div>
                <div className="selected-shop-meta">
                  📍 {shopObj.location} · ⭐ {shopObj.rating} · 
                  Efficiency: <span style={{ color: shopObj.efficiency_rate >= 85 ? 'var(--green)' : 'var(--yellow)', fontWeight: 600 }}>
                    {shopObj.efficiency_rate}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sub-nav ── */}
        <div className="vendor-subnav">
          <button className={`vendor-subnav-btn ${view === 'predict' ? 'active' : ''}`} onClick={() => setView('predict')}>
            🔮 Predict Demand
          </button>
          <button className={`vendor-subnav-btn ${view === 'waste' ? 'active' : ''}`} onClick={() => setView('waste')}>
            📉 Waste Analysis
          </button>
        </div>

        {/* ══ PREDICT VIEW ══ */}
        {view === 'predict' && (
          <div className="two-col">
            {/* Left: Form */}
            <div className="card">
              <p className="card-title"><span className="icon">⚙️</span> Prediction Setup</p>

              <form onSubmit={handlePredict}>
                {/* Menu Item */}
                <div className="form-group">
                  <label className="form-label">Menu Item</label>
                  <select className="form-select" value={menuItem} onChange={(e) => handleMenuChange(e.target.value)}>
                    {shopObj?.menu.map((m) => (
                      <option key={m.item} value={m.item}>{m.item}</option>
                    ))}
                  </select>
                </div>

                {/* Time Slot */}
                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select className="form-select" value={slot} onChange={(e) => setSlot(e.target.value)}>
                    {availableSlots.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* 7-day inputs */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Last 7 Days Sales</label>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.85rem', fontSize: '0.75rem' }}
                      onClick={loadSampleData}
                    >
                      📋 Load Sample Data
                    </button>
                  </div>
                  <div className="history-grid">
                    {DAY_LABELS.map((day, i) => (
                      <div className="history-day" key={i}>
                        <span className="day-label">{day}</span>
                        <input
                          className="form-input"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={history[i]}
                          onChange={(e) => {
                            const upd = [...history];
                            upd[i] = e.target.value;
                            setHistory(upd);
                          }}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner" /> Predicting…</>
                    : <><span>🔮</span> Predict Demand</>
                  }
                </button>
              </form>

              {formError && <div className="error-msg"><span>⚠️</span> {formError}</div>}
            </div>

            {/* Right: Result */}
            <div>
              {result ? (
                <div className="result-panel">
                  <p className="card-title"><span className="icon">✅</span> Prediction Result</p>
                  <div className="result-item-name">{result.item} — {result.time_slot}</div>

                  <div className="result-recommendation">
                    <span>🍽️</span> {result.recommendation}
                  </div>

                  <div className="result-meta-grid">
                    {[
                      { label: '7-Day WMA',        value: result.base_average },
                      { label: 'Slot Multiplier',  value: `${result.slot_multiplier}×` },
                      { label: 'Safety Factor',    value: `${result.safety_factor}×` },
                      { label: 'Predicted Demand', value: result.predicted_demand },
                    ].map((m) => (
                      <div className="result-meta-item" key={m.label}>
                        <div className="result-meta-label">{m.label}</div>
                        <div className="result-meta-value">{m.value}</div>
                      </div>
                    ))}
                    <div className="result-meta-item" style={{ border: '1px solid var(--border-active)', background: 'var(--accent-dim)', gridColumn: 'span 2' }}>
                      <div className="result-meta-label">Recommended Preparation</div>
                      <div className="result-meta-value" style={{ fontSize: '1.8rem' }}>
                        {result.recommended_quantity} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>units</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Formula: </strong>
                    WMA({result.base_average}) × {result.slot_multiplier} × {result.safety_factor} = <strong style={{ color: 'var(--accent)' }}>{result.recommended_quantity} units</strong>
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{ marginTop: '1rem', width: 'auto', padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
                    onClick={() => setView('waste')}
                  >
                    → Run Waste Analysis with these numbers
                  </button>
                </div>
              ) : (
                <div className="card" style={{ minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="empty-state">
                    <div className="empty-icon">🤖</div>
                    <p>Select your shop, load sample data,<br />and click <strong>Predict Demand</strong>.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ WASTE VIEW ══ */}
        {view === 'waste' && (
          <div className="two-col">
            <div className="card">
              <p className="card-title"><span className="icon">🔬</span> Waste Analysis</p>
              <form onSubmit={handleWaste}>
                <div className="form-group">
                  <label className="form-label">Food Item</label>
                  <input className="form-input" type="text" placeholder="e.g. Rice" value={wItem} onChange={(e) => setWItem(e.target.value)} required />
                </div>

                <div className="two-col" style={{ gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Prepared (units)</label>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 97" value={predicted} onChange={(e) => setPredicted(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consumed (units)</label>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 80" value={actual} onChange={(e) => setActual(e.target.value)} required />
                  </div>
                </div>

                <button className="btn btn-primary" type="submit" disabled={wLoading}>
                  {wLoading ? <><span className="spinner" /> Analyzing…</> : <><span>📉</span> Analyze Waste</>}
                </button>
              </form>
              {wError && <div className="error-msg"><span>⚠️</span> {wError}</div>}
            </div>

            <div>
              {wResult ? (
                <div className="waste-result-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <p className="card-title" style={{ marginBottom: 0 }}><span className="icon">📋</span> {wResult.item}</p>
                    <span className={`badge ${STATUS_BADGE[wResult.status] || 'badge-blue'}`}>{wResult.status}</span>
                  </div>

                  {/* Meter */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Waste Meter</span>
                      <span style={{ fontWeight: 700, color: wResult.waste_percentage > 15 ? 'var(--red)' : 'var(--green)' }}>{wResult.waste_percentage}%</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${Math.min(wResult.waste_percentage, 100)}%`,
                        background: wResult.waste_percentage > 30 ? 'var(--red)' : wResult.waste_percentage > 15 ? 'var(--yellow)' : 'var(--green)',
                        borderRadius: 99, transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>

                  <div className="result-meta-grid" style={{ marginBottom: '1rem' }}>
                    <div className="result-meta-item"><div className="result-meta-label">Prepared</div><div className="result-meta-value">{wResult.predicted}</div></div>
                    <div className="result-meta-item"><div className="result-meta-label">Consumed</div><div className="result-meta-value" style={{ color: 'var(--green)' }}>{wResult.actual}</div></div>
                    <div className="result-meta-item"><div className="result-meta-label">Wasted</div><div className="result-meta-value" style={{ color: 'var(--red)' }}>{wResult.waste_quantity}</div></div>
                    <div className="result-meta-item"><div className="result-meta-label">Efficiency</div><div className="result-meta-value" style={{ color: 'var(--green)' }}>{wResult.efficiency_rate}%</div></div>
                  </div>

                  <div className="waste-tip"><strong>💡 Action: </strong>{wResult.tip}</div>
                </div>
              ) : (
                <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="empty-state">
                    <div className="empty-icon">📉</div>
                    <p>Enter prepared vs consumed and click Analyze.</p>
                    {predicted && <p style={{ marginTop: '0.5rem', color: 'var(--accent)', fontSize: '0.82rem' }}>Predicted from last result: {predicted} units</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        OptiMeal SaaS · Vendor View · Powered by 7-Day Weighted Moving Average
      </footer>
    </div>
  );
}

export default VendorDashboard;
