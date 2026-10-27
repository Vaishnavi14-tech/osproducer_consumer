import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  Lightbulb,
  Boxes
} from 'lucide-react';
import { simulationEngine } from '../engine/simulationEngine';

export default function AiRecommendationsPanel({ snapshot, onApplyScenario }) {
  const recommendations = simulationEngine.getAiRecommendations();
  const forecast = simulationEngine.getInventoryForecast();
  const { occupancyPercentage, itemCount, capacity, isAutoRestockEnabled } = snapshot;

  const isLowStock = occupancyPercentage <= 15 && snapshot.isRunning;
  const isOverstock = occupancyPercentage >= 85;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              color: 'var(--accent-consumer)'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              AI Inventory Forecasting & Performance Optimization
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Real-Time Demand Prediction &bull; Smart Warehouse Alerts &bull; Bottleneck Optimization Heuristics
            </p>
          </div>
        </div>

        {/* Smart Alerts Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLowStock && (
            <span className="badge badge-warning" style={{ animation: 'pulseGlow 1.2s infinite' }}>
              <AlertTriangle size={13} />
              LOW STOCK WARNING (&lt;15%)
            </span>
          )}
          {isOverstock && (
            <span className="badge badge-danger" style={{ animation: 'dangerFlash 1.2s infinite' }}>
              <AlertTriangle size={13} />
              OVERSTOCK WARNING (&gt;85%)
            </span>
          )}
          {!isLowStock && !isOverstock && (
            <span className="badge badge-producer">
              <CheckCircle2 size={13} />
              INVENTORY STABLE (OPTIMAL ZONE)
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Content: Left = Forecasting, Right = AI Recommendations */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Column 1: Inventory Forecasting & Demand Prediction */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Demand Prediction & Velocity Forecast
            </span>
          </div>

          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Velocity Differential (Supply vs Dispatch)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  color: forecast.rateDiff > 0 ? 'var(--accent-producer)' : forecast.rateDiff < 0 ? 'var(--accent-consumer)' : 'var(--accent-blue)'
                }}
              >
                {forecast.rateDiff > 0 ? `+${forecast.rateDiff}` : `${forecast.rateDiff}`}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>units / sec</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {forecast.forecastText}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              <span>Current Supply Velocity:</span>
              <strong style={{ color: 'var(--accent-producer)' }}>{snapshot.stats.productionRate} units/s</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
              <span>Current Dispatch Velocity:</span>
              <strong style={{ color: 'var(--accent-consumer)' }}>{snapshot.stats.consumptionRate} units/s</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Auto-Restock System:</span>
              <strong style={{ color: isAutoRestockEnabled ? 'var(--accent-producer)' : 'var(--text-muted)' }}>
                {isAutoRestockEnabled ? 'ENABLED (Standby)' : 'DISABLED'}
              </strong>
            </div>
          </div>
        </div>

        {/* Column 2: AI Optimization Suggestions */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={16} style={{ color: 'var(--accent-warning)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              AI Performance Suggestions & Bottleneck Diagnostics
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations.map((rec, idx) => {
              const borderCol =
                rec.type === 'DANGER'
                  ? 'rgba(239, 68, 68, 0.4)'
                  : rec.type === 'WARNING'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : rec.type === 'OPTIMAL'
                  ? 'rgba(16, 185, 129, 0.4)'
                  : 'var(--border-color)';

              const titleCol =
                rec.type === 'DANGER'
                  ? 'var(--accent-danger)'
                  : rec.type === 'WARNING'
                  ? 'var(--accent-warning)'
                  : rec.type === 'OPTIMAL'
                  ? 'var(--accent-producer)'
                  : 'var(--accent-blue)';

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: `1px solid ${borderCol}`,
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: titleCol, marginBottom: '2px' }}>
                    {rec.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {rec.message}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
