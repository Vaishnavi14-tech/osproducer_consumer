import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Pause,
  Play,
  Square,
  Sliders,
  Shield,
  Gauge,
  UserCheck,
  Truck,
  Cpu,
  PackagePlus,
  PackageCheck
} from 'lucide-react';
import { PRODUCT_CATEGORIES, THREAD_STATES } from '../constants/productTypes';

function renderStateBadge(state) {
  let bg = 'var(--bg-tertiary)';
  let color = 'var(--text-secondary)';

  switch (state) {
    case THREAD_STATES.RUNNING:
      bg = 'var(--accent-producer-bg)';
      color = 'var(--accent-producer)';
      break;
    case THREAD_STATES.WAITING:
      bg = 'var(--accent-warning-bg)';
      color = 'var(--accent-warning)';
      break;
    case THREAD_STATES.BLOCKED:
      bg = 'var(--accent-danger-bg)';
      color = 'var(--accent-danger)';
      break;
    case THREAD_STATES.READY:
      bg = 'var(--accent-blue-light)';
      color = 'var(--accent-blue)';
      break;
    case THREAD_STATES.SLEEPING:
      bg = 'var(--accent-consumer-bg)';
      color = 'var(--accent-consumer)';
      break;
    default:
      break;
  }

  return (
    <span
      style={{
        fontSize: '0.66rem',
        fontWeight: 800,
        padding: '2px 7px',
        borderRadius: '999px',
        textTransform: 'uppercase',
        background: bg,
        color: color,
        border: `1px solid ${color}44`
      }}
    >
      {state || THREAD_STATES.READY}
    </span>
  );
}

