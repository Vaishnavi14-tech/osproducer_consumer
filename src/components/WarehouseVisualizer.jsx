import React, { useState } from 'react';
import {
  Boxes,
  Package,
  Cpu,
  Apple,
  Armchair,
  Shirt,
  Pill,
  BookOpen,
  Home,
  ArrowRight,
  ArrowDown,
  Layers,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle,
  HelpCircle,
  Search,
  Filter,
  Grid,
  Columns,
  Sparkles,
  Zap
} from 'lucide-react';
import { SYNCHRONIZATION_MODES, THREAD_STATES, PRODUCT_CATEGORIES } from '../constants/productTypes';

// Helper to render category icon
function renderCategoryIcon(categoryId, size = 16) {
  switch (categoryId) {
    case 'electronics': return <Cpu size={size} />;
    case 'food': return <Apple size={size} />;
    case 'furniture': return <Armchair size={size} />;
    case 'clothing': return <Shirt size={size} />;
    case 'medicines': return <Pill size={size} />;
    case 'books': return <BookOpen size={size} />;
    case 'household': return <Home size={size} />;
    default: return <Package size={size} />;
  }
}

// Circular / Radial Warehouse Utilization Gauge
function RadialUtilizationMeter({ percentage, capacity, itemCount }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 90
      ? 'var(--accent-danger)'
      : percentage <= 15
      ? 'var(--accent-warning)'
      : 'var(--accent-blue)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '92px', height: '92px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="46"
            cy="46"
            r={radius}
            fill="transparent"
            stroke="var(--bg-tertiary)"
            strokeWidth="8"
          />
          <circle
            cx="46"
            cy="46"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 300ms ease, stroke 300ms ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Filled
          </div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Occupancy
        </div>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {itemCount} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ {capacity}</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: color, fontWeight: 700, marginTop: '2px' }}>
          {percentage >= 90 ? 'Buffer Saturated' : percentage <= 15 ? 'Buffer Depleted' : 'Nominal Level'}
        </div>
      </div>
    </div>
  );
}

