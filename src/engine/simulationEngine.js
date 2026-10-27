// Operating System Producer-Consumer Concurrency Engine
// Comprehensive Industry-Level Implementation
// Implements Semaphores, Mutex Locks, Critical Section Management,
// Standard OS Thread States, Race Condition Hazards, Deadlock Cycles,
// 7 Dynamic Scenarios, Inventory Forecasting & AI Recommendations.

import {
  PRODUCT_CATEGORIES,
  SYNCHRONIZATION_MODES,
  SIMULATION_EXECUTION_MODES,
  THREAD_STATES,
  SIMULATION_SCENARIOS,
  generateRandomProduct
} from '../constants/productTypes';
import { sound } from './soundEffects';

export class SimulationEngine {
  constructor(config = {}) {
    // Capacity configurable between 40 and 250 units (Default 60)
    this.capacity = Math.max(40, Math.min(250, config.capacity || 60));
    this.syncAlgorithm = config.syncAlgorithm || SYNCHRONIZATION_MODES.SEMAPHORE;
    this.executionMode = config.executionMode || SIMULATION_EXECUTION_MODES.NORMAL;
    this.simulationSpeed = config.simulationSpeed || 1.0; // 0.5x to 4.0x

    // Bounded Buffer Storage (40 to 250 slots)
    this.buffer = new Array(this.capacity).fill(null);
    this.inIndex = 0;
    this.outIndex = 0;
    this.itemCount = 0;

    // Synchronization Primitives State
    this.syncState = {
      // Semaphores (Dijkstra counting and binary semaphores)
      semaphore: {
        mutex: 1, // binary mutex semaphore (1 = unlocked, 0 = locked)
        empty: this.capacity, // counting semaphore for empty spaces
        full: 0, // counting semaphore for available products
        mutexWaitQueue: [],
        emptyWaitQueue: [],
        fullWaitQueue: []
      },
      // Mutex Lock with ownership and condition queues
      mutexLock: {
        isLocked: false,
        ownerThreadId: null,
        lockWaitQueue: [],
        notFullWaitQueue: [],
        notEmptyWaitQueue: []
      },
      // Monitor
      monitor: {
        activeThreadId: null,
        entryQueue: [],
        cFullQueue: [],
        cEmptyQueue: []
      }
    };

    // Critical Section Live State
    this.criticalSection = {
      isOccupied: false,
      threadId: null,
      threadName: null,
      threadType: null,
      action: null, // 'ADD_PRODUCT' or 'REMOVE_PRODUCT'
      slotIndex: null,
      productId: null,
      enteredAt: null
    };

    // Race Condition Hazard Tracker
    this.raceHazards = {
      lostUpdates: 0,
      duplicateEntries: 0,
      dataConsistencyErrors: 0,
      stockMismatch: 0,
      lastHazardLog: null
    };

    // Active Simulation Scenario
    this.currentScenario = SIMULATION_SCENARIOS[0]; // Balanced Warehouse

    // Smart Features
    this.isAutoRestockEnabled = false;
    this.emergencyOrdersQueue = [];

    // Threads
    this.producers = [];
    this.consumers = [];
    this.nextProducerId = 1;
    this.nextConsumerId = 1;
    this.itemSerialCounter = 1000;

    // Execution State
    this.isRunning = false;
    this.isPaused = false;
    this.timerId = null;
    this.tickInterval = 100; // 100ms simulation tick
    this.simulationStartTime = null;
    this.totalDurationMs = 0;

    // Timeline of thread access to Critical Section (Rolling last 40 events)
    this.threadTimeline = [];

    // Main Dashboard Statistics
    this.stats = {
      totalProduced: 0,
      totalConsumed: 0,
      peakOccupancy: 0,
      waitingProducersCount: 0,
      waitingConsumersCount: 0,
      runningThreadsCount: 0,
      blockedThreadsCount: 0,
      readyThreadsCount: 0,
      sleepingThreadsCount: 0,
      raceHazardsDetected: 0,
      deadlockDetected: false,
      deadlockCycle: [],
      currentThroughput: 0, // items per sec
      productionRate: 0,
      consumptionRate: 0,
      avgProducerWaitTimeMs: 0,
      avgConsumerWaitTimeMs: 0,
      systemHealth: 'HEALTHY' // 'HEALTHY', 'WARNING', 'CRITICAL_HAZARD', 'DEADLOCK'
    };

    // Rolling metrics for charts
    this.history = {
      timestamps: [],
      bufferOccupancy: [],
      productionRate: [],
      consumptionRate: [],
      throughput: [],
      emptySemaphore: [],
      fullSemaphore: [],
      waitingTimes: []
    };
    this.recentProducedCount = 0;
    this.recentConsumedCount = 0;
    this.metricsTimer = 0;

    // Completed Products History (for detailed Tracking & Reports)
    this.productAuditTrail = [];
    this.maxAuditTrail = 500;

    // Event Logs
    this.logs = [];
    this.maxLogs = 250;

    // Active Code Line Highlight for Educational Inspector
    this.activeCodeLine = {
      producer: null,
      consumer: null,
      algorithm: this.syncAlgorithm
    };

    // Event listener callbacks
    this.listeners = new Set();

    // Initialize Default Threads
    this.initDefaultThreads();
  }