export default function ProducerConsumerManager({
  snapshot,
  onAddProducer,
  onRemoveProducer,
  onUpdateProducer,
  onAddConsumer,
  onRemoveConsumer,
  onUpdateConsumer
}) {
  const [activeTab, setActiveTab] = useState('producers'); // 'producers' or 'consumers'

  // New producer form state
  const [newPName, setNewPName] = useState('');
  const [newPSpeed, setNewPSpeed] = useState(1800);
  const [newPPriority, setNewPPriority] = useState(2);
  const [newPCategory, setNewPCategory] = useState('electronics');

  // New consumer form state
  const [newCName, setNewCName] = useState('');
  const [newCSpeed, setNewCSpeed] = useState(2000);
  const [newCPriority, setNewCPriority] = useState(2);

  const handleCreateProducer = (e) => {
    e.preventDefault();
    onAddProducer({
      name: newPName.trim() || undefined,
      speedMs: Number(newPSpeed),
      priority: Number(newPPriority),
      preferredCategory: newPCategory
    });
    setNewPName('');
  };

  const handleCreateConsumer = (e) => {
    e.preventDefault();
    onAddConsumer({
      name: newCName.trim() || undefined,
      speedMs: Number(newCSpeed),
      priority: Number(newCPriority)
    });
    setNewCName('');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('producers')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'producers' ? 'var(--accent-producer)' : 'var(--bg-tertiary)',
              color: activeTab === 'producers' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'producers' ? 'var(--glow-producer)' : 'none'
            }}
          >
            <PackagePlus size={16} />
            Producer Threads ({snapshot.producers.length})
          </button>

          <button
            onClick={() => setActiveTab('consumers')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeTab === 'consumers' ? 'var(--accent-consumer)' : 'var(--bg-tertiary)',
              color: activeTab === 'consumers' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeTab === 'consumers' ? 'var(--glow-consumer)' : 'none'
            }}
          >
            <PackageCheck size={16} />
            Consumer Threads ({snapshot.consumers.length})
          </button>
        </div>

        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Operating System Thread Management & State Inspection
        </div>
      </div>

      {/* Tab 1: Producers Panel */}
      {activeTab === 'producers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Add Producer Form */}
          <form
            onSubmit={handleCreateProducer}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr)) 80px',
              alignItems: 'flex-end',
              gap: '10px'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                PRODUCER NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Foxconn Supplier Alpha"
                value={newPName}
                onChange={(e) => setNewPName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                SPEED: {newPSpeed}ms
              </label>
              <input
                type="range"
                min="400"
                max="5000"
                step="100"
                value={newPSpeed}
                onChange={(e) => setNewPSpeed(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-producer)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                PRIORITY
              </label>
              <select
                value={newPPriority}
                onChange={(e) => setNewPPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem'
                }}
              >
                <option value="1">1 - Low</option>
                <option value="2">2 - Normal</option>
                <option value="3">3 - High</option>
                <option value="4">4 - Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                CATEGORY
              </label>
              <select
                value={newPCategory}
                onChange={(e) => setNewPCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem'
                }}
              >
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: 'var(--accent-producer)',
                color: '#ffffff',
                padding: '7px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '32px'
              }}
            >
              <Plus size={15} /> Add
            </button>
          </form>

          {/* Producers Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px'
            }}
          >
            {snapshot.producers.map((producer) => (
              <div
                key={producer.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-producer" style={{ fontSize: '0.7rem' }}>
                      {producer.id}
                    </span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {producer.name}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {renderStateBadge(producer.state)}
                    <button
                      onClick={() => onRemoveProducer(producer.id)}
                      title="Decommission Producer"
                      style={{
                        padding: '4px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        color: 'var(--accent-danger)'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Speed Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    <span>Cycle Speed</span>
                    <strong>{producer.speedMs} ms / item</strong>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="5000"
                    step="100"
                    value={producer.speedMs}
                    onChange={(e) => onUpdateProducer(producer.id, { speedMs: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--accent-producer)' }}
                  />
                </div>

                {/* Priority Selector & Metric Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Priority:</span>
                    <select
                      value={producer.priority}
                      onChange={(e) => onUpdateProducer(producer.id, { priority: Number(e.target.value) })}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        fontSize: '0.7rem',
                        padding: '2px 4px'
                      }}
                    >
                      <option value="1">1 Low</option>
                      <option value="2">2 Normal</option>
                      <option value="3">3 High</option>
                      <option value="4">4 Urgent</option>
                    </select>
                  </div>

                  <div style={{ color: 'var(--text-muted)' }}>
                    Produced: <strong style={{ color: 'var(--accent-producer)' }}>{producer.itemsProduced}</strong> &bull; Wait: {Math.round(producer.totalWaitTimeMs)}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Consumers Panel */}
      {activeTab === 'consumers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Add Consumer Form */}
          <form
            onSubmit={handleCreateConsumer}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) 80px',
              alignItems: 'flex-end',
              gap: '10px'
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                CONSUMER NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Express Courier Beta"
                value={newCName}
                onChange={(e) => setNewCName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                SPEED: {newCSpeed}ms
              </label>
              <input
                type="range"
                min="400"
                max="5000"
                step="100"
                value={newCSpeed}
                onChange={(e) => setNewCSpeed(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-consumer)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                PRIORITY
              </label>
              <select
                value={newCPriority}
                onChange={(e) => setNewCPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.78rem'
                }}
              >
                <option value="1">1 - Low</option>
                <option value="2">2 - Normal</option>
                <option value="3">3 - High</option>
                <option value="4">4 - Urgent</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: 'var(--accent-consumer)',
                color: '#ffffff',
                padding: '7px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                height: '32px'
              }}
            >
              <Plus size={15} /> Add
            </button>
          </form>

          {/* Consumers Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px'
            }}
          >
            {snapshot.consumers.map((consumer) => (
              <div
                key={consumer.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-consumer" style={{ fontSize: '0.7rem' }}>
                      {consumer.id}
                    </span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {consumer.name}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {renderStateBadge(consumer.state)}
                    <button
                      onClick={() => onRemoveConsumer(consumer.id)}
                      title="Decommission Consumer"
                      style={{
                        padding: '4px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        color: 'var(--accent-danger)'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Speed Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    <span>Dispatch Speed</span>
                    <strong>{consumer.speedMs} ms / item</strong>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="5000"
                    step="100"
                    value={consumer.speedMs}
                    onChange={(e) => onUpdateConsumer(consumer.id, { speedMs: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--accent-consumer)' }}
                  />
                </div>

                {/* Priority Selector & Metric Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Priority:</span>
                    <select
                      value={consumer.priority}
                      onChange={(e) => onUpdateConsumer(consumer.id, { priority: Number(e.target.value) })}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        fontSize: '0.7rem',
                        padding: '2px 4px'
                      }}
                    >
                      <option value="1">1 Low</option>
                      <option value="2">2 Normal</option>
                      <option value="3">3 High</option>
                      <option value="4">4 Urgent</option>
                    </select>
                  </div>

                  <div style={{ color: 'var(--text-muted)' }}>
                    Dispatched: <strong style={{ color: 'var(--accent-consumer)' }}>{consumer.itemsConsumed}</strong> &bull; Wait: {Math.round(consumer.totalWaitTimeMs)}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
