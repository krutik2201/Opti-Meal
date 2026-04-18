import React from 'react';

/**
 * DataTable
 * ---------
 * Renders a styled table of historical data records.
 * Accepts any flat array of objects.
 *
 * Props:
 *   data   (array)  — rows to display
 *   title  (string) — optional card title
 */
function DataTable({ data = [], title = 'Historical Records' }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <p className="card-title"><span className="icon">📜</span> {title}</p>
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <p>No records to display.</p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  /* Determine cell color for quantity/actual/waste columns */
  const getCellStyle = (col, val) => {
    if (col === 'actual')   return { color: 'var(--green)', fontWeight: 600 };
    if (col === 'quantity') return { color: 'var(--accent)', fontWeight: 600 };
    if (col === 'waste')    return { color: 'var(--yellow)' };
    return {};
  };

  return (
    <div className="card">
      <p className="card-title"><span className="icon">📜</span> {title}</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56,189,248,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: '0.75rem 0.75rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      ...getCellStyle(col, row[col]),
                    }}
                  >
                    {col === 'time_slot' ? (
                      <span style={{ textTransform: 'capitalize' }}>{row[col]}</span>
                    ) : row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {data.length} records
      </p>
    </div>
  );
}

export default DataTable;
