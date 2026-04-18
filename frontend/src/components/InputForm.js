import React, { useState } from 'react';
import { predictDemand } from '../services/api';

// Day labels for the 7-input grid
const DAY_LABELS = ['D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1'];

// Demo presets — useful during a live presentation
const PRESETS = {
  Rice:    { history: [80, 85, 78, 90, 88, 84, 86], slot: 'lunch' },
  Chapati: { history: [60, 58, 62, 65, 59, 61, 63], slot: 'morning' },
  Dal:     { history: [50, 55, 48, 60, 52, 54, 57], slot: 'evening' },
};

/**
 * InputForm
 * ---------
 * Collects food item, 7-day history, and time slot,
 * then calls POST /api/predict and renders the result.
 *
 * Props:
 *   onPrediction(result) — lifted callback so App can share data with Dashboard
 */
function InputForm({ onPrediction }) {
  const [item, setItem]       = useState('');
  const [history, setHistory] = useState(Array(7).fill(''));
  const [slot, setSlot]       = useState('lunch');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');

  // Update a single day in the history array without mutating state
  const handleHistoryChange = (index, value) => {
    const updated = [...history];
    updated[index] = value;
    setHistory(updated);
  };

  // Fill all fields with a preset for quick demo
  const applyPreset = (presetKey) => {
    const p = PRESETS[presetKey];
    setItem(presetKey);
    setHistory(p.history.map(String));
    setSlot(p.slot);
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    // Validate: all 7 history values must be valid numbers
    const historyNums = history.map(Number);
    if (historyNums.some((v) => isNaN(v) || v < 0)) {
      setError('All 7 history fields must be valid non-negative numbers.');
      return;
    }

    setLoading(true);
    try {
      const data = await predictDemand(item.trim(), historyNums, slot);
      setResult(data);
      if (onPrediction) onPrediction(data); // lift result up to App
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'API error. Is the backend running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Section Header ── */}
      <div className="section-header">
        <h2>Demand Prediction Engine</h2>
        <p>Enter 7 days of historical consumption data to generate a preparation recommendation.</p>
      </div>

      <div className="two-col">
        {/* ── Left: Input Form ── */}
        <div className="card">
          <p className="card-title"><span className="icon">⚙️</span> Configure Prediction</p>

          {/* Quick-fill preset buttons */}
          <div className="form-group">
            <label className="form-label">Quick Fill (Demo Presets)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.keys(PRESETS).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={() => applyPreset(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            {/* Food item name */}
            <div className="form-group">
              <label className="form-label" htmlFor="item-name">Food Item Name</label>
              <input
                id="item-name"
                className="form-input"
                type="text"
                placeholder="e.g. Rice, Chapati, Dal"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
              />
            </div>

            {/* Time slot */}
            <div className="form-group">
              <label className="form-label" htmlFor="time-slot">Time Slot</label>
              <select
                id="time-slot"
                className="form-select"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              >
                <option value="morning">🌅 Morning (Breakfast)</option>
                <option value="lunch">☀️ Lunch (Peak Meal)</option>
                <option value="evening">🌙 Evening (Dinner)</option>
              </select>
            </div>

            {/* 7-day history grid */}
            <div className="form-group">
              <label className="form-label">Last 7 Days Demand (units)</label>
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
                      onChange={(e) => handleHistoryChange(i, e.target.value)}
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

          {/* Error message */}
          {error && (
            <div className="error-msg">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* ── Right: Result Panel ── */}
        <div>
          {result ? (
            <div className="result-panel">
              <p className="card-title"><span className="icon">✅</span> Prediction Result</p>

              <div className="result-item-name">{result.item}</div>

              <div className="result-recommendation">
                <span>🍽️</span> {result.recommendation}
              </div>

              <div className="result-meta-grid">
                <div className="result-meta-item">
                  <div className="result-meta-label">Time Slot</div>
                  <div className="result-meta-value" style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
                    {result.time_slot}
                  </div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">7-Day Average</div>
                  <div className="result-meta-value">{result.base_average}</div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Slot Multiplier</div>
                  <div className="result-meta-value">{result.slot_multiplier}×</div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Safety Factor</div>
                  <div className="result-meta-value">{result.safety_factor}×</div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Predicted Demand</div>
                  <div className="result-meta-value">{result.predicted_demand}</div>
                </div>
                <div className="result-meta-item" style={{ border: '1px solid rgba(56,189,248,0.3)', background: 'var(--accent-dim)' }}>
                  <div className="result-meta-label">Recommended Qty</div>
                  <div className="result-meta-value" style={{ fontSize: '1.6rem' }}>
                    {result.recommended_quantity}
                  </div>
                </div>
              </div>

              {/* How it was calculated */}
              <div style={{ marginTop: '1.25rem', padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                <strong style={{ color: 'var(--text-primary)' }}>How this was calculated:</strong><br />
                WMA({result.base_average}) × Slot({result.slot_multiplier}) = Raw({result.raw_prediction})<br />
                Raw × Safety({result.safety_factor}) = <strong style={{ color: 'var(--accent)' }}>Prepare {result.recommended_quantity} units</strong>
              </div>
            </div>
          ) : (
            <div className="card" style={{ height: '100%', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-icon">🤖</div>
                <p>Your prediction result will appear here.</p>
                <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>Use a preset or fill the form and click <strong>Predict Demand</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputForm;
