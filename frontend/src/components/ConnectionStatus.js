import React, { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '../services/api';

/**
 * ConnectionStatus
 * -----------------
 * A small pill in the header that polls GET /health every 8 seconds
 * and shows whether the Flask backend is reachable.
 *
 * States:
 *   checking  — grey pill, first load
 *   connected — green pill, backend responded 200
 *   error     — red pill, network error or timeout
 */
function ConnectionStatus() {
  const [status, setStatus]   = useState('checking'); // 'checking' | 'connected' | 'error'
  const [version, setVersion] = useState('');

  const ping = useCallback(async () => {
    try {
      const data = await checkHealth();
      setVersion(data.version || '');
      setStatus('connected');
    } catch {
      setStatus('error');
    }
  }, []);

  // Ping on mount, then every 8 seconds
  useEffect(() => {
    ping();
    const interval = setInterval(ping, 8000);
    return () => clearInterval(interval);
  }, [ping]);

  const styles = {
    checking:  { bg: 'rgba(100,116,139,0.15)', dot: '#64748b', text: '#94a3b8', label: 'Connecting…' },
    connected: { bg: 'rgba(16,185,129,0.12)',  dot: '#10b981', text: '#10b981', label: version ? `Backend v${version}` : 'Backend Connected' },
    error:     { bg: 'rgba(239,68,68,0.12)',   dot: '#ef4444', text: '#ef4444', label: 'Backend Offline' },
  };

  const s = styles[status];

  return (
    <div
      title={
        status === 'connected'
          ? 'Flask backend is running and healthy'
          : status === 'error'
          ? 'Cannot reach backend on port 5000. Run: python app.py'
          : 'Pinging backend…'
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.3rem 0.75rem',
        background: s.bg,
        borderRadius: 99,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: s.text,
        border: `1px solid ${s.dot}33`,
        cursor: 'default',
        userSelect: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Animated dot */}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: s.dot,
          boxShadow: status === 'connected' ? `0 0 6px ${s.dot}` : 'none',
          animation: status === 'checking' ? 'pulse 1.4s ease-in-out infinite' : 'none',
          display: 'inline-block',
        }}
      />
      {s.label}

      {/* Pulse keyframe injected inline once */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default ConnectionStatus;
