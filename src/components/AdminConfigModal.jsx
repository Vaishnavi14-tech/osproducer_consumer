import React, { useState } from 'react';
import { Sliders, X, Boxes, Save, RotateCcw, AlertTriangle } from 'lucide-react';

export default function AdminConfigModal({ isOpen, onClose, snapshot, onUpdateCapacity, onReset }) {
  const [capacity, setCapacity] = useState(snapshot.capacity);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateCapacity(Number(capacity));
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
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
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>
                Warehouse Storage Configuration
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                Adjust Bounded Buffer Capacity (40 to 250 units)
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

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Warehouse Capacity (40–250 units):
              </label>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                {capacity} Units
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="250"
              step="10"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>40 Units (Standard Lab)</span>
              <span>120 Units (High Capacity)</span>
              <span>250 Units (Enterprise Max)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[40, 60, 100, 150, 200, 250].map((cap) => (
              <button
                type="button"
                key={cap}
                onClick={() => setCapacity(cap)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: capacity === cap ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  color: capacity === cap ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {cap}
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong>Dynamic Bounded Buffer Resizing:</strong> Changing capacity dynamically recalculates the <code>Empty Semaphore</code> (<code>empty = capacity - currentOccupancy</code>) and preserves all currently stored products.
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'var(--accent-blue)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={14} /> Apply Capacity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
