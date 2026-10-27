import React, { useState } from 'react';
import {
  ListFilter,
  Search,
  Trash2,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Cpu,
  Layers,
  Clock,
  Lock,
  Database
} from 'lucide-react';
import { exportSimulationToExcel, exportSimulationToPDF, exportSimulationToCSV } from '../engine/exportUtils';

export default function EventLog({ snapshot, onClearLogs }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = snapshot.logs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return log.message.toLowerCase().includes(q) || log.type.toLowerCase().includes(q);
    }
    return true;
  });

  const getLogBadge = (type) => {
    switch (type) {
      case 'PRODUCER':
        return <span className="badge badge-producer" style={{ fontSize: '0.62rem' }}>PRODUCER</span>;
      case 'CONSUMER':
        return <span className="badge badge-consumer" style={{ fontSize: '0.62rem' }}>CONSUMER</span>;
      case 'MUTEX':
        return <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>MUTEX</span>;
      case 'SEMAPHORE':
        return <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>SEMAPHORE</span>;
      case 'CRITICAL_SECTION':
        return <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>CRITICAL SECTION</span>;
      case 'HAZARD':
        return <span className="badge badge-waiting" style={{ fontSize: '0.62rem' }}>RACE HAZARD</span>;
      case 'SCENARIO':
        return <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>SCENARIO</span>;
      default:
        return <span className="badge" style={{ fontSize: '0.62rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>INFO</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Warehouse Event Logs & Real-Time Concurrency Audit
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ({snapshot.logs.length} Total Events)
          </span>
        </div>

        {/* Export and Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => exportSimulationToExcel(snapshot)}
            title="Export simulation logs to Excel (.xlsx)"
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-producer)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={14} />
            Excel
          </button>

          <button
            onClick={() => exportSimulationToPDF(snapshot)}
            title="Export simulation report to PDF (.pdf)"
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-danger)',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} />
            PDF
          </button>

          <button
            onClick={onClearLogs}
            title="Clear all event logs"
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-tertiary)',
            padding: '5px 10px',
            borderRadius: '8px',
            flex: '1',
            minWidth: '200px'
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search event messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              width: '100%'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PRODUCER', label: 'Producers' },
            { id: 'CONSUMER', label: 'Consumers' },
            { id: 'MUTEX', label: 'Mutex' },
            { id: 'SEMAPHORE', label: 'Semaphores' },
            { id: 'CRITICAL_SECTION', label: 'Critical Section' },
            { id: 'HAZARD', label: 'Race Hazards' },
            { id: 'SCENARIO', label: 'Scenarios' },
            { id: 'INFO', label: 'System' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              style={{
                padding: '4px 9px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: filterType === item.id ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: filterType === item.id ? '#ffffff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div
        style={{
          maxHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '6px'
        }}
      >
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '5px 8px',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                fontSize: '0.76rem',
                borderLeft:
                  log.type === 'HAZARD'
                    ? '3px solid var(--accent-danger)'
                    : log.type === 'PRODUCER'
                    ? '3px solid var(--accent-producer)'
                    : log.type === 'CONSUMER'
                    ? '3px solid var(--accent-consumer)'
                    : log.type === 'MUTEX'
                    ? '3px solid #ef4444'
                    : '3px solid var(--border-color)'
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0, marginTop: '2px' }}>
                {log.timestamp}
              </span>
              <div style={{ flexShrink: 0 }}>
                {getLogBadge(log.type)}
              </div>
              <span style={{ color: 'var(--text-primary)', wordBreak: 'break-word', flex: 1 }}>
                {log.message}
              </span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No event logs match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
