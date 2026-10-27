import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  FileCode,
  X,
  CheckCircle,
  Printer,
  Download,
  TrendingUp,
  Layers,
  Calendar,
  ShieldCheck,
  Flame,
  Boxes
} from 'lucide-react';
import { exportSimulationToExcel, exportSimulationToPDF, exportSimulationToCSV, REPORT_TYPES } from '../engine/exportUtils';

export default function ReportModal({ isOpen, onClose, snapshot }) {
  if (!isOpen) return null;

  const [selectedReportId, setSelectedReportId] = useState('DAILY');
  const activeReport = REPORT_TYPES.find(r => r.id === selectedReportId) || REPORT_TYPES[0];

  const handleExport = (format) => {
    if (format === 'EXCEL') {
      exportSimulationToExcel(snapshot, selectedReportId);
    } else if (format === 'PDF') {
      exportSimulationToPDF(snapshot, selectedReportId);
    } else if (format === 'CSV') {
      exportSimulationToCSV(snapshot, selectedReportId);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', height: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-tertiary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '6px',
                borderRadius: '8px',
                background: 'var(--accent-blue)',
                color: '#ffffff'
              }}
            >
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Warehouse Simulation Reports Suite
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                9 Standardized Operational & Synchronization Reports &bull; PDF, CSV, Excel Exports
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Report Selection Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 1.4rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            overflowX: 'auto'
          }}
        >
          {REPORT_TYPES.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReportId(r.id)}
              style={{
                padding: '5px 11px',
                borderRadius: '7px',
                fontSize: '0.72rem',
                fontWeight: selectedReportId === r.id ? 800 : 500,
                whiteSpace: 'nowrap',
                background: selectedReportId === r.id ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                color: selectedReportId === r.id ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${selectedReportId === r.id ? 'var(--accent-blue)' : 'var(--border-color)'}`
              }}
            >
              {r.id}
            </button>
          ))}
        </div>

        {/* Report Preview Body */}
        <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Active Report Header Card */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeReport.title}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                {activeReport.description}
              </p>
            </div>

            {/* Export Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleExport('PDF')}
                style={{
                  background: 'var(--accent-danger)',
                  color: '#ffffff',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={14} /> Export PDF
              </button>
              <button
                onClick={() => handleExport('EXCEL')}
                style={{
                  background: 'var(--accent-producer)',
                  color: '#ffffff',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileSpreadsheet size={14} /> Export Excel
              </button>
              <button
                onClick={() => handleExport('CSV')}
                style={{
                  background: 'var(--accent-blue)',
                  color: '#ffffff',
                  padding: '7px 12px',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Metric Highlights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '9px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>BUFFER UTILIZATION</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-blue)' }}>
                {snapshot.itemCount} / {snapshot.capacity} ({snapshot.occupancyPercentage}%)
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '9px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL PRODUCED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-producer)' }}>
                {snapshot.stats.totalProduced} units
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '9px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL CONSUMED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-consumer)' }}>
                {snapshot.stats.totalConsumed} units
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '9px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONCURRENCY HAZARDS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: snapshot.stats.raceHazardsDetected > 0 ? 'var(--accent-danger)' : 'var(--accent-producer)' }}>
                {snapshot.stats.raceHazardsDetected}
              </div>
            </div>
          </div>

          {/* Detailed Audit Table */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>Audit Metric</th>
                  <th style={{ padding: '8px 12px' }}>Observed Result</th>
                  <th style={{ padding: '8px 12px' }}>OS Concept Evaluation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Empty Semaphore</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.syncState.semaphore.empty} free spaces</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Tracks space availability for incoming suppliers</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Full Semaphore</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.syncState.semaphore.full} items in buffer</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Signals available inventory to waiting customer couriers</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Mutex Lock</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.syncState.semaphore.mutex === 1 ? 'UNLOCKED (1)' : 'LOCKED (0)'}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Enforces mutual exclusion on warehouse inventory buffer</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Throughput Rate</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.stats.currentThroughput.toFixed(1)} items/s</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Mean rate of items placed and removed per second</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Producer Wait Latency</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.stats.avgProducerWaitTimeMs} ms</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Time spent blocked on wait(empty) or wait(mutex)</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>Consumer Wait Latency</td>
                  <td style={{ padding: '8px 12px' }}>{snapshot.stats.avgConsumerWaitTimeMs} ms</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Time spent blocked on wait(full) or wait(mutex)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
