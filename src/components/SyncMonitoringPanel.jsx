import React from 'react';
import {
  Lock,
  Unlock,
  Radio,
  Layers,
  Clock,
  Activity,
  Users,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Database,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SYNCHRONIZATION_MODES, THREAD_STATES } from '../constants/productTypes';

export default function SyncMonitoringPanel({ snapshot }) {
  const {
    syncAlgorithm,
    syncState,
    criticalSection,
    producers,
    consumers,
    capacity,
    itemCount,
    threadTimeline,
    executionMode
  } = snapshot;

  const sem = syncState.semaphore;
  const isMutexLocked = sem.mutex === 0 || criticalSection.isOccupied;
  const isRaceActive = executionMode === 'RACE_CONDITION';

  const runningThreads = [...producers, ...consumers].filter(t => t.state === THREAD_STATES.RUNNING);
  const waitingThreads = [...producers, ...consumers].filter(t => t.state === THREAD_STATES.WAITING);
  const blockedThreads = [...producers, ...consumers].filter(t => t.state === THREAD_STATES.BLOCKED);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Operating System Synchronization & Resource Monitor
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live Telemetry of Semaphores, Mutex Locks, Thread Wait Queues & Critical Section Execution
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="badge"
            style={{
              background: isRaceActive ? 'var(--accent-danger-bg)' : 'var(--accent-producer-bg)',
              color: isRaceActive ? 'var(--accent-danger)' : 'var(--accent-producer)',
              border: '1px solid currentColor',
              fontWeight: 800
            }}
          >
            {isRaceActive ? '⚠ MUTEX DISABLED (RACE MODE)' : `SYNCHRONIZED: ${syncAlgorithm}`}
          </span>
        </div>
      </div>

      {/* Primary 3-Card Row: Mutex Lock, Empty Semaphore, Full Semaphore */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Card 1: Mutex Lock Primitive Status */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${isMutexLocked ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '7px',
                  background: isMutexLocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                  color: isMutexLocked ? 'var(--accent-danger)' : 'var(--accent-producer)'
                }}
              >
                {isMutexLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Mutex Lock Status
              </span>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                background: isMutexLocked ? 'var(--accent-danger-bg)' : 'var(--accent-producer-bg)',
                color: isMutexLocked ? 'var(--accent-danger)' : 'var(--accent-producer)'
              }}
            >
              {isMutexLocked ? 'LOCKED' : 'UNLOCKED'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: isMutexLocked ? 'var(--accent-danger)' : 'var(--accent-producer)' }}>
              {isMutexLocked ? '0' : '1'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              (Binary Semaphore: {isMutexLocked ? 'Occupied / Locked' : 'Free / Unlocked'})
            </span>
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Current Lock Holder:{' '}
            <strong style={{ color: isMutexLocked ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
              {criticalSection.threadId ? `${criticalSection.threadId} (${criticalSection.threadName})` : 'None (Lock Available)'}
            </strong>
          </div>

          {/* Mutex Wait Queue */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Mutex Wait Queue ({sem.mutexWaitQueue.length} threads):
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {sem.mutexWaitQueue.length > 0 ? (
                sem.mutexWaitQueue.map(tId => (
                  <span
                    key={tId}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '5px',
                      background: 'var(--accent-warning-bg)',
                      color: 'var(--accent-warning)',
                      border: '1px solid rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    {tId}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>No threads waiting for lock</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Empty Semaphore (Storage Free Spaces) */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '7px',
                  background: 'var(--accent-producer-bg)',
                  color: 'var(--accent-producer)'
                }}
              >
                <Database size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Empty Semaphore
              </span>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '999px',
                background: sem.empty <= 0 ? 'var(--accent-danger-bg)' : 'var(--accent-producer-bg)',
                color: sem.empty <= 0 ? 'var(--accent-danger)' : 'var(--accent-producer)'
              }}
            >
              {sem.empty <= 0 ? 'SATURATED (0)' : `${sem.empty} Available`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: sem.empty <= 0 ? 'var(--accent-danger)' : 'var(--accent-producer)' }}>
              {sem.empty}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              of {capacity} storage slots free
            </span>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
            Decrements when products arrive via wait(empty). Increments when consumed via signal(empty).
          </p>

          {/* Producer FIFO Queue waiting for empty slots */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Producer Queue on wait(empty) ({sem.emptyWaitQueue.length} blocked):
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {sem.emptyWaitQueue.length > 0 ? (
                sem.emptyWaitQueue.map(pId => (
                  <span
                    key={pId}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '5px',
                      background: 'var(--accent-danger-bg)',
                      color: 'var(--accent-danger)',
                      border: '1px solid rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    {pId} (Blocked)
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>0 producers waiting</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Full Semaphore (Available Products in Storage) */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '7px',
                  background: 'var(--accent-consumer-bg)',
                  color: 'var(--accent-consumer)'
                }}
              >
                <Layers size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Full Semaphore
              </span>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '999px',
                background: sem.full <= 0 ? 'var(--accent-danger-bg)' : 'var(--accent-consumer-bg)',
                color: sem.full <= 0 ? 'var(--accent-danger)' : 'var(--accent-consumer)'
              }}
            >
              {sem.full <= 0 ? 'DEPLETED (0)' : `${sem.full} In Stock`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: sem.full <= 0 ? 'var(--accent-danger)' : 'var(--accent-consumer)' }}>
              {sem.full}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              units currently stored in buffer
            </span>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
            Increments when suppliers finish via signal(full). Decrements when consumers pick via wait(full).
          </p>

          {/* Consumer FIFO Queue waiting for products */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Consumer Queue on wait(full) ({sem.fullWaitQueue.length} blocked):
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {sem.fullWaitQueue.length > 0 ? (
                sem.fullWaitQueue.map(cId => (
                  <span
                    key={cId}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '5px',
                      background: 'var(--accent-danger-bg)',
                      color: 'var(--accent-danger)',
                      border: '1px solid rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    {cId} (Blocked)
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>0 consumers waiting</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Thread Access Timeline & Resource Allocation Matrix */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
          gap: '1rem'
        }}
      >
        {/* Thread Access Timeline (Gantt-Style Rolling Stream) */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Thread Access Timeline (Gantt Execution Stream)
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Rolling Real-Time Telemetry
            </span>
          </div>

          <div
            style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px'
            }}
          >
            {threadTimeline.length > 0 ? (
              threadTimeline.slice(0, 15).map(event => {
                const isProd = event.threadType === 'producer';
                const isBlocked = event.action === 'BLOCKED';

                return (
                  <div
                    key={event.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '7px',
                      padding: '5px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.66rem' }}>
                        {event.time}
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: isProd ? 'var(--accent-producer-bg)' : 'var(--accent-consumer-bg)',
                          color: isProd ? 'var(--accent-producer)' : 'var(--accent-consumer)'
                        }}
                      >
                        {event.threadId}
                      </span>
                      <span style={{ color: isBlocked ? 'var(--accent-danger)' : 'var(--text-primary)', fontWeight: 600 }}>
                        {event.action}
                      </span>
                      {event.slotIndex !== null && (
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>
                          Slot [{event.slotIndex}]
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                      {event.details}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '1.5rem' }}>
                No thread execution events recorded yet. Start simulation to observe timeline.
              </div>
            )}
          </div>
        </div>

        {/* Resource Allocation Monitor (Matrix of Thread vs Mutex vs Buffer) */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Resource Allocation Matrix
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '6px' }}>Thread</th>
                  <th style={{ padding: '6px' }}>State</th>
                  <th style={{ padding: '6px' }}>Mutex Lock</th>
                  <th style={{ padding: '6px' }}>Buffer Access</th>
                </tr>
              </thead>
              <tbody>
                {[...producers, ...consumers].slice(0, 7).map(t => {
                  const hasLock = criticalSection.threadId === t.id;
                  const isBlocked = t.state === THREAD_STATES.BLOCKED;

                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '5px 6px', fontWeight: 700 }}>
                        {t.id} ({t.type === 'producer' ? 'Supplier' : 'Courier'})
                      </td>
                      <td style={{ padding: '5px 6px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              t.state === THREAD_STATES.RUNNING
                                ? 'var(--accent-producer)'
                                : isBlocked
                                ? 'var(--accent-danger)'
                                : 'var(--text-secondary)'
                          }}
                        >
                          {t.state}
                        </span>
                      </td>
                      <td style={{ padding: '5px 6px' }}>
                        {hasLock ? (
                          <span style={{ color: 'var(--accent-danger)', fontWeight: 800 }}>HELD</span>
                        ) : isBlocked ? (
                          <span style={{ color: 'var(--text-muted)' }}>WAITING</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>RELEASED</span>
                        )}
                      </td>
                      <td style={{ padding: '5px 6px' }}>
                        {hasLock ? (
                          <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>Slot [{criticalSection.slotIndex}]</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
