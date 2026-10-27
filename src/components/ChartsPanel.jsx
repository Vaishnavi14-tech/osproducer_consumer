import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Database,
  Clock,
  Boxes
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../constants/productTypes';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartsPanel({ snapshot, theme }) {
  const [activeChartTab, setActiveChartTab] = useState('rates'); // 'rates', 'semaphores', 'throughput', 'waits'

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#475569';

  const timestamps = snapshot.history.timestamps.length > 0
    ? snapshot.history.timestamps
    : ['--:--:--', '--:--:--', '--:--:--'];

  // Chart 1: Production vs Consumption Rate Line Chart
  const rateChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Production Rate (items/s)',
        data: snapshot.history.productionRate.length > 0 ? snapshot.history.productionRate : [0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 2
      },
      {
        label: 'Consumption Rate (items/s)',
        data: snapshot.history.consumptionRate.length > 0 ? snapshot.history.consumptionRate : [0, 0, 0],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 2
      }
    ]
  };

  // Chart 2: Inventory & Buffer Occupancy Trend
  const occupancyChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Buffer Inventory (units)',
        data: snapshot.history.bufferOccupancy.length > 0 ? snapshot.history.bufferOccupancy : [0, 0, 0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.22)',
        tension: 0.25,
        fill: true,
        pointRadius: 2
      }
    ]
  };

  // Chart 3: Semaphore Activity Graph (Empty vs Full)
  const semaphoreChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Empty Semaphore (Storage Slots Available)',
        data: snapshot.history.emptySemaphore.length > 0 ? snapshot.history.emptySemaphore : [snapshot.capacity, snapshot.capacity],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.3,
        fill: false,
        pointRadius: 2
      },
      {
        label: 'Full Semaphore (Available Products in Storage)',
        data: snapshot.history.fullSemaphore.length > 0 ? snapshot.history.fullSemaphore : [0, 0],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        tension: 0.3,
        fill: false,
        pointRadius: 2
      }
    ]
  };

  // Chart 4: Throughput Velocity Graph
  const throughputChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'System Throughput (items/sec)',
        data: snapshot.history.throughput.length > 0 ? snapshot.history.throughput : [0, 0, 0],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        tension: 0.35,
        fill: true,
        pointRadius: 2
      }
    ]
  };

  // Chart 5: Waiting Time Bar Chart (Producers vs Consumers)
  const threadWaitLabels = [
    ...snapshot.producers.map(p => p.id),
    ...snapshot.consumers.map(c => c.id)
  ];
  const threadWaitData = [
    ...snapshot.producers.map(p => Math.round(p.totalWaitTimeMs)),
    ...snapshot.consumers.map(c => Math.round(c.totalWaitTimeMs))
  ];
  const threadBarColors = [
    ...snapshot.producers.map(() => 'rgba(16, 185, 129, 0.8)'),
    ...snapshot.consumers.map(() => 'rgba(139, 92, 246, 0.8)')
  ];

  const waitBarChartData = {
    labels: threadWaitLabels.length > 0 ? threadWaitLabels : ['P1', 'C1'],
    datasets: [
      {
        label: 'Accumulated Wait Time (ms)',
        data: threadWaitData.length > 0 ? threadWaitData : [0, 0],
        backgroundColor: threadBarColors,
        borderRadius: 6
      }
    ]
  };

  // Chart 6: Category Distribution in Buffer
  const catCounts = {};
  PRODUCT_CATEGORIES.forEach(c => { catCounts[c.id] = 0; });
  snapshot.buffer.forEach(item => {
    if (item && catCounts[item.category] !== undefined) {
      catCounts[item.category]++;
    }
  });

  const categoryDoughnutData = {
    labels: PRODUCT_CATEGORIES.map(c => c.name),
    datasets: [
      {
        data: PRODUCT_CATEGORIES.map(c => catCounts[c.id]),
        backgroundColor: PRODUCT_CATEGORIES.map(c => c.color),
        borderWidth: 1,
        borderColor: isDark ? '#0f172a' : '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { size: 10, family: 'sans-serif', weight: 600 },
          boxWidth: 10
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 9 }, maxRotation: 0 }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 9 } }
      }
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Real-Time Concurrency Analytics & Performance Telemetry
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live 60fps Charts &bull; Production vs Consumption &bull; Semaphore Oscillations &bull; Throughput
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
          {[
            { id: 'rates', label: 'Rate & Occupancy', icon: Activity },
            { id: 'semaphores', label: 'Semaphores Activity', icon: Database },
            { id: 'throughput', label: 'Throughput Trend', icon: TrendingUp },
            { id: 'waits', label: 'Thread Latency', icon: Clock }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeChartTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChartTab(tab.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isSel ? 'var(--accent-blue)' : 'transparent',
                  color: isSel ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Charts Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(450px, 2.2fr) minmax(240px, 1fr)',
          gap: '1rem',
          alignItems: 'stretch'
        }}
      >
        {/* Left Side: Active Dynamic Chart */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ flex: 1, minHeight: '240px' }}>
            {activeChartTab === 'rates' && (
              <Line data={rateChartData} options={chartOptions} />
            )}
            {activeChartTab === 'semaphores' && (
              <Line data={semaphoreChartData} options={chartOptions} />
            )}
            {activeChartTab === 'throughput' && (
              <Line data={throughputChartData} options={chartOptions} />
            )}
            {activeChartTab === 'waits' && (
              <Bar data={waitBarChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Right Side: Category Inventory Breakdown */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '11px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Inventory by Category
          </div>
          <div style={{ height: '180px', position: 'relative' }}>
            <Doughnut
              data={categoryDoughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: textColor, font: { size: 9 }, boxWidth: 8 }
                  }
                }
              }}
            />
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
            Total In Stock: {snapshot.itemCount} units
          </div>
        </div>
      </div>
    </div>
  );
}