export default function WarehouseVisualizer({ snapshot }) {
  const {
    buffer,
    capacity,
    itemCount,
    occupancyPercentage,
    inIndex,
    outIndex,
    syncAlgorithm,
    syncState,
    producers,
    consumers,
    criticalSection
  } = snapshot;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('bays'); // 'bays' or 'matrix'
  const [hoveredSlot, setHoveredSlot] = useState(null);

  const isBufferFull = itemCount >= capacity;
  const isBufferEmpty = itemCount === 0;
  const isCsLocked = criticalSection?.isOccupied;

  // Filtered slots for search
  const filteredIndices = buffer.map((item, idx) => {
    if (!item) return idx;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return null;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = item.productId?.toLowerCase().includes(q);
      const matchName = item.productName?.toLowerCase().includes(q);
      if (!matchId && !matchName) return null;
    }
    return idx;
  }).filter(x => x !== null);

  // Group slots into Bays (10 slots per bay)
  const slotsPerBay = 10;
  const bayCount = Math.ceil(capacity / slotsPerBay);

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      {/* Visualizer Top Bar with Title, Search, Category Filter, and Radial Meter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.1rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '9px',
              borderRadius: '10px',
              background: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)'
            }}
          >
            <Boxes size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Industrial Warehouse Bounded Storage Buffer
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Circular FIFO Pallet Rack Architecture &bull; Capacity: {capacity} Units &bull; Inbound Pointer: [{inIndex}] &bull; Outbound Pointer: [{outIndex}]
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '5px 10px'
            }}
          >
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search Rack Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
                width: '120px'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '5px 8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Categories</option>
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('bays')}
              title="Pallet Bays View (Shelves Layout)"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: viewMode === 'bays' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === 'bays' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <Columns size={13} />
              Bays View
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              title="High-Density Matrix (All 40-250 Slots)"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: viewMode === 'matrix' ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === 'matrix' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <Grid size={13} />
              Matrix
            </button>
          </div>

          {/* Radial Utilization Gauge */}
          <RadialUtilizationMeter
            percentage={occupancyPercentage}
            capacity={capacity}
            itemCount={itemCount}
          />
        </div>
      </div>

      {/* 3-Column Logistics Environment: Inbound Suppliers -> Storage Buffer -> Outbound Delivery */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(230px, 1fr) minmax(520px, 2.5fr) minmax(230px, 1fr)',
          gap: '1.15rem',
          alignItems: 'stretch'
        }}
      >
        {/* ========================================================
            COLUMN 1: INBOUND SUPPLIER DOCK (PRODUCER TRUCKS & AGVs)
           ======================================================== */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {/* Dock Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} style={{ color: 'var(--accent-producer)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Inbound Freight Docks
              </span>
            </div>
            <span
              className="badge"
              style={{
                fontSize: '0.68rem',
                background: 'var(--accent-producer-bg)',
                color: 'var(--accent-producer)',
                fontWeight: 700
              }}
            >
              {producers.length} Suppliers
            </span>
          </div>

          {/* Animated Supplier Cargo Trucks at Bays */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              <span>DOCK BAY A &bull; FREIGHT ARRIVAL</span>
              <span style={{ color: 'var(--accent-producer)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-producer)',
                    animation: 'pulseGlow 1.2s infinite'
                  }}
                />
                DOCK ACTIVE
              </span>
            </div>

            {/* Truck Visual Frame with Blinking Lights */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '8px 10px',
                border: '1px dashed var(--accent-producer)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={22} style={{ color: 'var(--accent-producer)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Supplier Logistics Hauler
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    Forklift Unloading to Buffer
                  </div>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--accent-producer)' }} />
            </div>
          </div>

          {/* Producers Thread List with State Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '430px', overflowY: 'auto' }}>
            {producers.map((producer) => {
              const isBlocked = producer.state === THREAD_STATES.BLOCKED;
              const isWaiting = producer.state === THREAD_STATES.WAITING;
              const isRunning = producer.state === THREAD_STATES.RUNNING;

              const stateColor = isRunning
                ? 'var(--accent-producer)'
                : isBlocked
                ? 'var(--accent-danger)'
                : isWaiting
                ? 'var(--accent-warning)'
                : 'var(--text-secondary)';

              const stateBg = isRunning
                ? 'var(--accent-producer-bg)'
                : isBlocked
                ? 'var(--accent-danger-bg)'
                : isWaiting
                ? 'var(--accent-warning-bg)'
                : 'var(--bg-tertiary)';

              return (
                <div
                  key={producer.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: `1px solid ${isBlocked ? 'rgba(239, 68, 68, 0.4)' : isRunning ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: '9px',
                    padding: '8px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: 'var(--accent-producer-bg)',
                          color: 'var(--accent-producer)',
                          padding: '1px 5px',
                          borderRadius: '4px'
                        }}
                      >
                        {producer.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {producer.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        background: stateBg,
                        color: stateColor
                      }}
                    >
                      {producer.state}
                    </span>
                  </div>

                  {/* Production Progress Bar */}
                  <div style={{ marginBottom: '5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${producer.progress}%`,
                          height: '100%',
                          background: 'var(--accent-producer)',
                          borderRadius: '999px',
                          transition: 'width 100ms linear'
                        }}
                      />
                    </div>
                  </div>

                  {/* Item being produced preview */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                    <span>
                      {producer.currentProduct ? (
                        <span style={{ color: producer.currentProduct.color, fontWeight: 600 }}>
                          {producer.currentProduct.name}
                        </span>
                      ) : (
                        `Output: ${producer.itemsProduced} units`
                      )}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{producer.speedMs}ms/cycle</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            COLUMN 2: WAREHOUSE BOUNDED BUFFER RACKS & CRITICAL SECTION
           ======================================================== */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {/* Critical Section Security Chamber Gate */}
          <div
            style={{
              background: isCsLocked ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.08)',
              border: isCsLocked ? '2px solid rgba(239, 68, 68, 0.45)' : '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  padding: '6px',
                  borderRadius: '8px',
                  background: isCsLocked ? 'var(--accent-danger)' : 'var(--accent-producer)',
                  color: '#ffffff'
                }}
              >
                {isCsLocked ? <Lock size={16} /> : <Unlock size={16} />}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {isCsLocked ? `CRITICAL SECTION LOCKED: ${criticalSection.threadId}` : 'CRITICAL SECTION: UNLOCKED (FREE)'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {isCsLocked
                    ? `${criticalSection.action === 'ADD_PRODUCT' ? 'Storing Product into' : 'Consuming Product from'} Slot [${criticalSection.slotIndex}]`
                    : 'Awaiting Next Thread Execution via Mutex Lock'}
                </div>
              </div>
            </div>

            {/* Semaphore Pointers Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'var(--accent-producer-bg)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-producer)'
                }}
              >
                IN: [{inIndex}]
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'var(--accent-consumer-bg)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-consumer)'
                }}
              >
                OUT: [{outIndex}]
              </div>
            </div>
          </div>

          {/* Warehouse Rack Storage Grid View */}
          <div
            style={{
              flex: 1,
              maxHeight: '430px',
              overflowY: 'auto',
              paddingRight: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {viewMode === 'bays' ? (
              // BAYS VIEW: Shelves organized in Bays A, B, C with 10 slots each
              Array.from({ length: bayCount }).map((_, bayIdx) => {
                const bayLetter = String.fromCharCode(65 + (bayIdx % 26)) + (bayIdx >= 26 ? Math.floor(bayIdx / 26) : '');
                const startSlot = bayIdx * slotsPerBay;
                const endSlot = Math.min(capacity, startSlot + slotsPerBay);
                const baySlots = buffer.slice(startSlot, endSlot);

                return (
                  <div
                    key={bayIdx}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '8px 10px'
                    }}
                  >
                    {/* Bay Shelf Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        BAY {bayLetter} &bull; SLOTS [{startSlot} &ndash; {endSlot - 1}]
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {baySlots.filter(x => x !== null).length} / {baySlots.length} Occupied
                      </span>
                    </div>

                    {/* Pallet Positions Row */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${Math.min(baySlots.length, 5)}, 1fr)`,
                        gap: '6px'
                      }}
                    >
                      {baySlots.map((item, localIdx) => {
                        const globalIdx = startSlot + localIdx;
                        const isOccupied = item !== null;
                        const isNextIn = globalIdx === inIndex;
                        const isNextOut = globalIdx === outIndex;
                        const isCsTarget = criticalSection.slotIndex === globalIdx && isCsLocked;

                        return (
                          <div
                            key={globalIdx}
                            onMouseEnter={() => setHoveredSlot({ item, slotIndex: globalIdx })}
                            onMouseLeave={() => setHoveredSlot(null)}
                            style={{
                              background: isOccupied ? 'var(--bg-secondary)' : 'rgba(255, 255, 255, 0.03)',
                              border: isCsTarget
                                ? '2px solid #ef4444'
                                : isOccupied
                                ? `1.5px solid ${item.color || 'var(--accent-blue)'}`
                                : isNextIn
                                ? '1.5px dashed var(--accent-producer)'
                                : isNextOut
                                ? '1.5px dashed var(--accent-consumer)'
                                : '1px dashed var(--border-color)',
                              borderRadius: '7px',
                              padding: '5px 6px',
                              minHeight: '62px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 120ms ease',
                              boxShadow: isCsTarget ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none'
                            }}
                          >
                            {/* Slot Index Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                #{globalIdx}
                              </span>
                              {isNextIn && (
                                <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--accent-producer)' }}>
                                  IN
                                </span>
                              )}
                              {isNextOut && (
                                <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--accent-consumer)' }}>
                                  OUT
                                </span>
                              )}
                            </div>

                            {/* Content */}
                            {isOccupied ? (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <span style={{ color: item.color }}>
                                    {renderCategoryIcon(item.category, 12)}
                                  </span>
                                  <span style={{ fontSize: '0.66rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.productId}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.productName}
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Empty
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // MATRIX VIEW: Compact high-density interactive matrix of all slots
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(capacity, 15)}, 1fr)`,
                  gap: '4px',
                  background: 'var(--bg-tertiary)',
                  padding: '8px',
                  borderRadius: '10px'
                }}
              >
                {buffer.map((item, idx) => {
                  const isOccupied = item !== null;
                  const isNextIn = idx === inIndex;
                  const isNextOut = idx === outIndex;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredSlot({ item, slotIndex: idx })}
                      onMouseLeave={() => setHoveredSlot(null)}
                      title={isOccupied ? `${item.productId} - ${item.productName}` : `Slot #${idx} (Empty)`}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '4px',
                        background: isOccupied ? (item.color || 'var(--accent-blue)') : 'var(--bg-secondary)',
                        border: isNextIn ? '2px solid var(--accent-producer)' : isNextOut ? '2px solid var(--accent-consumer)' : '1px solid var(--border-color)',
                        opacity: isOccupied ? 0.95 : 0.35,
                        cursor: 'pointer',
                        transition: 'all 100ms ease'
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Hovered Slot Inspector Tooltip Bar */}
          {hoveredSlot && (
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>Slot #{hoveredSlot.slotIndex}:</span>
                {hoveredSlot.item ? (
                  <span>
                    <strong>{hoveredSlot.item.productId}</strong> &bull; {hoveredSlot.item.productName} ({hoveredSlot.item.categoryName})
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Empty Pallet Slot &bull; Available for Inbound Storage</span>
                )}
              </div>
              {hoveredSlot.item && (
                <div style={{ color: 'var(--text-secondary)' }}>
                  Qty: {hoveredSlot.item.quantity} &bull; Entry: {hoveredSlot.item.entryTime}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            COLUMN 3: OUTBOUND FULFILLMENT DOCK (CONSUMER AGVs & VANS)
           ======================================================== */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {/* Dock Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} style={{ color: 'var(--accent-consumer)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Outbound Fulfillment
              </span>
            </div>
            <span
              className="badge"
              style={{
                fontSize: '0.68rem',
                background: 'var(--accent-consumer-bg)',
                color: 'var(--accent-consumer)',
                fontWeight: 700
              }}
            >
              {consumers.length} Couriers
            </span>
          </div>

          {/* Animated Delivery Van at Outbound Dock */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              <span>DISPATCH BAY 1 &bull; EXPRESS VAN</span>
              <span style={{ color: 'var(--accent-consumer)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-consumer)',
                    animation: 'pulseGlow 1.2s infinite'
                  }}
                />
                DISPATCHING
              </span>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '8px 10px',
                border: '1px dashed var(--accent-consumer)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={22} style={{ color: 'var(--accent-consumer)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Customer Delivery Fleet
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    Picking from Warehouse Rack
                  </div>
                </div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--accent-consumer)' }} />
            </div>
          </div>

          {/* Consumers Thread List with State Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '430px', overflowY: 'auto' }}>
            {consumers.map((consumer) => {
              const isBlocked = consumer.state === THREAD_STATES.BLOCKED;
              const isWaiting = consumer.state === THREAD_STATES.WAITING;
              const isRunning = consumer.state === THREAD_STATES.RUNNING;

              const stateColor = isRunning
                ? 'var(--accent-consumer)'
                : isBlocked
                ? 'var(--accent-danger)'
                : isWaiting
                ? 'var(--accent-warning)'
                : 'var(--text-secondary)';

              const stateBg = isRunning
                ? 'var(--accent-consumer-bg)'
                : isBlocked
                ? 'var(--accent-danger-bg)'
                : isWaiting
                ? 'var(--accent-warning-bg)'
                : 'var(--bg-tertiary)';

              return (
                <div
                  key={consumer.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: `1px solid ${isBlocked ? 'rgba(239, 68, 68, 0.4)' : isRunning ? 'rgba(139, 92, 246, 0.4)' : 'var(--border-color)'}`,
                    borderRadius: '9px',
                    padding: '8px',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: 'var(--accent-consumer-bg)',
                          color: 'var(--accent-consumer)',
                          padding: '1px 5px',
                          borderRadius: '4px'
                        }}
                      >
                        {consumer.id}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {consumer.name}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        background: stateBg,
                        color: stateColor
                      }}
                    >
                      {consumer.state}
                    </span>
                  </div>

                  {/* Dispatch progress bar */}
                  <div style={{ marginBottom: '5px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${consumer.progress}%`,
                          height: '100%',
                          background: 'var(--accent-consumer)',
                          borderRadius: '999px',
                          transition: 'width 100ms linear'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                    <span>
                      {consumer.currentProduct ? (
                        <span style={{ color: 'var(--accent-consumer)', fontWeight: 600 }}>
                          Dispatched: {consumer.currentProduct.productId}
                        </span>
                      ) : (
                        `Dispatched: ${consumer.itemsConsumed} units`
                      )}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>{consumer.speedMs}ms/cycle</span>
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
