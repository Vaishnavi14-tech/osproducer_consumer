import React from 'react';
import { AlertOctagon, RotateCcw, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

export default function DeadlockBanner({ snapshot, onBreakDeadlock }) {
  if (!snapshot.stats.deadlockDetected) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.9))',
        border: '2px solid var(--accent-danger)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        boxShadow: 'var(--glow-danger)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        animation: 'dangerFlash 1.5s infinite'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'var(--accent-danger)',
              color: '#ffffff'
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--accent-danger)' }}>
              CRITICAL DEADLOCK DETECTED (Resource Allocation Graph Cycle)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              All progress halted due to circular wait between Producer and Consumer threads.
            </p>
          </div>
        </div>

        <button
          onClick={onBreakDeadlock}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            background: 'var(--accent-danger)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
          }}
        >
          <RotateCcw size={15} />
          Break Deadlock (Preempt & Reschedule)
        </button>
      </div>

      {/* Resource Allocation Graph Cycle Visualization */}
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <span style={{ color: 'var(--accent-producer)', fontWeight: 700 }}>[Producer P1]</span>
        <span style={{ color: 'var(--text-muted)' }}>holds Res A &rarr; waits for Res B &rarr;</span>
        <span style={{ color: 'var(--accent-consumer)', fontWeight: 700 }}>[Consumer C1]</span>
        <span style={{ color: 'var(--text-muted)' }}>holds Res B &rarr; waits for Res A &rarr;</span>
        <span style={{ color: 'var(--accent-danger)', fontWeight: 800 }}>CYCLE CLOSED!</span>
      </div>
    </div>
  );
}
