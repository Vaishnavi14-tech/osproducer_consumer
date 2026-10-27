import React from 'react';
import {
  Boxes,
  Cpu,
  Lock,
  Eye,
  Sliders,
  BookOpen,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  FileSpreadsheet,
  AlertTriangle,
  Radio,
  Server,
  PackageSearch,
  Sparkles,
  GitFork
} from 'lucide-react';
import { SYNCHRONIZATION_MODES, SIMULATION_EXECUTION_MODES } from '../constants/productTypes';
import { sound } from '../engine/soundEffects';

export default function Header({
  snapshot,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  onOpenEducational,
  onOpenFlowchart,
  onOpenAdmin,
  onOpenReport,
  onOpenProductCatalog,
  onSelectAlgorithm,
  onSelectMode,
  backendMode,
  setBackendMode,
  backendConnected
}) {
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="glass-panel" style={{ padding: '0.85rem 1.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand & Project Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-blue)',
              color: '#ffffff'
            }}
          >
            <Boxes size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Smart Warehouse Producer-Consumer Simulator
              </h1>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                OS Concurrency
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
              Operating System Synchronization & Bounded Buffer Laboratory
            </p>
          </div>
        </div>

        {/* Algorithm Selectors (Semaphores / Mutex Lock / Monitors) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => onSelectAlgorithm(SYNCHRONIZATION_MODES.SEMAPHORE)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.SEMAPHORE ? 'var(--accent-blue)' : 'transparent',
              color: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.SEMAPHORE ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.SEMAPHORE ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Cpu size={15} />
            Semaphores
          </button>

          <button
            onClick={() => onSelectAlgorithm(SYNCHRONIZATION_MODES.MUTEX_LOCK)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MUTEX_LOCK ? 'var(--accent-blue)' : 'transparent',
              color: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MUTEX_LOCK ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MUTEX_LOCK ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Lock size={15} />
            Mutex Lock
          </button>

          <button
            onClick={() => onSelectAlgorithm(SYNCHRONIZATION_MODES.MONITOR)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MONITOR ? 'var(--accent-blue)' : 'transparent',
              color: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MONITOR ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: snapshot.syncAlgorithm === SYNCHRONIZATION_MODES.MONITOR ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Eye size={15} />
            Monitor
          </button>
        </div>

        {/* Action Controls & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenProductCatalog}
            title="Open Product Inventory & Live Package Tracking"
            style={{
              padding: '6px 12px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PackageSearch size={15} style={{ color: 'var(--accent-blue)' }} />
            Products & Tracking
          </button>

          <button
            onClick={onOpenEducational}
            title="Open OS Learning Mode & Interactive Quiz"
            style={{
              padding: '6px 12px',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={15} />
            Learn OS Lab
          </button>

          <button
            onClick={onOpenFlowchart}
            title="Open Interactive Producer & Consumer Flowcharts"
            style={{
              padding: '6px 12px',
              background: 'var(--accent-producer-bg)',
              color: 'var(--accent-producer)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitFork size={15} />
            Flowcharts
          </button>

          <button
            onClick={onOpenReport}
            title="Generate & Export Reports (PDF, CSV, Excel)"
            style={{
              padding: '6px 12px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={15} />
            Reports
          </button>

          <button
            onClick={onOpenAdmin}
            title="Configure Warehouse Capacity & Parameters"
            style={{
              padding: '7px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              borderRadius: '8px'
            }}
          >
            <Sliders size={16} />
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            style={{
              padding: '7px',
              background: 'var(--bg-tertiary)',
              color: soundEnabled ? 'var(--accent-blue)' : 'var(--text-muted)',
              borderRadius: '8px'
            }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            style={{
              padding: '7px',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              borderRadius: '8px'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
