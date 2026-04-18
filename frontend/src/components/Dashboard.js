import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { getAllData } from '../services/api';

/* ── Recharts custom tooltip style ── */
const tooltipStyle = {
  contentStyle: {
    background: '#0f1623',
    border: '1px solid rgba(56,189,248,0.25)',
    borderRadius: '10px',
    fontSize: '0.82rem',
    color: '#f0f6ff',
  },
};

/**
 * Dashboard
 * ----------
 * Loads historical data from GET /api/data and renders:
 *  - 3 KPI summary cards
 *  - Bar chart: Quantity prepared vs. Actual consumption per record
 *  - Line chart: 7-day quantity trend for each item
 *
 * Props:
 *   lastPrediction — the most recent prediction from InputForm (optional, for live KPIs)
 */
function Dashboard({ lastPrediction }) {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllData();
      setRecords(data);
    } catch (err) {
      setError('Could not load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Derived metrics ── */
  const totalPrepared  = records.reduce((s, r) => s + (r.quantity || 0), 0);
  const totalActual    = records.reduce((s, r) => s + (r.actual   || 0), 0);
  const totalWasted    = Math.max(0, totalPrepared - totalActual);
  const wastePercent   = totalPrepared > 0
    ? ((totalWasted / totalPrepared) * 100).toFixed(1)
    : 0;
  const efficiencyRate = totalPrepared > 0
    ? ((totalActual / totalPrepared) * 100).toFixed(1)
    : 0;

  /* ── Bar chart data: prepared vs actual by item+slot ── */
  const barData = records.map((r, i) => ({
    name: `${r.item} (${r.time_slot?.slice(0, 3)})`,
    Prepared: r.quantity,
    Actual:   r.actual,
    date:     r.date,
  }));

  /* ── Line chart: group by item, show daily trend ── */
  const itemNames  = [...new Set(records.map((r) => r.item))];
  const datesSorted = [...new Set(records.map((r) => r.date))].sort();

  const lineData = datesSorted.map((date) => {
    const entry = { date: date.slice(5) }; // "MM-DD"
    itemNames.forEach((item) => {
      const match = records.find((r) => r.date === date && r.item === item);
      entry[item] = match ? match.quantity : null;
    });
    return entry;
  });

  const LINE_COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#a78bfa'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3, borderTopColor: 'var(--accent)' }} />
        <p style={{ marginTop: '1rem' }}>Loading dashboard data…</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-msg" style={{ marginTop: 0 }}><span>⚠️</span> {error}</div>;
  }

  return (
    <div>
      {/* ── Section Header ── */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Analytics Dashboard</h2>
          <p>Historical consumption overview across all items and time slots.</p>
        </div>
        <button className="btn btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={fetchData}>
          ↻ Refresh
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Prepared</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {totalPrepared}<span style={{ fontSize: '1rem', fontWeight: 400 }}> u</span>
          </div>
          <div className="kpi-sub">{records.length} records</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Consumed</div>
          <div className="kpi-value" style={{ color: 'var(--green)' }}>
            {totalActual}<span style={{ fontSize: '1rem', fontWeight: 400 }}> u</span>
          </div>
          <div className="kpi-sub">Efficiency: {efficiencyRate}%</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total Waste</div>
          <div className="kpi-value" style={{ color: wastePercent > 15 ? 'var(--red)' : 'var(--yellow)' }}>
            {totalWasted}<span style={{ fontSize: '1rem', fontWeight: 400 }}> u</span>
          </div>
          <div className="kpi-sub">{wastePercent}% of prepared</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Efficiency Rate</div>
          <div className="kpi-value" style={{ color: efficiencyRate >= 85 ? 'var(--green)' : 'var(--yellow)' }}>
            {efficiencyRate}<span style={{ fontSize: '1rem', fontWeight: 400 }}>%</span>
          </div>
          <div className="kpi-sub">
            {efficiencyRate >= 90 ? '✅ Excellent' : efficiencyRate >= 75 ? '🟡 Good' : '🔴 Needs Attention'}
          </div>
        </div>

        {/* Live prediction card (appears after a new prediction) */}
        {lastPrediction && (
          <div className="kpi-card" style={{ border: '1px solid var(--border-active)', gridColumn: 'span 2' }}>
            <div className="kpi-label">🔮 Latest Prediction — {lastPrediction.item} ({lastPrediction.time_slot})</div>
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>
              {lastPrediction.recommended_quantity}
              <span style={{ fontSize: '1rem', fontWeight: 400 }}> units</span>
            </div>
            <div className="kpi-sub">{lastPrediction.recommendation}</div>
          </div>
        )}
      </div>

      {/* ── Bar Chart: Prepared vs Actual ── */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p className="card-title"><span className="icon">📊</span> Prepared vs. Actual Consumption</p>
        <div className="chart-container" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#748aaa', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#748aaa', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: '0.8rem', color: '#748aaa', paddingTop: '1rem' }}
              />
              <Bar dataKey="Prepared" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual"   fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Line Chart: Item Trends ── */}
      <div className="card">
        <p className="card-title"><span className="icon">📈</span> Daily Consumption Trends by Item</p>
        <div className="chart-container" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#748aaa', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#748aaa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#748aaa', paddingTop: '1rem' }} />
              {itemNames.map((item, i) => (
                <Line
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: LINE_COLORS[i % LINE_COLORS.length] }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
