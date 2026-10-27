import React from 'react';
import {
  Boxes,
  TrendingUp,
  PackageCheck,
  PackagePlus,
  Clock,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  CheckCircle2,
  Layers,
  Zap,
  Activity
} from 'lucide-react';
import { THREAD_STATES } from '../constants/productTypes';

export default function StatsPanel({ snapshot }) {
  const {
    stats,
    itemCount,
    capacity,
    occupancyPercentage,
    producers,
    consumers,
    criticalSection,
    currentScenario,
    syncAlgorithm,
    syncState,
    executionMode
  } = snapshot;

  const emptySlots = Math.max(0, capacity - itemCount);
  const activeProducers = producers.length;
  const activeConsumers = consumers.length;
  const waitingProducers = producers.filter(p => p.state === THREAD_STATES.WAITING || p.state === THREAD_STATES.BLOCKED).length;
  const waitingConsumers = consumers.filter(c => c.state === THREAD_STATES.WAITING || c.state === THREAD_STATES.BLOCKED).length;

  const allThreads = [...producers, ...consumers];
  const runningThreads = allThreads.filter(t => t.state === THREAD_STATES.RUNNING).length;
  const blockedThreads = allThreads.filter(t => t.state === THREAD_STATES.BLOCKED).length;

  const isDeadlock = stats.deadlockDetected;
  const isRaceActive = executionMode === 'RACE_CONDITION';

  const healthStatus = isDeadlock
    ? { text: 'DEADLOCK DETECTED', color: 'var(--accent-danger)', bg: 'var(--accent-danger-bg)', icon: ShieldAlert }
    : isRaceActive
    ? { text: 'CRITICAL: RACE CONDITION ACTIVE', color: 'var(--accent-danger)', bg: 'var(--accent-danger-bg)', icon: ShieldAlert }
    : occupancyPercentage >= 95
    ? { text: 'WARNING: BUFFER SATURATION', color: 'var(--accent-warning)', bg: 'var(--accent-warning-bg)', icon: AlertTriangle }
    : occupancyPercentage <= 5 && snapshot.isRunning
    ? { text: 'WARNING: BUFFER STARVATION', color: 'var(--accent-warning)', bg: 'var(--accent-warning-bg)', icon: AlertTriangle }
    : { text: 'HEALTHY: SYSTEM SYNCHRONIZED', color: 'var(--accent-producer)', bg: 'var(--accent-producer-bg)', icon: ShieldCheck };

  const csOccupied = criticalSection?.isOccupied;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Top Real-Time System Status & Scenario Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))'
        }}
      >
        {/* Scenario Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={15} style={{ color: currentScenario?.badgeColor || 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Scenario:
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentScenario?.name || 'Scenario 1'}
            </span>
          </div>

          <div
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: currentScenario?.badgeColor ? `${currentScenario.badgeColor}22` : 'var(--accent-blue-light)',
              color: currentScenario?.badgeColor || 'var(--accent-blue)',
              border: `1px solid ${currentScenario?.badgeColor || 'var(--accent-blue)'}44`
            }}
          >
            Status: {currentScenario?.statusText || 'Balanced Warehouse'}
          </div>
        </div>

        {/* Live Critical Section Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              borderRadius: '8px',
              background: csOccupied ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
              border: csOccupied ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
              color: csOccupied ? 'var(--accent-danger)' : 'var(--accent-producer)'
            }}
          >
            {csOccupied ? <Lock size={15} /> : <Unlock size={15} />}
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
              Critical Section:{' '}
              {csOccupied
                ? `OCCUPIED by ${criticalSection.threadId} (${criticalSection.action === 'ADD_PRODUCT' ? 'Storing' : 'Removing'})`
                : 'FREE / UNLOCKED'}
            </span>
          </div>

          {/* System Health Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              background: healthStatus.bg,
              border: `1px solid ${healthStatus.color}44`,
              color: healthStatus.color,
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <healthStatus.icon size={15} />
            <span>{healthStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (All 17 Required OS & Warehouse Metrics) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {/* 1. Warehouse Capacity */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Warehouse Capacity
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{capacity}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>slots</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
            Configurable 40-250
          </div>
        </div>

        {/* 2. Current Inventory */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Inventory
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{itemCount}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ {capacity}</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Full Slots: <strong>{itemCount}</strong>
          </div>
        </div>

        {/* 3. Available Empty Slots */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Available Empty Slots
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: emptySlots > 0 ? 'var(--accent-producer)' : 'var(--accent-danger)' }}>
              {emptySlots}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>free</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Empty Semaphore: <strong>{syncState.semaphore.empty}</strong>
          </div>
        </div>

        {/* 4. Warehouse Utilization % */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Utilization Rate
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: occupancyPercentage >= 90 ? 'var(--accent-danger)' : occupancyPercentage <= 15 ? 'var(--accent-warning)' : 'var(--accent-cyan)'
              }}
            >
              {occupancyPercentage}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '5px',
              background: 'var(--bg-tertiary)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '4px'
            }}
          >
            <div
              style={{
                width: `${occupancyPercentage}%`,
                height: '100%',
                background:
                  occupancyPercentage >= 90
                    ? 'var(--accent-danger)'
                    : occupancyPercentage <= 15
                    ? 'var(--accent-warning)'
                    : 'var(--accent-cyan)',
                borderRadius: '999px',
                transition: 'width 200ms ease'
              }}
            />
          </div>
        </div>

        {/* 5. Active & Waiting Producers */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-producer)', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Producers
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-producer)' }}>{activeProducers}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>threads</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: waitingProducers > 0 ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
            Waiting: <strong>{waitingProducers}</strong>
          </div>
        </div>

        {/* 6. Active & Waiting Consumers */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-consumer)', fontWeight: 700, textTransform: 'uppercase' }}>
            Active Consumers
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-consumer)' }}>{activeConsumers}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>threads</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: waitingConsumers > 0 ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
            Waiting: <strong>{waitingConsumers}</strong>
          </div>
        </div>

        {/* 7. Running & Blocked Threads */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Thread States
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-producer)' }}>{runningThreads}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Running</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: blockedThreads > 0 ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
              /{blockedThreads}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Blocked</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Ready: {stats.readyThreadsCount} &bull; Sleeping: {stats.sleepingThreadsCount}
          </div>
        </div>

        {/* 8. Total Produced & Rate */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-producer)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Produced
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-producer)' }}>{stats.totalProduced}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Rate: <strong>{stats.productionRate}</strong>/s
          </div>
        </div>

        {/* 9. Total Consumed & Rate */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-consumer)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Consumed
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-consumer)' }}>{stats.totalConsumed}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Rate: <strong>{stats.consumptionRate}</strong>/s
          </div>
        </div>

        {/* 10. Throughput Rate */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
            Throughput Rate
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
              {stats.currentThroughput.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>items/s</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Peak Fill: <strong>{stats.peakOccupancy}</strong> slots
          </div>
        </div>

        {/* 11. Average Waiting Time */}
        <div className="glass-panel" style={{ padding: '0.75rem 0.9rem' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Avg Waiting Time
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '3px 0' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: stats.avgProducerWaitTimeMs > 2000 ? 'var(--accent-warning)' : 'var(--text-primary)' }}>
              {stats.avgProducerWaitTimeMs}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Consumer Wait: <strong>{stats.avgConsumerWaitTimeMs}ms</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
