import React, { useState } from 'react';
import { wasteAnalysis } from '../services/api';

/* ── Map backend status → badge class ── */
const STATUS_BADGE = {
  'Excellent':         'badge-green',
  'Good':              'badge-green',
  'No Waste / Shortage': 'badge-blue',
  'Moderate Waste':    'badge-yellow',
  'High Waste':        'badge-red',
};

/* ── Waste meter bar ── */
function WasteMeter({ pct }) {
  const capped = Math.min(pct, 100);
  let color = 'var(--green)';
  if (pct > 30) color = 'var(--red)';
  else if (pct > 15) color = 'var(--yellow)';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Waste Meter
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${capped}%`,
            background: color,
            borderRadius: 99,
            transition: 'width 0.6s ease',
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/**
 * WasteAnalysis
 * -------------
 * User inputs predicted and actual values for a named food item.
 * Calls POST /api/waste-analysis and renders:
 *   - waste_quantity, waste_percentage, efficiency_rate
 *   - Status badge + actionable tip from the backend
 *   - Visual waste meter bar
 *
 * Also supports batch analysis (table of multiple items).
 */
function WasteAnalysis() {
  /* ── Single item form state ── */
  const [item,      setItem]      = useState('');
  const [predicted, setPredicted] = useState('');
  const [actual,    setActual]    = useState('');
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState('');

  /* ── Batch form state ── */
  const EMPTY_ROW = { item: '', predicted: '', actual: '' };
  const [batchRows, setBatchRows]     = useState([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
  const [batchResult, setBatchResult] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError,   setBatchError]   = useState('');

  /* ── Single submit ── */
  const handleSingle = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await wasteAnalysis(item.trim(), predicted, actual);
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'API error. Is the backend running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Batch row helpers ── */
  const updateRow = (index, field, value) => {
    const rows = [...batchRows];
    rows[index] = { ...rows[index], [field]: value };
    setBatchRows(rows);
  };

  const addRow    = () => setBatchRows([...batchRows, { ...EMPTY_ROW }]);
  const removeRow = (i) => setBatchRows(batchRows.filter((_, idx) => idx !== i));

  /* ── Batch submit ── */
  const handleBatch = async (e) => {
    e.preventDefault();
    setBatchError('');
    setBatchResult(null);
    setBatchLoading(true);
    try {
      const { default: api } = await import('../services/api');
      const response = await api.post('/waste-analysis', {
        comparisons: batchRows.map((r) => ({
          item: r.item,
          predicted: parseFloat(r.predicted),
          actual: parseFloat(r.actual),
        })),
      });
      setBatchResult(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'API error.';
      setBatchError(msg);
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div>
      {/* ── Section Header ── */}
      <div className="section-header">
        <h2>Waste Analysis</h2>
        <p>Compare predicted vs. actual consumption to calculate waste metrics and efficiency.</p>
      </div>

      {/* ══ SINGLE ITEM ANALYSIS ══ */}
      <div className="two-col" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <p className="card-title"><span className="icon">🔬</span> Single Item Analysis</p>
          <form onSubmit={handleSingle}>
            <div className="form-group">
              <label className="form-label" htmlFor="waste-item">Food Item Name</label>
              <input
                id="waste-item"
                className="form-input"
                type="text"
                placeholder="e.g. Rice"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
              />
            </div>

            <div className="two-col" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="predicted-val">Predicted (units)</label>
                <input
                  id="predicted-val"
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 97"
                  value={predicted}
                  onChange={(e) => setPredicted(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="actual-val">Actual Consumed (units)</label>
                <input
                  id="actual-val"
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 80"
                  value={actual}
                  onChange={(e) => setActual(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Analyzing…</>
                : <><span>📉</span> Analyze Waste</>
              }
            </button>
          </form>

          {error && <div className="error-msg"><span>⚠️</span> {error}</div>}
        </div>

        {/* Single result */}
        <div>
          {result ? (
            <div className="waste-result-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <p className="card-title" style={{ marginBottom: '0.25rem' }}><span className="icon">📋</span> Results for {result.item}</p>
                </div>
                <span className={`badge ${STATUS_BADGE[result.status] || 'badge-blue'}`}>
                  {result.status}
                </span>
              </div>

              <WasteMeter pct={result.waste_percentage} />

              <div className="result-meta-grid" style={{ marginBottom: '1rem' }}>
                <div className="result-meta-item">
                  <div className="result-meta-label">Prepared</div>
                  <div className="result-meta-value">{result.predicted}</div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Consumed</div>
                  <div className="result-meta-value" style={{ color: 'var(--green)' }}>{result.actual}</div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Wasted</div>
                  <div className="result-meta-value" style={{ color: result.waste_quantity > 0 ? 'var(--red)' : 'var(--green)' }}>
                    {result.waste_quantity}
                  </div>
                </div>
                <div className="result-meta-item">
                  <div className="result-meta-label">Efficiency</div>
                  <div className="result-meta-value" style={{ color: 'var(--green)' }}>{result.efficiency_rate}%</div>
                </div>
              </div>

              <div className="waste-tip">
                <strong>💡 Action: </strong>{result.tip}
              </div>
            </div>
          ) : (
            <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-icon">📉</div>
                <p>Waste analysis will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ BATCH ANALYSIS ══ */}
      <div className="card">
        <p className="card-title"><span className="icon">📋</span> Batch Analysis — Multiple Items</p>
        <form onSubmit={handleBatch}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {['Food Item', 'Prepared', 'Actual Consumed', ''].map((h, i) => (
              <span key={i} className="form-label" style={{ marginBottom: 0 }}>{h}</span>
            ))}
          </div>

          {batchRows.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                className="form-input" type="text"
                placeholder="e.g. Rice"
                value={row.item}
                onChange={(e) => updateRow(i, 'item', e.target.value)}
                required
              />
              <input
                className="form-input" type="number" min="0"
                placeholder="e.g. 97"
                value={row.predicted}
                onChange={(e) => updateRow(i, 'predicted', e.target.value)}
                required
              />
              <input
                className="form-input" type="number" min="0"
                placeholder="e.g. 80"
                value={row.actual}
                onChange={(e) => updateRow(i, 'actual', e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '0.5rem 0.75rem', color: 'var(--red)' }}
                onClick={() => removeRow(i)}
                disabled={batchRows.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} onClick={addRow}>
              + Add Row
            </button>
            <button className="btn btn-primary" type="submit" disabled={batchLoading} style={{ flex: 1 }}>
              {batchLoading
                ? <><span className="spinner" /> Running Batch Analysis…</>
                : <><span>🔄</span> Run Batch Analysis</>
              }
            </button>
          </div>
        </form>

        {batchError && <div className="error-msg"><span>⚠️</span> {batchError}</div>}

        {/* Batch results table */}
        {batchResult && (
          <div style={{ marginTop: '1.75rem', animation: 'slideUp 0.35s ease-out' }}>
            <div className="divider" />

            {/* Summary strip */}
            <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Prepared',  value: batchResult.summary.total_prepared,  color: 'var(--accent)' },
                { label: 'Total Consumed',  value: batchResult.summary.total_consumed,  color: 'var(--green)' },
                { label: 'Total Wasted',    value: batchResult.summary.total_wasted,    color: 'var(--red)' },
                { label: 'Overall Waste %', value: `${batchResult.summary.overall_waste_percentage}%`, color: 'var(--yellow)' },
                { label: 'Efficiency',      value: `${batchResult.summary.overall_efficiency_rate}%`, color: 'var(--green)' },
              ].map((m) => (
                <div className="kpi-card" key={m.label}>
                  <div className="kpi-label">{m.label}</div>
                  <div className="kpi-value" style={{ color: m.color, fontSize: '1.5rem' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Overall status + tip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span className={`badge ${STATUS_BADGE[batchResult.summary.overall_status] || 'badge-blue'}`}>
                {batchResult.summary.overall_status}
              </span>
            </div>
            <div className="waste-tip"><strong>💡 Action: </strong>{batchResult.summary.overall_tip}</div>

            {/* Per-item table */}
            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Item', 'Prepared', 'Consumed', 'Wasted', 'Waste %', 'Status'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batchResult.results.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{row.item}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{row.predicted}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--green)' }}>{row.actual}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: row.waste_quantity > 0 ? 'var(--red)' : 'var(--green)' }}>{row.waste_quantity}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{row.waste_percentage}%</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${STATUS_BADGE[row.status] || 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WasteAnalysis;