  initDefaultThreads() {
    this.producers = [
      {
        id: 'P1',
        name: 'Apex Robotics Supplier P1',
        type: 'producer',
        speedMs: 1800,
        priority: 2, // 1=Low, 2=Normal, 3=High, 4=Urgent
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsProduced: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null,
        preferredCategory: 'electronics'
      },
      {
        id: 'P2',
        name: 'FreshGoods Depot P2',
        type: 'producer',
        speedMs: 2200,
        priority: 2,
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsProduced: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null,
        preferredCategory: 'food'
      },
      {
        id: 'P3',
        name: 'MediPharma Labs P3',
        type: 'producer',
        speedMs: 2000,
        priority: 3,
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsProduced: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null,
        preferredCategory: 'medicines'
      }
    ];
    this.nextProducerId = 4;

    this.consumers = [
      {
        id: 'C1',
        name: 'Express Delivery Van C1',
        type: 'consumer',
        speedMs: 2000,
        priority: 2,
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsConsumed: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null
      },
      {
        id: 'C2',
        name: 'Prime Retail Agent C2',
        type: 'consumer',
        speedMs: 2400,
        priority: 2,
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsConsumed: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null
      },
      {
        id: 'C3',
        name: 'Hospital Urgent Courier C3',
        type: 'consumer',
        speedMs: 1900,
        priority: 3,
        state: THREAD_STATES.READY,
        currentProduct: null,
        progress: 0,
        itemsConsumed: 0,
        totalWaitTimeMs: 0,
        waitStartTime: null
      }
    ];
    this.nextConsumerId = 4;
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('Simulation listener error:', err);
      }
    }
  }

  getSnapshot() {
    const actualNonNullCount = this.buffer.filter(x => x !== null).length;
    const stockMismatch = Math.abs(this.itemCount - actualNonNullCount);

    return {
      capacity: this.capacity,
      syncAlgorithm: this.syncAlgorithm,
      executionMode: this.executionMode,
      simulationSpeed: this.simulationSpeed,
      buffer: [...this.buffer],
      inIndex: this.inIndex,
      outIndex: this.outIndex,
      itemCount: this.itemCount,
      actualStoredCount: actualNonNullCount,
      emptySlotsCount: Math.max(0, this.capacity - this.itemCount),
      occupancyPercentage: Math.min(100, Math.round((this.itemCount / this.capacity) * 100)),
      syncState: JSON.parse(JSON.stringify(this.syncState)),
      criticalSection: { ...this.criticalSection },
      raceHazards: { ...this.raceHazards, stockMismatch },
      currentScenario: { ...this.currentScenario },
      isAutoRestockEnabled: this.isAutoRestockEnabled,
      producers: this.producers.map(p => ({ ...p })),
      consumers: this.consumers.map(c => ({ ...c })),
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      stats: { ...this.stats },
      threadTimeline: [...this.threadTimeline],
      history: {
        timestamps: [...this.history.timestamps],
        bufferOccupancy: [...this.history.bufferOccupancy],
        productionRate: [...this.history.productionRate],
        consumptionRate: [...this.history.consumptionRate],
        throughput: [...this.history.throughput],
        emptySemaphore: [...this.history.emptySemaphore],
        fullSemaphore: [...this.history.fullSemaphore],
        waitingTimes: [...this.history.waitingTimes]
      },
      productAuditTrail: [...this.productAuditTrail],
      logs: [...this.logs],
      activeCodeLine: { ...this.activeCodeLine }
    };
  }

  // Event logging
  addLog(type, message, details = {}) {
    const log = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString(),
      rawTime: Date.now(),
      type, // 'PRODUCER', 'CONSUMER', 'MUTEX', 'SEMAPHORE', 'HAZARD', 'CRITICAL_SECTION', 'SCENARIO', 'INFO'
      message,
      details
    };
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  // Record thread timeline event for the live Gantt/timeline
  recordTimelineEvent(threadId, threadType, action, slotIndex, details = '') {
    const event = {
      id: Date.now() + Math.random().toString(36).substring(2, 5),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      threadId,
      threadType,
      action, // 'LOCK_ACQUIRED', 'PRODUCING_INTO_SLOT', 'CONSUMING_FROM_SLOT', 'LOCK_RELEASED', 'BLOCKED'
      slotIndex,
      details,
      timestamp: Date.now()
    };
    this.threadTimeline.unshift(event);
    if (this.threadTimeline.length > 40) {
      this.threadTimeline.pop();
    }
  }

  // --- Capacity Expansion / Reconfiguration (40 to 250 units) ---
  setCapacity(newCapacity) {
    const clampedCapacity = Math.max(40, Math.min(250, parseInt(newCapacity, 10) || 60));
    const oldCap = this.capacity;
    if (clampedCapacity === oldCap) return;

    this.capacity = clampedCapacity;
    const newBuffer = new Array(this.capacity).fill(null);
    let newCount = 0;

    // Copy items up to new capacity
    for (let i = 0; i < Math.min(oldCap, this.capacity); i++) {
      if (this.buffer[i]) {
        newBuffer[i] = this.buffer[i];
        newCount++;
      }
    }
    this.buffer = newBuffer;
    this.itemCount = newCount;
    this.inIndex = this.itemCount % this.capacity;
    this.outIndex = 0;

    // Recalibrate semaphores
    this.syncState.semaphore.empty = Math.max(0, this.capacity - this.itemCount);
    this.syncState.semaphore.full = this.itemCount;

    this.addLog('INFO', `Warehouse storage dynamically expanded: ${oldCap} -> ${this.capacity} units.`);
    this.notify();
  }

  // --- Synchronization & Mode Selection ---
  setSyncAlgorithm(algorithm) {
    if (!SYNCHRONIZATION_MODES[algorithm]) return;
    this.syncAlgorithm = algorithm;
    this.activeCodeLine.algorithm = algorithm;
    this.resetSyncPrimitives();
    this.addLog('SYNC', `Switched synchronization mechanism to ${algorithm}.`);
    this.notify();
  }

  setExecutionMode(mode) {
    if (!SIMULATION_EXECUTION_MODES[mode]) return;
    this.executionMode = mode;
    this.stats.deadlockDetected = false;
    this.stats.deadlockCycle = [];

    if (mode === SIMULATION_EXECUTION_MODES.RACE_CONDITION) {
      this.addLog('HAZARD', '⚠ Race Condition Enabled! Mutex lock removed. Concurrent writes permitted.');
    } else {
      this.addLog('INFO', `Execution mode switched to ${mode}. Mutex protection active.`);
    }
    this.notify();
  }

  toggleRaceCondition(enable = null) {
    const shouldEnable = enable !== null
      ? enable
      : this.executionMode !== SIMULATION_EXECUTION_MODES.RACE_CONDITION;

    if (shouldEnable) {
      this.executionMode = SIMULATION_EXECUTION_MODES.RACE_CONDITION;
      this.stats.systemHealth = 'CRITICAL_HAZARD';
      sound.playAlarm();
      this.addLog('HAZARD', '⚠ Race Condition Detected: Mutex protection disabled! Data corruption may occur.');
    } else {
      this.executionMode = SIMULATION_EXECUTION_MODES.NORMAL;
      this.stats.systemHealth = 'HEALTHY';
      this.resetSyncPrimitives();
      this.addLog('SYNC', '✅ System Synchronized: Mutex Lock and Semaphores re-established.');
    }
    this.notify();
  }

  setSimulationSpeed(speed) {
    this.simulationSpeed = Math.max(0.25, Math.min(4.0, speed));
    this.notify();
  }

  resetSyncPrimitives() {
    this.syncState.semaphore = {
      mutex: 1,
      empty: Math.max(0, this.capacity - this.itemCount),
      full: this.itemCount,
      mutexWaitQueue: [],
      emptyWaitQueue: [],
      fullWaitQueue: []
    };
    this.syncState.mutexLock = {
      isLocked: false,
      ownerThreadId: null,
      lockWaitQueue: [],
      notFullWaitQueue: [],
      notEmptyWaitQueue: []
    };
    this.syncState.monitor = {
      activeThreadId: null,
      entryQueue: [],
      cFullQueue: [],
      cEmptyQueue: []
    };
    this.criticalSection = {
      isOccupied: false,
      threadId: null,
      threadName: null,
      threadType: null,
      action: null,
      slotIndex: null,
      productId: null,
      enteredAt: null
    };
  }

  // --- Scenario Engine (7 Standard OS Scenarios) ---
  applyScenario(scenarioId) {
    const sc = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    this.currentScenario = sc;

    // Stop current timers for clean reconfiguration
    const wasRunning = this.isRunning;
    if (wasRunning) {
      this.pause();
    }

    // Set capacity
    if (sc.capacity && sc.capacity !== this.capacity) {
      this.setCapacity(sc.capacity);
    }

    // Setup Producers
    this.producers = [];
    this.nextProducerId = 1;
    for (let i = 0; i < sc.producerCount; i++) {
      const cat = PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length].id;
      this.addProducer({
        name: `Supplier ${i + 1}`,
        speedMs: sc.producerSpeedMs,
        preferredCategory: cat,
        priority: 2
      });
    }

    // Setup Consumers
    this.consumers = [];
    this.nextConsumerId = 1;
    for (let j = 0; j < sc.consumerCount; j++) {
      this.addConsumer({
        name: `Delivery Agent ${j + 1}`,
        speedMs: sc.consumerSpeedMs,
        priority: sc.emergencyMode && j === 0 ? 4 : 2
      });
    }

    // Specific Scenario State Overrides
    if (sc.id === 'SCENARIO_4') {
      // Warehouse Full: Fill buffer to capacity
      for (let k = 0; k < this.capacity; k++) {
        const p = generateRandomProduct(this.itemSerialCounter++);
        p.slotIndex = k;
        this.buffer[k] = p;
      }
      this.itemCount = this.capacity;
      this.inIndex = 0;
      this.outIndex = 0;
      this.syncState.semaphore.empty = 0;
      this.syncState.semaphore.full = this.capacity;
      this.addLog('SCENARIO', `${sc.name} Applied: Buffer loaded to 100% capacity. Producers immediately blocked.`);
    } else if (sc.id === 'SCENARIO_5') {
      // Warehouse Empty: Clear buffer
      this.buffer = new Array(this.capacity).fill(null);
      this.itemCount = 0;
      this.inIndex = 0;
      this.outIndex = 0;
      this.syncState.semaphore.empty = this.capacity;
      this.syncState.semaphore.full = 0;
      this.addLog('SCENARIO', `${sc.name} Applied: Buffer emptied to 0 units. Consumers immediately blocked.`);
    } else if (sc.id === 'SCENARIO_6') {
      // Emergency Orders: Inject urgent high priority orders
      this.injectEmergencyOrder();
      this.addLog('SCENARIO', `${sc.name} Applied: Urgent Medical orders injected with preemptive Priority Consumption.`);
    } else {
      this.addLog('SCENARIO', `${sc.name} Applied: ${sc.description}`);
    }

    this.notify();
    if (wasRunning) {
      this.resume();
    }
  }

  // --- Dynamic Thread Management ---
  addProducer(config = {}) {
    const id = `P${this.nextProducerId++}`;
    const p = {
      id,
      name: config.name || `Producer ${id}`,
      type: 'producer',
      speedMs: config.speedMs || 1800,
      priority: config.priority || 2,
      state: THREAD_STATES.READY,
      currentProduct: null,
      progress: 0,
      itemsProduced: 0,
      totalWaitTimeMs: 0,
      waitStartTime: null,
      preferredCategory: config.preferredCategory || null
    };
    this.producers.push(p);
    this.addLog('PRODUCER', `Producer ${p.name} (${p.id}) added to supplier dock.`);
    this.notify();
    return p;
  }

  removeProducer(id) {
    this.producers = this.producers.filter(p => p.id !== id);
    this.addLog('PRODUCER', `Producer ${id} decommissioned.`);
    this.notify();
  }

  addConsumer(config = {}) {
    const id = `C${this.nextConsumerId++}`;
    const c = {
      id,
      name: config.name || `Consumer ${id}`,
      type: 'consumer',
      speedMs: config.speedMs || 2000,
      priority: config.priority || 2,
      state: THREAD_STATES.READY,
      currentProduct: null,
      progress: 0,
      itemsConsumed: 0,
      totalWaitTimeMs: 0,
      waitStartTime: null
    };
    this.consumers.push(c);
    this.addLog('CONSUMER', `Consumer ${c.name} (${c.id}) deployed to fulfillment dock.`);
    this.notify();
    return c;
  }

  removeConsumer(id) {
    this.consumers = this.consumers.filter(c => c.id !== id);
    this.addLog('CONSUMER', `Consumer ${id} decommissioned.`);
    this.notify();
  }

  // Batch Auto Generation
  autoGenerateProducers(count = 3) {
    for (let i = 0; i < count; i++) {
      const cat = PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)].id;
      this.addProducer({
        name: `Automated Supplier P${this.nextProducerId}`,
        speedMs: Math.floor(1200 + Math.random() * 1200),
        preferredCategory: cat,
        priority: 2
      });
    }
  }

  autoGenerateConsumers(count = 3) {
    for (let i = 0; i < count; i++) {
      this.addConsumer({
        name: `Fleet Agent C${this.nextConsumerId}`,
        speedMs: Math.floor(1400 + Math.random() * 1200),
        priority: 2
      });
    }
  }

  // Speed Adjustment Controls
  adjustProducerSpeed(factor) {
    this.producers.forEach(p => {
      p.speedMs = Math.max(300, Math.min(8000, Math.round(p.speedMs * factor)));
    });
    this.addLog('INFO', `Producer cycle speed adjusted (factor: ${factor}x).`);
    this.notify();
  }

  adjustConsumerSpeed(factor) {
    this.consumers.forEach(c => {
      c.speedMs = Math.max(300, Math.min(8000, Math.round(c.speedMs * factor)));
    });
    this.addLog('INFO', `Consumer cycle speed adjusted (factor: ${factor}x).`);
    this.notify();
  }

  // Emergency Order Injection (High Priority Preemption)
  injectEmergencyOrder() {
    // Spawn an Urgent Medical product
    const urgentProd = generateRandomProduct(this.itemSerialCounter++, 'medicines');
    urgentProd.productName = '🚨 EMERGENCY: Critical Medical Shipment';
    urgentProd.priority = 'Urgent';

    // Add high-priority consumer
    const urgentConsumer = this.addConsumer({
      name: `🚑 Priority Emergency Dispatch C${this.nextConsumerId}`,
      speedMs: 800,
      priority: 4 // Highest Priority
    });

    this.addLog('CONSUMER', `🚨 Emergency Order Dispatched: ${urgentProd.productName} received priority queue status.`);
    sound.playAlarm();
    this.notify();
  }

  // --- Simulation Life Cycle ---
  start() {
    if (this.isRunning && !this.isPaused) return;
    this.isRunning = true;
    this.isPaused = false;
    if (!this.simulationStartTime) {
      this.simulationStartTime = Date.now();
    }
    this.addLog('INFO', 'Warehouse simulation started.');
    sound.playStep();

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (!this.isPaused) {
        this.tick();
      }
    }, this.tickInterval);

    this.notify();
  }

  pause() {
    this.isPaused = true;
    this.addLog('INFO', 'Simulation paused.');
    this.notify();
  }

  resume() {
    if (!this.isRunning) {
      this.start();
      return;
    }
    this.isPaused = false;
    this.addLog('INFO', 'Simulation resumed.');
    this.notify();
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.producers.forEach(p => { p.state = THREAD_STATES.READY; p.progress = 0; });
    this.consumers.forEach(c => { c.state = THREAD_STATES.READY; c.progress = 0; });
    this.addLog('INFO', 'Simulation stopped.');
    this.notify();
  }

  reset() {
    this.stop();
    this.buffer = new Array(this.capacity).fill(null);
    this.inIndex = 0;
    this.outIndex = 0;
    this.itemCount = 0;
    this.itemSerialCounter = 1000;
    this.simulationStartTime = null;
    this.totalDurationMs = 0;

    this.raceHazards = {
      lostUpdates: 0,
      duplicateEntries: 0,
      dataConsistencyErrors: 0,
      stockMismatch: 0,
      lastHazardLog: null
    };

    this.stats = {
      totalProduced: 0,
      totalConsumed: 0,
      peakOccupancy: 0,
      waitingProducersCount: 0,
      waitingConsumersCount: 0,
      runningThreadsCount: 0,
      blockedThreadsCount: 0,
      readyThreadsCount: 0,
      sleepingThreadsCount: 0,
      raceHazardsDetected: 0,
      deadlockDetected: false,
      deadlockCycle: [],
      currentThroughput: 0,
      productionRate: 0,
      consumptionRate: 0,
      avgProducerWaitTimeMs: 0,
      avgConsumerWaitTimeMs: 0,
      systemHealth: 'HEALTHY'
    };

    this.history = {
      timestamps: [],
      bufferOccupancy: [],
      productionRate: [],
      consumptionRate: [],
      throughput: [],
      emptySemaphore: [],
      fullSemaphore: [],
      waitingTimes: []
    };
    this.recentProducedCount = 0;
    this.recentConsumedCount = 0;
    this.metricsTimer = 0;

    this.threadTimeline = [];
    this.productAuditTrail = [];
    this.resetSyncPrimitives();
    this.initDefaultThreads();
    this.logs = [];
    this.addLog('INFO', 'Warehouse simulation reset to pristine initial state.');
    this.notify();
  }

  step() {
    sound.playStep();
    this.tick(true);
    this.notify();
  }

  // --- Main Simulation Tick ---
  tick(isManualStep = false) {
    if (this.stats.deadlockDetected && this.executionMode === SIMULATION_EXECUTION_MODES.DEADLOCK_DEMO) {
      return;
    }

    const effectiveDelta = this.tickInterval * this.simulationSpeed;
    this.totalDurationMs += effectiveDelta;

    // 1. Process Producers
    this.stepProducers(effectiveDelta);

    // 2. Process Consumers
    this.stepConsumers(effectiveDelta);

    // 3. Auto-Restock Trigger (if enabled and inventory < 15%)
    if (this.isAutoRestockEnabled && this.itemCount < Math.ceil(this.capacity * 0.15)) {
      this.triggerAutoRestock();
    }

    // 4. Update Metrics & Rolling Charts (every 1 sec of sim time)
    this.metricsTimer += effectiveDelta;
    if (this.metricsTimer >= 1000) {
      this.updateRollingMetrics();
      this.metricsTimer = 0;
    }

    // 5. Update Thread State Tallies
    const allThreads = [...this.producers, ...this.consumers];
    this.stats.runningThreadsCount = allThreads.filter(t => t.state === THREAD_STATES.RUNNING).length;
    this.stats.waitingThreadsCount = allThreads.filter(t => t.state === THREAD_STATES.WAITING).length;
    this.stats.blockedThreadsCount = allThreads.filter(t => t.state === THREAD_STATES.BLOCKED).length;
    this.stats.readyThreadsCount = allThreads.filter(t => t.state === THREAD_STATES.READY).length;
    this.stats.sleepingThreadsCount = allThreads.filter(t => t.state === THREAD_STATES.SLEEPING).length;

    this.stats.waitingProducersCount = this.producers.filter(
      p => p.state === THREAD_STATES.BLOCKED || p.state === THREAD_STATES.WAITING
    ).length;
    this.stats.waitingConsumersCount = this.consumers.filter(
      c => c.state === THREAD_STATES.BLOCKED || c.state === THREAD_STATES.WAITING
    ).length;

    // Peak buffer update
    if (this.itemCount > this.stats.peakOccupancy) {
      this.stats.peakOccupancy = this.itemCount;
    }

    // Health check
    if (this.executionMode === SIMULATION_EXECUTION_MODES.RACE_CONDITION) {
      this.stats.systemHealth = 'CRITICAL_HAZARD';
    } else if (this.stats.deadlockDetected) {
      this.stats.systemHealth = 'DEADLOCK';
    } else if (this.itemCount >= this.capacity || this.itemCount === 0) {
      this.stats.systemHealth = 'WARNING';
    } else {
      this.stats.systemHealth = 'HEALTHY';
    }

    if (!isManualStep) {
      this.notify();
    }
  }

  // --- Step Producers ---
  stepProducers(deltaMs) {
    // Sort by priority descending (Urgent first)
    const activeProducers = [...this.producers].sort((a, b) => b.priority - a.priority);

    for (const producer of activeProducers) {
      if (producer.state === THREAD_STATES.READY || producer.state === THREAD_STATES.SLEEPING) {
        // Prepare new product box
        producer.currentProduct = generateRandomProduct(this.itemSerialCounter++, producer.preferredCategory);
        producer.currentProduct.producedBy = producer.name;
        producer.progress = 0;
        producer.state = THREAD_STATES.RUNNING;
        this.activeCodeLine.producer = { line: 1, text: `// ${producer.id}: Preparing product [${producer.currentProduct.productId}]` };
      } else if (producer.state === THREAD_STATES.RUNNING && producer.progress < 100) {
        // Producing in progress
        producer.progress += (deltaMs / producer.speedMs) * 100;
        if (producer.progress >= 100) {
          producer.progress = 100;
          // Item ready! Attempt insertion into warehouse bounded buffer
          this.attemptBufferInsertion(producer);
        }
      } else if (producer.state === THREAD_STATES.BLOCKED || producer.state === THREAD_STATES.WAITING) {
        producer.totalWaitTimeMs += deltaMs;
        this.attemptBufferInsertion(producer);
      }
    }
  }

  // Producer Synchronization Flow:
  // Producer -> Wait(Empty) -> Lock(Mutex) -> Add Product -> Update Inventory -> Unlock(Mutex) -> Signal(Full)
  attemptBufferInsertion(producer) {
    // --- RACE CONDITION MODE (MUTEX DISABLED) ---
    if (this.executionMode === SIMULATION_EXECUTION_MODES.RACE_CONDITION) {
      this.executeRaceConditionProduction(producer);
      return;
    }

    // --- SYNCHRONIZED MODES ---
    if (this.syncAlgorithm === SYNCHRONIZATION_MODES.SEMAPHORE) {
      this.semaphoreProduce(producer);
    } else if (this.syncAlgorithm === SYNCHRONIZATION_MODES.MUTEX_LOCK) {
      this.mutexProduce(producer);
    } else if (this.syncAlgorithm === SYNCHRONIZATION_MODES.MONITOR) {
      this.monitorProduce(producer);
    }
  }

  // Dijkstra Semaphore Producer
  semaphoreProduce(producer) {
    const sem = this.syncState.semaphore;

    // Step 1: Wait(Empty)
    if (sem.empty <= 0 || this.itemCount >= this.capacity) {
      if (producer.state !== THREAD_STATES.BLOCKED) {
        producer.state = THREAD_STATES.BLOCKED;
        producer.waitStartTime = Date.now();
        if (!sem.emptyWaitQueue.includes(producer.id)) {
          sem.emptyWaitQueue.push(producer.id);
        }
        sound.playBlocked();
        this.recordTimelineEvent(producer.id, 'producer', 'BLOCKED', null, 'Buffer is Full - Waiting for Empty Slot');
        this.addLog('SEMAPHORE', `${producer.name} (${producer.id}) BLOCKED on wait(empty). Warehouse full!`);
        this.activeCodeLine.producer = { line: 2, text: 'wait(empty); // [BLOCKED: 0 empty slots]' };
      }
      return;
    }

    // Step 2: Lock(Mutex)
    if (sem.mutex <= 0) {
      if (producer.state !== THREAD_STATES.WAITING) {
        producer.state = THREAD_STATES.WAITING;
        if (!sem.mutexWaitQueue.includes(producer.id)) {
          sem.mutexWaitQueue.push(producer.id);
        }
        this.addLog('MUTEX', `${producer.name} (${producer.id}) WAITING for Mutex lock.`);
        this.activeCodeLine.producer = { line: 3, text: 'wait(mutex); // [WAITING for Critical Section Lock]' };
      }
      return;
    }

    // Acquire Semaphores
    sem.empty--;
    sem.mutex = 0; // Lock acquired
    sem.emptyWaitQueue = sem.emptyWaitQueue.filter(id => id !== producer.id);
    sem.mutexWaitQueue = sem.mutexWaitQueue.filter(id => id !== producer.id);

    producer.state = THREAD_STATES.RUNNING;
    producer.totalWaitTimeMs += producer.waitStartTime ? (Date.now() - producer.waitStartTime) : 0;
    producer.waitStartTime = null;

    // Critical Section Entered
    const slot = this.inIndex;
    const item = producer.currentProduct;
    item.slotIndex = slot;
    item.entryTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    item.trackingStatus = 'STORED_IN_RACK';

    this.criticalSection = {
      isOccupied: true,
      threadId: producer.id,
      threadName: producer.name,
      threadType: 'producer',
      action: 'ADD_PRODUCT',
      slotIndex: slot,
      productId: item.productId,
      enteredAt: Date.now()
    };
    this.recordTimelineEvent(producer.id, 'producer', 'PRODUCING_INTO_SLOT', slot, `Stored ${item.productId}`);

    // Update Shared Inventory
    this.buffer[slot] = item;
    this.inIndex = (this.inIndex + 1) % this.capacity;
    this.itemCount++;
    producer.itemsProduced++;
    this.stats.totalProduced++;
    this.recentProducedCount++;
    sound.playProduce();

    this.addLog(
      'CRITICAL_SECTION',
      `Producer ${producer.id} entered Critical Section: Added [${item.productId}] to Slot [${slot}].`
    );

    // Step 3: Unlock(Mutex) & Signal(Full)
    sem.mutex = 1; // Release Lock
    sem.full++;    // Signal that a product is available

    this.criticalSection.isOccupied = false;
    this.recordTimelineEvent(producer.id, 'producer', 'LOCK_RELEASED', slot, 'Released Mutex & Signaled Full');

    // Wake up blocked consumers
    if (sem.fullWaitQueue.length > 0) {
      const wakingConsumerId = sem.fullWaitQueue.shift();
      const wakingConsumer = this.consumers.find(c => c.id === wakingConsumerId);
      if (wakingConsumer) {
        wakingConsumer.state = THREAD_STATES.READY;
      }
    }

    // Producer transitions to Sleeping/Ready cycle delay
    producer.currentProduct = null;
    producer.progress = 0;
    producer.state = THREAD_STATES.SLEEPING;
  }

  // Mutex Lock Producer (ReentrantLock with Condition Variables)
  mutexProduce(producer) {
    const ml = this.syncState.mutexLock;

    if (this.itemCount >= this.capacity) {
      if (producer.state !== THREAD_STATES.BLOCKED) {
        producer.state = THREAD_STATES.BLOCKED;
        if (!ml.notFullWaitQueue.includes(producer.id)) {
          ml.notFullWaitQueue.push(producer.id);
        }
        this.addLog('SYNC', `Buffer full! ${producer.name} blocked on condition.await(notFull).`);
      }
      return;
    }

    if (ml.isLocked && ml.ownerThreadId !== producer.id) {
      if (producer.state !== THREAD_STATES.WAITING) {
        producer.state = THREAD_STATES.WAITING;
        if (!ml.lockWaitQueue.includes(producer.id)) {
          ml.lockWaitQueue.push(producer.id);
        }
      }
      return;
    }

    // Acquire Mutex
    ml.isLocked = true;
    ml.ownerThreadId = producer.id;
    ml.lockWaitQueue = ml.lockWaitQueue.filter(id => id !== producer.id);
    ml.notFullWaitQueue = ml.notFullWaitQueue.filter(id => id !== producer.id);

    producer.state = THREAD_STATES.RUNNING;
    const slot = this.inIndex;
    const item = producer.currentProduct;
    item.slotIndex = slot;

    this.criticalSection = {
      isOccupied: true,
      threadId: producer.id,
      threadName: producer.name,
      threadType: 'producer',
      action: 'ADD_PRODUCT',
      slotIndex: slot,
      productId: item.productId,
      enteredAt: Date.now()
    };

    this.buffer[slot] = item;
    this.inIndex = (this.inIndex + 1) % this.capacity;
    this.itemCount++;
    producer.itemsProduced++;
    this.stats.totalProduced++;
    this.recentProducedCount++;
    sound.playProduce();

    // Release Mutex & signal condition
    ml.isLocked = false;
    ml.ownerThreadId = null;
    this.criticalSection.isOccupied = false;

    // Signal notEmpty condition for consumers
    if (ml.notEmptyWaitQueue.length > 0) {
      const wakingId = ml.notEmptyWaitQueue.shift();
      const waking = this.consumers.find(c => c.id === wakingId);
      if (waking) waking.state = THREAD_STATES.READY;
    }

    producer.currentProduct = null;
    producer.progress = 0;
    producer.state = THREAD_STATES.SLEEPING;
  }

  // Monitor Producer
  monitorProduce(producer) {
    const mon = this.syncState.monitor;

    if (this.itemCount >= this.capacity) {
      if (producer.state !== THREAD_STATES.BLOCKED) {
        producer.state = THREAD_STATES.BLOCKED;
        if (!mon.cFullQueue.includes(producer.id)) mon.cFullQueue.push(producer.id);
      }
      return;
    }

    if (mon.activeThreadId && mon.activeThreadId !== producer.id) {
      if (producer.state !== THREAD_STATES.WAITING) {
        producer.state = THREAD_STATES.WAITING;
        if (!mon.entryQueue.includes(producer.id)) mon.entryQueue.push(producer.id);
      }
      return;
    }

    mon.activeThreadId = producer.id;
    mon.entryQueue = mon.entryQueue.filter(id => id !== producer.id);
    mon.cFullQueue = mon.cFullQueue.filter(id => id !== producer.id);

    producer.state = THREAD_STATES.RUNNING;
    const slot = this.inIndex;
    const item = producer.currentProduct;
    item.slotIndex = slot;

    this.buffer[slot] = item;
    this.inIndex = (this.inIndex + 1) % this.capacity;
    this.itemCount++;
    producer.itemsProduced++;
    this.stats.totalProduced++;
    this.recentProducedCount++;
    sound.playProduce();

    mon.activeThreadId = null;
    if (mon.cEmptyQueue.length > 0) {
      const wakingId = mon.cEmptyQueue.shift();
      const waking = this.consumers.find(c => c.id === wakingId);
      if (waking) waking.state = THREAD_STATES.READY;
    }

    producer.currentProduct = null;
    producer.progress = 0;
    producer.state = THREAD_STATES.SLEEPING;
  }

  // --- Step Consumers ---
  stepConsumers(deltaMs) {
    // Sort by priority descending (Urgent emergency consumers take priority!)
    const activeConsumers = [...this.consumers].sort((a, b) => b.priority - a.priority);

    for (const consumer of activeConsumers) {
      if (consumer.state === THREAD_STATES.READY || consumer.state === THREAD_STATES.SLEEPING) {
        // Attempt consumption from bounded buffer
        consumer.state = THREAD_STATES.RUNNING;
        this.attemptBufferRemoval(consumer);
      } else if (consumer.state === THREAD_STATES.RUNNING && consumer.progress < 100) {
        // Consuming / Dispatching in progress
        consumer.progress += (deltaMs / consumer.speedMs) * 100;
        if (consumer.progress >= 100) {
          consumer.progress = 0;
          consumer.currentProduct = null;
          consumer.state = THREAD_STATES.SLEEPING;
        }
      } else if (consumer.state === THREAD_STATES.BLOCKED || consumer.state === THREAD_STATES.WAITING) {
        consumer.totalWaitTimeMs += deltaMs;
        this.attemptBufferRemoval(consumer);
      }
    }
  }

  // Consumer Synchronization Flow:
  // Consumer -> Wait(Full) -> Lock(Mutex) -> Remove Product -> Update Inventory -> Unlock(Mutex) -> Signal(Empty)
  attemptBufferRemoval(consumer) {
    if (this.executionMode === SIMULATION_EXECUTION_MODES.RACE_CONDITION) {
      this.executeRaceConditionConsumption(consumer);
      return;
    }

    if (this.syncAlgorithm === SYNCHRONIZATION_MODES.SEMAPHORE) {
      this.semaphoreConsume(consumer);
    } else if (this.syncAlgorithm === SYNCHRONIZATION_MODES.MUTEX_LOCK) {
      this.mutexConsume(consumer);
    } else if (this.syncAlgorithm === SYNCHRONIZATION_MODES.MONITOR) {
      this.monitorConsume(consumer);
    }
  }

  // Dijkstra Semaphore Consumer
  semaphoreConsume(consumer) {
    const sem = this.syncState.semaphore;

    // Step 1: Wait(Full)
    if (sem.full <= 0 || this.itemCount === 0) {
      if (consumer.state !== THREAD_STATES.BLOCKED) {
        consumer.state = THREAD_STATES.BLOCKED;
        consumer.waitStartTime = Date.now();
        if (!sem.fullWaitQueue.includes(consumer.id)) {
          sem.fullWaitQueue.push(consumer.id);
        }
        sound.playBlocked();
        this.recordTimelineEvent(consumer.id, 'consumer', 'BLOCKED', null, 'Buffer Empty - Waiting for Products');
        this.addLog('SEMAPHORE', `${consumer.name} (${consumer.id}) BLOCKED on wait(full). Warehouse empty!`);
        this.activeCodeLine.consumer = { line: 2, text: 'wait(full); // [BLOCKED: 0 available items]' };
      }
      return;
    }

    // Step 2: Lock(Mutex)
    if (sem.mutex <= 0) {
      if (consumer.state !== THREAD_STATES.WAITING) {
        consumer.state = THREAD_STATES.WAITING;
        if (!sem.mutexWaitQueue.includes(consumer.id)) {
          sem.mutexWaitQueue.push(consumer.id);
        }
        this.addLog('MUTEX', `${consumer.name} (${consumer.id}) WAITING for Mutex lock.`);
        this.activeCodeLine.consumer = { line: 3, text: 'wait(mutex); // [WAITING for Critical Section Lock]' };
      }
      return;
    }

    // Acquire Semaphores
    sem.full--;
    sem.mutex = 0; // Lock acquired
    sem.fullWaitQueue = sem.fullWaitQueue.filter(id => id !== consumer.id);
    sem.mutexWaitQueue = sem.mutexWaitQueue.filter(id => id !== consumer.id);

    consumer.state = THREAD_STATES.RUNNING;
    consumer.totalWaitTimeMs += consumer.waitStartTime ? (Date.now() - consumer.waitStartTime) : 0;
    consumer.waitStartTime = null;

    // Critical Section: Remove item from bounded buffer
    const slot = this.outIndex;
    const removedItem = this.buffer[slot] || {
      productId: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: 'Standard Package',
      category: 'household'
    };

    removedItem.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    removedItem.trackingStatus = 'DISPATCHED_TO_CONSUMER';
    removedItem.consumedBy = consumer.name;

    this.criticalSection = {
      isOccupied: true,
      threadId: consumer.id,
      threadName: consumer.name,
      threadType: 'consumer',
      action: 'REMOVE_PRODUCT',
      slotIndex: slot,
      productId: removedItem.productId,
      enteredAt: Date.now()
    };
    this.recordTimelineEvent(consumer.id, 'consumer', 'CONSUMING_FROM_SLOT', slot, `Dispatched ${removedItem.productId}`);

    // Update inventory
    this.buffer[slot] = null;
    this.outIndex = (this.outIndex + 1) % this.capacity;
    this.itemCount = Math.max(0, this.itemCount - 1);
    consumer.currentProduct = removedItem;
    consumer.itemsConsumed++;
    consumer.progress = 0;
    this.stats.totalConsumed++;
    this.recentConsumedCount++;
    sound.playConsume();

    // Store in Product Audit Trail
    this.productAuditTrail.unshift(removedItem);
    if (this.productAuditTrail.length > this.maxAuditTrail) {
      this.productAuditTrail.pop();
    }

    this.addLog(
      'CRITICAL_SECTION',
      `Consumer ${consumer.id} entered Critical Section: Removed [${removedItem.productId}] from Slot [${slot}].`
    );

    // Step 3: Unlock(Mutex) & Signal(Empty)
    sem.mutex = 1; // Release Lock
    sem.empty++;   // Signal empty space available

    this.criticalSection.isOccupied = false;
    this.recordTimelineEvent(consumer.id, 'consumer', 'LOCK_RELEASED', slot, 'Released Mutex & Signaled Empty');

    // Wake up blocked producers
    if (sem.emptyWaitQueue.length > 0) {
      const wakingProducerId = sem.emptyWaitQueue.shift();
      const wakingProducer = this.producers.find(p => p.id === wakingProducerId);
      if (wakingProducer) {
        wakingProducer.state = THREAD_STATES.READY;
      }
    }
  }

  // Mutex Lock Consumer
  mutexConsume(consumer) {
    const ml = this.syncState.mutexLock;

    if (this.itemCount === 0) {
      if (consumer.state !== THREAD_STATES.BLOCKED) {
        consumer.state = THREAD_STATES.BLOCKED;
        if (!ml.notEmptyWaitQueue.includes(consumer.id)) {
          ml.notEmptyWaitQueue.push(consumer.id);
        }
      }
      return;
    }

    if (ml.isLocked && ml.ownerThreadId !== consumer.id) {
      if (consumer.state !== THREAD_STATES.WAITING) {
        consumer.state = THREAD_STATES.WAITING;
        if (!ml.lockWaitQueue.includes(consumer.id)) {
          ml.lockWaitQueue.push(consumer.id);
        }
      }
      return;
    }

    ml.isLocked = true;
    ml.ownerThreadId = consumer.id;
    ml.lockWaitQueue = ml.lockWaitQueue.filter(id => id !== consumer.id);
    ml.notEmptyWaitQueue = ml.notEmptyWaitQueue.filter(id => id !== consumer.id);

    consumer.state = THREAD_STATES.RUNNING;
    const slot = this.outIndex;
    const item = this.buffer[slot] || { productId: 'PKG-UNKNOWN' };
    item.exitTime = new Date().toLocaleTimeString();
    item.trackingStatus = 'DISPATCHED_TO_CONSUMER';

    this.buffer[slot] = null;
    this.outIndex = (this.outIndex + 1) % this.capacity;
    this.itemCount = Math.max(0, this.itemCount - 1);
    consumer.currentProduct = item;
    consumer.itemsConsumed++;
    consumer.progress = 0;
    this.stats.totalConsumed++;
    this.recentConsumedCount++;
    sound.playConsume();

    ml.isLocked = false;
    ml.ownerThreadId = null;

    if (ml.notFullWaitQueue.length > 0) {
      const wakingId = ml.notFullWaitQueue.shift();
      const waking = this.producers.find(p => p.id === wakingId);
      if (waking) waking.state = THREAD_STATES.READY;
    }
  }

  // Monitor Consumer
  monitorConsume(consumer) {
    const mon = this.syncState.monitor;

    if (this.itemCount === 0) {
      if (consumer.state !== THREAD_STATES.BLOCKED) {
        consumer.state = THREAD_STATES.BLOCKED;
        if (!mon.cEmptyQueue.includes(consumer.id)) mon.cEmptyQueue.push(consumer.id);
      }
      return;
    }

    if (mon.activeThreadId && mon.activeThreadId !== consumer.id) {
      if (consumer.state !== THREAD_STATES.WAITING) {
        consumer.state = THREAD_STATES.WAITING;
        if (!mon.entryQueue.includes(consumer.id)) mon.entryQueue.push(consumer.id);
      }
      return;
    }

    mon.activeThreadId = consumer.id;
    mon.entryQueue = mon.entryQueue.filter(id => id !== consumer.id);
    mon.cEmptyQueue = mon.cEmptyQueue.filter(id => id !== consumer.id);

    consumer.state = THREAD_STATES.RUNNING;
    const slot = this.outIndex;
    const item = this.buffer[slot] || { productId: 'PKG-UNKNOWN' };

    this.buffer[slot] = null;
    this.outIndex = (this.outIndex + 1) % this.capacity;
    this.itemCount = Math.max(0, this.itemCount - 1);
    consumer.currentProduct = item;
    consumer.itemsConsumed++;
    consumer.progress = 0;
    this.stats.totalConsumed++;
    this.recentConsumedCount++;
    sound.playConsume();

    mon.activeThreadId = null;
    if (mon.cFullQueue.length > 0) {
      const wakingId = mon.cFullQueue.shift();
      const waking = this.producers.find(p => p.id === wakingId);
      if (waking) waking.state = THREAD_STATES.READY;
    }
  }

  // --- RACE CONDITION EXECUTION (DEMONSTRATES CONCURRENCY FLAWS) ---
  executeRaceConditionProduction(producer) {
    // When mutex is disabled, multiple threads write simultaneously to buffer
    this.stats.raceHazardsDetected++;

    // Hazard Scenario 1: Lost Update (Buffer is full or slot collision)
    if (this.itemCount >= this.capacity) {
      this.raceHazards.lostUpdates++;
      const randomSlot = Math.floor(Math.random() * this.capacity);
      const overwritten = this.buffer[randomSlot];
      this.buffer[randomSlot] = producer.currentProduct;

      this.addLog(
        'HAZARD',
        `⚠ RACE HAZARD (Lost Update): Producer ${producer.id} overwrote Slot [${randomSlot}]. Discarded [${overwritten?.productId || 'NULL'}].`
      );
      producer.itemsProduced++;
      producer.progress = 0;
      producer.currentProduct = null;
      producer.state = THREAD_STATES.SLEEPING;
      return;
    }

    // Hazard Scenario 2: Unsynchronized Concurrent Write / Stock Count Desynchronization
    const targetSlot = this.inIndex;
    if (this.buffer[targetSlot] !== null) {
      this.raceHazards.duplicateEntries++;
      this.addLog(
        'HAZARD',
        `⚠ RACE HAZARD (Duplicate Slot Collision): Two threads targeted Slot [${targetSlot}] simultaneously!`
      );
    }

    this.buffer[targetSlot] = producer.currentProduct;
    // Simulate non-atomic read-modify-write on inIndex and itemCount
    setTimeout(() => {
      this.inIndex = (this.inIndex + 1) % this.capacity;
      this.itemCount++;
    }, 10);

    producer.itemsProduced++;
    producer.progress = 0;
    producer.currentProduct = null;
    producer.state = THREAD_STATES.SLEEPING;
  }

  executeRaceConditionConsumption(consumer) {
    this.stats.raceHazardsDetected++;

    // Hazard Scenario 3: Reading from Empty Slot (Buffer Underflow Data Inconsistency)
    if (this.itemCount <= 0 || this.buffer[this.outIndex] === null) {
      this.raceHazards.dataConsistencyErrors++;
      this.addLog(
        'HAZARD',
        `⚠ RACE HAZARD (Dirty Read / Underflow): Consumer ${consumer.id} read NULL from Slot [${this.outIndex}] while buffer empty!`
      );
      consumer.itemsConsumed++;
      consumer.progress = 0;
      consumer.state = THREAD_STATES.SLEEPING;
      return;
    }

    const slot = this.outIndex;
    const item = this.buffer[slot];
    this.buffer[slot] = null;

    setTimeout(() => {
      this.outIndex = (this.outIndex + 1) % this.capacity;
      this.itemCount = Math.max(0, this.itemCount - 1);
    }, 10);

    consumer.itemsConsumed++;
    consumer.currentProduct = item;
    consumer.progress = 0;
    consumer.state = THREAD_STATES.SLEEPING;
  }

  // --- Auto-Restocking Feature ---
  toggleAutoRestock(enable = null) {
    this.isAutoRestockEnabled = enable !== null ? enable : !this.isAutoRestockEnabled;
    this.addLog('INFO', `Auto-Restocking ${this.isAutoRestockEnabled ? 'ENABLED' : 'DISABLED'}.`);
    this.notify();
  }

  triggerAutoRestock() {
    this.producers.forEach(p => {
      if (p.speedMs > 1000) {
        p.speedMs = Math.round(p.speedMs * 0.85); // Accelerate
      }
    });
    this.addLog('INFO', 'Smart Auto-Restock: Low inventory detected (<15%). Suppliers accelerated by 15%.');
  }

  // --- Rolling Metrics & Analytics ---
  updateRollingMetrics() {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.history.timestamps.push(timeStr);
    this.history.bufferOccupancy.push(this.itemCount);
    this.history.productionRate.push(this.recentProducedCount);
    this.history.consumptionRate.push(this.recentConsumedCount);

    const throughput = (this.recentProducedCount + this.recentConsumedCount) / 2;
    this.history.throughput.push(throughput);

    this.history.emptySemaphore.push(Math.max(0, this.capacity - this.itemCount));
    this.history.fullSemaphore.push(this.itemCount);

    const avgWait = this.producers.reduce((acc, p) => acc + p.totalWaitTimeMs, 0) / (this.producers.length || 1);
    this.history.waitingTimes.push(Math.round(avgWait));

    // Keep rolling history capped at 25 points
    if (this.history.timestamps.length > 25) {
      this.history.timestamps.shift();
      this.history.bufferOccupancy.shift();
      this.history.productionRate.shift();
      this.history.consumptionRate.shift();
      this.history.throughput.shift();
      this.history.emptySemaphore.shift();
      this.history.fullSemaphore.shift();
      this.history.waitingTimes.shift();
    }

    this.stats.currentThroughput = throughput;
    this.stats.productionRate = this.recentProducedCount;
    this.stats.consumptionRate = this.recentConsumedCount;

    this.recentProducedCount = 0;
    this.recentConsumedCount = 0;

    const totalPWait = this.producers.reduce((acc, p) => acc + p.totalWaitTimeMs, 0);
    this.stats.avgProducerWaitTimeMs = Math.round(totalPWait / (this.producers.length || 1));

    const totalCWait = this.consumers.reduce((acc, c) => acc + c.totalWaitTimeMs, 0);
    this.stats.avgConsumerWaitTimeMs = Math.round(totalCWait / (this.consumers.length || 1));
  }

  // --- AI Recommendations & Inventory Forecasting Engine ---
  getAiRecommendations() {
    const recommendations = [];
    const occupancyPct = Math.round((this.itemCount / this.capacity) * 100);
    const pCount = this.producers.length;
    const cCount = this.consumers.length;
    const blockedP = this.stats.waitingProducersCount;
    const blockedC = this.stats.waitingConsumersCount;

    if (this.executionMode === SIMULATION_EXECUTION_MODES.RACE_CONDITION) {
      recommendations.push({
        type: 'DANGER',
        title: 'Concurrency Hazard Active',
        message: 'Critical section mutex is currently disabled. Re-enable synchronization immediately to prevent stock count desynchronization and data corruption.',
        action: 'Disable Race Condition'
      });
    }

    if (occupancyPct >= 85) {
      recommendations.push({
        type: 'WARNING',
        title: 'Buffer Saturation Warning',
        message: `Warehouse is at ${occupancyPct}% capacity. ${blockedP} producer threads are blocked. Recommend increasing consumer speed or expanding warehouse capacity to 100+ units.`,
        action: 'Expand Capacity'
      });
    } else if (occupancyPct <= 15 && this.isRunning) {
      recommendations.push({
        type: 'WARNING',
        title: 'Inventory Stockout Hazard',
        message: `Inventory is down to ${occupancyPct}%. ${blockedC} consumer dispatch agents are stalled. Recommend spinning up additional suppliers or activating Auto-Restocking.`,
        action: 'Auto-Restock'
      });
    }

    if (pCount > cCount * 2) {
      recommendations.push({
        type: 'INFO',
        title: 'Throughput Imbalance',
        message: `Producer to consumer ratio is ${pCount}:${cCount}. Supply will quickly outpace dispatch capacity, leading to full-buffer locks.`,
        action: 'Balance Fleet'
      });
    } else if (cCount > pCount * 2) {
      recommendations.push({
        type: 'INFO',
        title: 'Demand Deficit',
        message: `Consumer count (${cCount}) exceeds suppliers (${pCount}) by more than 2x. Starvation state imminent.`,
        action: 'Add Producers'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'OPTIMAL',
        title: 'Balanced System Performance',
        message: 'Producer and consumer flow are synchronized. Mutex lock contention is nominal and buffer occupancy is in the optimal 35-65% zone.',
        action: 'Maintain Flow'
      });
    }

    return recommendations;
  }

  // Predictive Demand & Stock Forecasting
  getInventoryForecast() {
    const rateDiff = this.stats.productionRate - this.stats.consumptionRate;
    let forecastText = 'Stable inventory levels expected.';
    let minutesToEvent = null;

    if (rateDiff > 0) {
      const remainingEmpty = this.capacity - this.itemCount;
      const secondsToFull = Math.round(remainingEmpty / (rateDiff || 1));
      minutesToEvent = (secondsToFull / 60).toFixed(1);
      forecastText = `Overstock condition projected: Buffer full in ~${secondsToFull}s at current production velocity.`;
    } else if (rateDiff < 0) {
      const secondsToEmpty = Math.round(this.itemCount / (Math.abs(rateDiff) || 1));
      minutesToEvent = (secondsToEmpty / 60).toFixed(1);
      forecastText = `Depletion alert: Warehouse empty in ~${secondsToEmpty}s at current dispatch velocity.`;
    }

    return {
      rateDiff,
      forecastText,
      minutesToEvent,
      projectedTrend: rateDiff > 0 ? 'FILLING' : rateDiff < 0 ? 'DRAINING' : 'STEADY'
    };
  }
}

// Singleton Engine Instance
export const simulationEngine = new SimulationEngine();
