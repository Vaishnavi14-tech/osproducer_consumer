import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  X,
  Cpu,
  Apple,
  Armchair,
  Shirt,
  Pill,
  BookOpen,
  Home,
  CheckCircle2,
  Clock,
  Download,
  Boxes
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants/productTypes';

function renderCatIcon(catId, size = 15) {
  switch (catId) {
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

export default function ProductManagementModal({ isOpen, onClose, snapshot }) {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Combine items currently in buffer and completed items in audit trail
  const currentInStock = snapshot.buffer
    .filter(item => item !== null)
    .map(item => ({
      ...item,
      statusLabel: `Stored in Rack [Slot #${item.slotIndex ?? 'N/A'}]`,
      isDispatched: false
    }));

  const dispatchedItems = (snapshot.productAuditTrail || []).map(item => ({
    ...item,
    statusLabel: `Dispatched to ${item.consumedBy || 'Consumer'}`,
    isDispatched: true
  }));

  const allProducts = [...currentInStock, ...dispatchedItems];

  const filtered = allProducts.filter(p => {
    if (catFilter !== 'ALL' && p.category !== catFilter) return false;
    if (statusFilter === 'IN_STOCK' && p.isDispatched) return false;
    if (statusFilter === 'DISPATCHED' && !p.isDispatched) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = p.productId?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q);
      const matchName = p.productName?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q);
      if (!matchId && !matchName) return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['Product ID', 'Product Name', 'Category', 'Quantity', 'Entry Time', 'Exit Time', 'Tracking Status'];
    const rows = filtered.map(p => [
      p.productId || p.id,
      `"${p.productName || p.name}"`,
      p.categoryName || p.category,
      p.quantity || 1,
      p.entryTime || '--',
      p.exitTime || '--',
      `"${p.statusLabel}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Warehouse_Product_Catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', height: '85vh', display: 'flex', flexDirection: 'column' }}
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
              <Boxes size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Product Management & Live Inventory Tracking
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                Catalog Database &bull; 7 Categories &bull; Product ID Tracking &bull; Entry & Exit Timestamps
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={exportCsv}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} /> Export CSV
            </button>
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
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            padding: '0.85rem 1.4rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: 'var(--bg-secondary)'
          }}
        >
          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 12px',
              flex: '1',
              minWidth: '220px'
            }}
          >
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Product ID (e.g. ELX-1024) or Item Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                width: '100%'
              }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="ALL">All 7 Categories</option>
            {PRODUCT_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="ALL">All Statuses ({allProducts.length})</option>
            <option value="IN_STOCK">In Storage Racks ({currentInStock.length})</option>
            <option value="DISPATCHED">Dispatched ({dispatchedItems.length})</option>
          </select>
        </div>

        {/* Product Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.4rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Product ID</th>
                <th style={{ padding: '8px 12px' }}>Product Name</th>
                <th style={{ padding: '8px 12px' }}>Category</th>
                <th style={{ padding: '8px 12px' }}>Quantity</th>
                <th style={{ padding: '8px 12px' }}>Entry Time</th>
                <th style={{ padding: '8px 12px' }}>Exit Time</th>
                <th style={{ padding: '8px 12px' }}>Tracking Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((prod, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 800, color: 'var(--accent-blue)' }}>
                      {prod.productId || prod.id}
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {prod.productName || prod.name}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: prod.bgColor || 'var(--bg-tertiary)',
                          color: prod.color || 'var(--text-primary)'
                        }}
                      >
                        {renderCatIcon(prod.category)}
                        {prod.categoryName || prod.category}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 700 }}>
                      {prod.quantity || 1} units
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>
                      {prod.entryTime || '--'}
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>
                      {prod.exitTime || '--'}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: prod.isDispatched ? 'var(--accent-consumer-bg)' : 'var(--accent-producer-bg)',
                          color: prod.isDispatched ? 'var(--accent-consumer)' : 'var(--accent-producer)'
                        }}
                      >
                        {prod.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No products matched your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
