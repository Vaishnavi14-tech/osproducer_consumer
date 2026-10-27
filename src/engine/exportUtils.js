// Export Utilities: Excel (.xlsx via SheetJS), PDF (.pdf via jsPDF & autoTable), and CSV
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const REPORT_TYPES = [
  { id: 'DAILY', title: 'Daily Warehouse Operations Report', description: 'Comprehensive single-day operational throughput, active threads, and synchronization safety audit.' },
  { id: 'WEEKLY', title: 'Weekly Logistics & Performance Report', description: '7-day aggregated supply chain velocity, peak occupancy periods, and latency benchmarks.' },
  { id: 'MONTHLY', title: 'Monthly Executive Audit Report', description: 'High-level executive review of inventory turnover, concurrency anomalies, and reliability KPIs.' },
  { id: 'PRODUCTION', title: 'Production & Supplier Velocity Report', description: 'Inbound manufacturer statistics, cycle speeds, item categories produced, and buffer write times.' },
  { id: 'CONSUMPTION', title: 'Consumption & Order Fulfillment Report', description: 'Outbound dispatch rates, customer delivery agent activity, and average queue wait times.' },
  { id: 'INVENTORY', title: 'Inventory Levels & Pallet Tracking Report', description: 'Real-time stock itemization, category allocation, available buffer slots, and item serial codes.' },
  { id: 'SYNCHRONIZATION', title: 'OS Synchronization & Concurrency Audit', description: 'Deep analysis of Mutex locks, Dijkstra Semaphores, critical section durations, and wait queues.' },
  { id: 'RACE_CONDITION', title: 'Race Condition & Hazard Anomaly Report', description: 'Full log of lost updates, duplicate entries, data inconsistencies, and stock count desynchronizations.' },
  { id: 'UTILIZATION', title: 'Warehouse Utilization & Storage Efficiency', description: 'Capacity thresholds, empty vs full semaphore balance, and peak vs average rack saturation.' }
];

