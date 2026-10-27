import React from 'react';
import {
  Flame,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileWarning,
  Bug,
  HelpCircle
} from 'lucide-react';
import { SIMULATION_EXECUTION_MODES } from '../constants/productTypes';

export default function RaceConditionAlert({ snapshot, onToggleRaceCondition }) {
  const isRaceEnabled = snapshot.executionMode === SIMULATION_EXECUTION_MODES.RACE_CONDITION;
  const { raceHazards, stats, itemCount, actualStoredCount } = snapshot;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.1rem 1.4rem',
        border: isRaceEnabled ? '2px solid rgba(239, 68, 68, 0.6)' : '1px solid var(--border-color)',
        background: isRaceEnabled
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.05))'
          : 'var(--bg-secondary)',
        transition: 'all 250ms ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Left Side: Alert Banner & Toggle Explanation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: isRaceEnabled ? 'var(--accent-danger)' : 'var(--accent-producer)',
              color: '#ffffff',
              boxShadow: isRaceEnabled ? 'var(--glow-danger)' : 'var(--glow-producer)'
            }}
          >
            {isRaceEnabled ? <Flame size={24} style={{ animation: 'pulseGlow 1s infinite' }} /> : <ShieldCheck size={24} />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                {isRaceEnabled ? '⚠ Race Condition Detected' : '✅ System Synchronized'}
              </h3>
              <span
                className="badge"
                style={{
                  fontSize: '0.68rem',
                  background: isRaceEnabled ? 'var(--accent-danger-bg)' : 'var(--accent-producer-bg)',
                  color: isRaceEnabled ? 'var(--accent-danger)' : 'var(--accent-producer)',
                  border: '1px solid currentColor',
                  fontWeight: 800
                }}
              >
                {isRaceEnabled ? 'MUTEX DISABLED' : 'MUTEX LOCK ACTIVE'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              {isRaceEnabled
                ? 'Multiple threads are accessing shared warehouse inventory concurrently without critical section locks. Data inconsistency and lost updates are actively simulated.'
                : 'Mutual exclusion is strictly enforced. Only one thread can enter the critical section to update inventory at any given time.'}
            </p>
          </div>
        </div>

        {/* Right Side: Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onToggleRaceCondition(!isRaceEnabled)}
            style={{
              background: isRaceEnabled ? 'var(--accent-producer)' : 'var(--accent-danger)',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isRaceEnabled ? 'var(--glow-producer)' : 'var(--glow-danger)'
            }}
          >
            {isRaceEnabled ? <ShieldCheck size={16} /> : <Flame size={16} />}
            {isRaceEnabled ? 'Disable Race Condition (Restore Sync)' : 'Enable Race Condition (Demonstrate Flaws)'}
          </button>
        </div>
      </div>

      {/* Race Hazards Telemetry Cards (Displayed when active or hazards recorded) */}
      {isRaceEnabled && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {/* Lost Updates */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Lost Updates
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-danger)', margin: '2px 0' }}>
              {raceHazards.lostUpdates}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              Overwritten by concurrent writes
            </div>
          </div>

          {/* Duplicate Inventory Entries */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Duplicate Entries
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-warning)', margin: '2px 0' }}>
              {raceHazards.duplicateEntries}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              Simultaneous slot collisions
            </div>
          </div>

          {/* Data Inconsistency Errors */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Data Inconsistency
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-danger)', margin: '2px 0' }}>
              {raceHazards.dataConsistencyErrors}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              Dirty reads & underflow collisions
            </div>
          </div>

          {/* Incorrect Stock Counts */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Stock Count Mismatch
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-danger)', margin: '2px 0' }}>
              {raceHazards.stockMismatch}
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              Tracked: {itemCount} &bull; Actual: {actualStoredCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
