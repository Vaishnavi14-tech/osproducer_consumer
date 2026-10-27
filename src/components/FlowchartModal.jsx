import React from 'react';
import { X, GitFork, BookOpen } from 'lucide-react';
import FlowchartView from './FlowchartView';

export default function FlowchartModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '980px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
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
                padding: '7px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #2563eb)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <GitFork size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Producer-Consumer Synchronization Flowchart
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                Interactive Step-by-Step Execution Logic, Decision Gates & Critical Section Flow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              border: '1px solid var(--border-color)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.4rem', overflowY: 'auto', flex: 1 }}>
          <FlowchartView />
        </div>
      </div>
    </div>
  );
}