export function exportSimulationToExcel(snapshot, reportType = 'DAILY') {
  try {
    const rep = REPORT_TYPES.find(r => r.id === reportType) || REPORT_TYPES[0];
    const wb = XLSX.utils.book_new();

    // 1. Executive Summary Sheet
    const summaryData = [
      ['INDUSTRY-LEVEL WAREHOUSE PRODUCER-CONSUMER SIMULATOR'],
      [rep.title.toUpperCase()],
      ['Generated At', new Date().toLocaleString()],
      ['Description', rep.description],
      [''],
      ['Parameter', 'Observed Value'],
      ['Synchronization Algorithm', snapshot.syncAlgorithm],
      ['Execution Mode', snapshot.executionMode],
      ['Warehouse Storage Capacity', `${snapshot.capacity} units`],
      ['Current Inventory Occupancy', `${snapshot.itemCount} / ${snapshot.capacity} (${snapshot.occupancyPercentage}%)`],
      ['Peak Storage Saturation', `${snapshot.stats.peakOccupancy} units`],
      ['Total Products Stored (Produced)', snapshot.stats.totalProduced],
      ['Total Products Dispatched (Consumed)', snapshot.stats.totalConsumed],
      ['Throughput Rate', `${snapshot.stats.currentThroughput.toFixed(1)} items/s`],
      ['Production Rate', `${snapshot.stats.productionRate} items/s`],
      ['Consumption Rate', `${snapshot.stats.consumptionRate} items/s`],
      ['Avg Producer Waiting Latency', `${snapshot.stats.avgProducerWaitTimeMs} ms`],
      ['Avg Consumer Waiting Latency', `${snapshot.stats.avgConsumerWaitTimeMs} ms`],
      ['Empty Semaphore Value', snapshot.syncState.semaphore.empty],
      ['Full Semaphore Value', snapshot.syncState.semaphore.full],
      ['Mutex Lock State', snapshot.syncState.semaphore.mutex === 1 ? 'UNLOCKED (1)' : 'LOCKED (0)'],
      ['Race Hazards / Lost Updates', snapshot.raceHazards?.lostUpdates || 0],
      ['Duplicate Entries Collisions', snapshot.raceHazards?.duplicateEntries || 0],
      ['Data Inconsistency Errors', snapshot.raceHazards?.dataConsistencyErrors || 0],
      ['Stock Count Mismatch', snapshot.raceHazards?.stockMismatch || 0],
      ['System Health Status', snapshot.stats.systemHealth]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

    // 2. Thread Fleet Statistics Sheet
    const threadData = [
      ['Thread Type', 'ID', 'Thread Name', 'Priority', 'Cycle Speed (ms)', 'State', 'Items Processed', 'Total Wait (ms)']
    ];
    snapshot.producers.forEach(p => {
      threadData.push(['Producer / Supplier', p.id, p.name, p.priority, p.speedMs, p.state, p.itemsProduced, Math.round(p.totalWaitTimeMs)]);
    });
    snapshot.consumers.forEach(c => {
      threadData.push(['Consumer / Courier', c.id, c.name, c.priority, c.speedMs, c.state, c.itemsConsumed, Math.round(c.totalWaitTimeMs)]);
    });
    const wsThreads = XLSX.utils.aoa_to_sheet(threadData);
    XLSX.utils.book_append_sheet(wb, wsThreads, 'Thread Telemetry');

    // 3. Real-Time Product Inventory Sheet
    const invData = [
      ['Slot Index', 'Product ID', 'Product Name', 'Category', 'Quantity', 'Entry Time', 'Status']
    ];
    snapshot.buffer.forEach((item, idx) => {
      if (item) {
        invData.push([idx, item.productId || item.id, item.productName || item.name, item.categoryName || item.category, item.quantity || 1, item.entryTime || '--', 'Stored in Rack']);
      } else {
        invData.push([idx, 'EMPTY', '--', '--', 0, '--', 'Available Slot']);
      }
    });
    const wsInv = XLSX.utils.aoa_to_sheet(invData);
    XLSX.utils.book_append_sheet(wb, wsInv, 'Storage Racks');

    // 4. Event Logs Sheet
    const logData = [
      ['Timestamp', 'Log Category', 'Message']
    ];
    snapshot.logs.forEach(l => {
      logData.push([l.timestamp, l.type, l.message]);
    });
    const wsLogs = XLSX.utils.aoa_to_sheet(logData);
    XLSX.utils.book_append_sheet(wb, wsLogs, 'System Audit Logs');

    const fileName = `Warehouse_${reportType}_Report_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    return true;
  } catch (err) {
    console.error('Failed to export Excel report:', err);
    return false;
  }
}

export function exportSimulationToCSV(snapshot, reportType = 'DAILY') {
  try {
    const rep = REPORT_TYPES.find(r => r.id === reportType) || REPORT_TYPES[0];
    const rows = [
      ['WAREHOUSE SIMULATOR AUDIT CSV EXPORT'],
      ['Report Type', rep.title],
      ['Generated At', new Date().toLocaleString()],
      [''],
      ['Metric', 'Value'],
      ['Algorithm', snapshot.syncAlgorithm],
      ['Capacity', snapshot.capacity],
      ['Current Occupancy', snapshot.itemCount],
      ['Occupancy Pct', `${snapshot.occupancyPercentage}%`],
      ['Total Produced', snapshot.stats.totalProduced],
      ['Total Consumed', snapshot.stats.totalConsumed],
      ['Throughput (items/s)', snapshot.stats.currentThroughput.toFixed(1)],
      ['Empty Semaphore', snapshot.syncState.semaphore.empty],
      ['Full Semaphore', snapshot.syncState.semaphore.full],
      ['Mutex State', snapshot.syncState.semaphore.mutex === 1 ? 'UNLOCKED' : 'LOCKED'],
      ['Race Hazards', snapshot.stats.raceHazardsDetected],
      [''],
      ['--- CURRENT BUFFER SLOTS ---'],
      ['Slot', 'Product ID', 'Product Name', 'Category', 'Quantity', 'Entry Time']
    ];

    snapshot.buffer.forEach((item, idx) => {
      if (item) {
        rows.push([idx, item.productId || item.id, `"${item.productName || item.name}"`, item.categoryName || item.category, item.quantity || 1, item.entryTime || '--']);
      } else {
        rows.push([idx, 'EMPTY', '--', '--', 0, '--']);
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Warehouse_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to export CSV report:', err);
    return false;
  }
}

export function exportSimulationToPDF(snapshot, reportType = 'DAILY') {
  try {
    const rep = REPORT_TYPES.find(r => r.id === reportType) || REPORT_TYPES[0];
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top Header Banner
    doc.setFillColor(37, 99, 235); // Blue
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('INDUSTRY-LEVEL WAREHOUSE SIMULATOR', 14, 13);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(rep.title.toUpperCase(), 14, 21);

    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()} | Algorithm: ${snapshot.syncAlgorithm}`, 14, 27);

    // Section 1: Executive Overview Table
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Operational Parameters & System Health', 14, 40);

    const configTable = [
      ['Warehouse Buffer Capacity', `${snapshot.capacity} Units`, 'Current Stock Occupancy', `${snapshot.itemCount} Units (${snapshot.occupancyPercentage}%)`],
      ['Total Items Produced', `${snapshot.stats.totalProduced} units`, 'Total Items Dispatched', `${snapshot.stats.totalConsumed} units`],
      ['Throughput Velocity', `${snapshot.stats.currentThroughput.toFixed(1)} items/s`, 'Empty / Full Semaphores', `Empty: ${snapshot.syncState.semaphore.empty} | Full: ${snapshot.syncState.semaphore.full}`],
      ['Mutex Lock Status', snapshot.syncState.semaphore.mutex === 1 ? 'UNLOCKED (Free)' : 'LOCKED (Protected)', 'Concurrency Hazards', `${snapshot.stats.raceHazardsDetected} Detected`],
      ['System Health Assessment', snapshot.stats.systemHealth, 'Active Fleet Size', `${snapshot.producers.length} Suppliers | ${snapshot.consumers.length} Couriers`]
    ];

    autoTable(doc, {
      startY: 44,
      head: [],
      body: configTable,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [241, 245, 249], width: 48 },
        1: { width: 48 },
        2: { fontStyle: 'bold', fillColor: [241, 245, 249], width: 48 },
        3: { width: 48 }
      }
    });

    // Section 2: Thread Telemetry Table
    const nextY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Concurrent Thread Fleet Performance', 14, nextY);

    const threadRows = [];
    snapshot.producers.forEach(p => {
      threadRows.push(['Producer', p.id, p.name, `${p.speedMs}ms`, p.state, `${p.itemsProduced} units`, `${Math.round(p.totalWaitTimeMs)}ms`]);
    });
    snapshot.consumers.forEach(c => {
      threadRows.push(['Consumer', c.id, c.name, `${c.speedMs}ms`, c.state, `${c.itemsConsumed} units`, `${Math.round(c.totalWaitTimeMs)}ms`]);
    });

    autoTable(doc, {
      startY: nextY + 4,
      head: [['Type', 'ID', 'Name', 'Cycle Speed', 'State', 'Processed', 'Wait Latency']],
      body: threadRows,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
      styles: { fontSize: 7.5, cellPadding: 2 }
    });

    // Section 3: Recent Audit Logs
    const logY = doc.lastAutoTable.finalY + 8;
    if (logY < 240) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Recent Concurrency Audit Logs', 14, logY);

      const logRows = snapshot.logs.slice(0, 8).map(l => [l.timestamp, l.type, l.message]);
      autoTable(doc, {
        startY: logY + 4,
        head: [['Time', 'Category', 'Message']],
        body: logRows,
        theme: 'plain',
        headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontSize: 7.5 },
        styles: { fontSize: 7, cellPadding: 1.8 }
      });
    }

    doc.save(`Warehouse_${reportType}_Report_${Date.now()}.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to export PDF report:', err);
    return false;
  }
}
