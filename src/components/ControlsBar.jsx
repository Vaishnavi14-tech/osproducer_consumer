import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Square,
  Gauge,
  Plus,
  Minus,
  Sparkles,
  AlertOctagon,
  Flame,
  CheckCircle2,
  Boxes,
  Truck,
  Layers,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { SIMULATION_SCENARIOS, SIMULATION_EXECUTION_MODES } from '../constants/productTypes';

export default function ControlsBar({
  snapshot,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onStep,
  onSetSpeed,
  onApplyScenario,
  onAddProducer,
  onAddConsumer,
  onAdjustProducerSpeed,
  onAdjustConsumerSpeed,
  onUpdateCapacity,
  onAutoGenerateProducers,
  onAutoGenerateConsumers,
  onInjectEmergencyOrder,
  onToggleAutoRestock
}) {
  const [capacityInput, setCapacityInput] = useState(snapshot.capacity);
  const [showConfigPopover, setShowConfigPopover] = useState(false);

  const handleCapacityChange = (newVal) => {
    const val = Math.max(40, Math.min(250, parseInt(newVal, 10) || 60));
    setCapacityInput(val);
    onUpdateCapacity(val);
  };

  return (
    <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Top Controls Row: Primary Playback, Speed, Capacity & Emergency Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        {/* Playback Controls Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {!snapshot.isRunning ? (
            <button
              onClick={onStart}
              style={{
                background: 'var(--accent-producer)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--glow-producer)'
              }}
            >
              <Play size={16} fill="#ffffff" />
              Start Simulation
            </button>
          ) : snapshot.isPaused ? (
            <button
              onClick={onResume}
              style={{
                background: 'var(--accent-producer)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--glow-producer)'
              }}
            >
              <Play size={16} fill="#ffffff" />
              Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              style={{
                background: 'var(--accent-warning)',
                color: '#0f172a',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Pause size={16} />
              Pause
            </button>
          )}

          <button
            onClick={onStop}
            disabled={!snapshot.isRunning}
            style={{
              background: 'var(--bg-tertiary)',
              color: snapshot.isRunning ? 'var(--accent-danger)' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: snapshot.isRunning ? 1 : 0.5,
              cursor: snapshot.isRunning ? 'pointer' : 'not-allowed'
            }}
          >
            <Square size={14} />
            Stop
          </button>

          <button
            onClick={onReset}
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          {/* OS Instruction Step-through */}
          <button
            onClick={onStep}
            title="Step through one OS instruction: Wait -> Lock -> Produce/Consume -> Unlock -> Signal"
            style={{
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <SkipForward size={14} />
            OS Step
          </button>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Gauge size={14} />
            <span>Speed:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
            {[0.5, 1.0, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: snapshot.simulationSpeed === s ? 'var(--accent-blue)' : 'transparent',
                  color: snapshot.simulationSpeed === s ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Warehouse Capacity Slider (40-250 units) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-tertiary)', padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Boxes size={15} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Capacity:
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="250"
            step="10"
            value={snapshot.capacity}
            onChange={(e) => handleCapacityChange(e.target.value)}
            style={{ width: '100px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-blue)', minWidth: '35px' }}>
            {snapshot.capacity}
          </span>
        </div>

        {/* Quick Fleet Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Emergency Orders Button */}
          <button
            onClick={onInjectEmergencyOrder}
            title="Inject Emergency Orders: Urgent Priority Consumers"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.35)'
            }}
          >
            <AlertOctagon size={13} />
            Emergency Order
          </button>

          {/* Auto Restocking Toggle */}
          <button
            onClick={onToggleAutoRestock}
            style={{
              background: snapshot.isAutoRestockEnabled ? 'var(--accent-producer-bg)' : 'var(--bg-tertiary)',
              color: snapshot.isAutoRestockEnabled ? 'var(--accent-producer)' : 'var(--text-secondary)',
              border: `1px solid ${snapshot.isAutoRestockEnabled ? 'var(--accent-producer)' : 'var(--border-color)'}`,
              padding: '6px 11px',
              borderRadius: '7px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RefreshCw size={13} style={{ animation: snapshot.isAutoRestockEnabled ? 'spinSlow 6s linear infinite' : 'none' }} />
            Auto-Restock {snapshot.isAutoRestockEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Middle Row: Producer/Consumer Speed Controls & Auto-Generate */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '4px', borderTop: '1px solid var(--border-color)' }}>
        {/* Producer Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-producer)', textTransform: 'uppercase' }}>
            Producers:
          </span>
          <button
            onClick={onAutoGenerateProducers}
            style={{
              background: 'var(--accent-producer-bg)',
              color: 'var(--accent-producer)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={12} /> Auto +3 Producers
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onAdjustProducerSpeed(0.8)}
              title="Increase Producer Speed (faster cycles)"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ArrowUp size={11} /> Speed Up
            </button>
            <button
              onClick={() => onAdjustProducerSpeed(1.25)}
              title="Decrease Producer Speed (slower cycles)"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ArrowDown size={11} /> Slow Down
            </button>
          </div>
        </div>

        {/* Consumer Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-consumer)', textTransform: 'uppercase' }}>
            Consumers:
          </span>
          <button
            onClick={onAutoGenerateConsumers}
            style={{
              background: 'var(--accent-consumer-bg)',
              color: 'var(--accent-consumer)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={12} /> Auto +3 Consumers
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onAdjustConsumerSpeed(0.8)}
              title="Increase Consumer Speed (faster dispatches)"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ArrowUp size={11} /> Speed Up
            </button>
            <button
              onClick={() => onAdjustConsumerSpeed(1.25)}
              title="Decrease Consumer Speed (slower dispatches)"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ArrowDown size={11} /> Slow Down
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: The 7 Standard OS Scenarios Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '3px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', flexShrink: 0 }}>
          Scenarios:
        </span>
        {SIMULATION_SCENARIOS.map((sc) => {
          const isSelected = snapshot.currentScenario?.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onApplyScenario(sc.id)}
              title={`${sc.name}\n${sc.description}`}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: isSelected ? 700 : 500,
                whiteSpace: 'nowrap',
                background: isSelected ? `${sc.badgeColor}22` : 'var(--bg-tertiary)',
                color: isSelected ? sc.badgeColor : 'var(--text-secondary)',
                border: `1px solid ${isSelected ? sc.badgeColor : 'var(--border-color)'}`,
                transition: 'all 150ms ease'
              }}
            >
              {sc.statusText}
            </button>
          );
        })}
      </div>
    </div>
  );
}
