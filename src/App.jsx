import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import StatsPanel from './components/StatsPanel';
import RaceConditionAlert from './components/RaceConditionAlert';
import WarehouseVisualizer from './components/WarehouseVisualizer';
import SyncMonitoringPanel from './components/SyncMonitoringPanel';
import AiRecommendationsPanel from './components/AiRecommendationsPanel';
import ProducerConsumerManager from './components/ProducerConsumerManager';
import ChartsPanel from './components/ChartsPanel';
import CodeInspector from './components/CodeInspector';
import EventLog from './components/EventLog';
import DeadlockBanner from './components/DeadlockBanner';
import EducationalModal from './components/EducationalModal';
import AdminConfigModal from './components/AdminConfigModal';
import ReportModal from './components/ReportModal';
import ProductManagementModal from './components/ProductManagementModal';
import FlowchartModal from './components/FlowchartModal';
import { simulationEngine } from './engine/simulationEngine';
import { backendWs } from './engine/webSocketService';
import { sound } from './engine/soundEffects';
import { SIMULATION_EXECUTION_MODES, SYNCHRONIZATION_MODES } from './constants/productTypes';

export default function App() {
  const [snapshot, setSnapshot] = useState(() => simulationEngine.getSnapshot());
  const [theme, setTheme] = useState('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [isFlowchartOpen, setIsFlowchartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isProductCatalogOpen, setIsProductCatalogOpen] = useState(false);

  // Spring Boot WebSocket status
  const [backendMode, setBackendMode] = useState('LOCAL');
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Set theme attribute on root
    document.documentElement.setAttribute('data-theme', theme);

    // Subscribe to local engine updates
    const unsubscribeEngine = simulationEngine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });

    // Subscribe to WebSocket status
    const unsubscribeWsStatus = backendWs.onStatusChange(({ isConnected, mode }) => {
      setBackendConnected(isConnected);
    });

    // If Spring Boot sends state over WebSocket, update snapshot
    const unsubscribeWsData = backendWs.subscribe((serverData) => {
      if (backendMode === 'SPRING_BOOT') {
        setSnapshot(prev => ({ ...prev, ...serverData }));
      }
    });

    return () => {
      unsubscribeEngine();
      unsubscribeWsStatus();
      unsubscribeWsData();
      simulationEngine.stop();
    };
  }, [theme, backendMode]);

  // Handler for Backend Mode toggle
  const handleSetBackendMode = (mode) => {
    setBackendMode(mode);
    backendWs.setMode(mode);
    if (mode === 'LOCAL') {
      simulationEngine.start();
    }
  };

  // Simulation Handlers
  const handleStart = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('start');
    } else {
      simulationEngine.start();
    }
  };

  const handlePause = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('pause');
    } else {
      simulationEngine.pause();
    }
  };

  const handleResume = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('resume');
    } else {
      simulationEngine.resume();
    }
  };

  const handleStop = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('stop');
    } else {
      simulationEngine.stop();
    }
  };

  const handleReset = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('reset');
    } else {
      simulationEngine.reset();
    }
  };

  const handleStep = () => {
    if (backendMode === 'SPRING_BOOT' && backendConnected) {
      backendWs.sendAction('step');
    } else {
      simulationEngine.step();
    }
  };

  const handleSetSpeed = (speed) => {
    simulationEngine.setSimulationSpeed(speed);
  };

  const handleSelectAlgorithm = (algo) => {
    simulationEngine.setSyncAlgorithm(algo);
  };

  const handleSelectMode = (mode) => {
    simulationEngine.setExecutionMode(mode);
  };

  const handleBreakDeadlock = () => {
    if (typeof simulationEngine.breakDeadlock === 'function') {
      simulationEngine.breakDeadlock();
    } else {
      simulationEngine.resetSyncPrimitives();
      simulationEngine.notify();
    }
  };

  const handleApplyScenario = (scenarioId) => {
    simulationEngine.applyScenario(scenarioId);
  };

  const handleToggleRaceCondition = (enable) => {
    simulationEngine.toggleRaceCondition(enable);
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '1rem' }}>
      {/* 1. Header with branding, algorithm selection, theme, sound, and navigation */}
      <Header
        snapshot={snapshot}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenEducational={() => setIsEduOpen(true)}
        onOpenFlowchart={() => setIsFlowchartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenProductCatalog={() => setIsProductCatalogOpen(true)}
        onSelectAlgorithm={handleSelectAlgorithm}
        onSelectMode={handleSelectMode}
        backendMode={backendMode}
        setBackendMode={handleSetBackendMode}
        backendConnected={backendConnected}
      />

      {/* 2. Deadlock Alert & Resolution Banner */}
      <DeadlockBanner
        snapshot={snapshot}
        onBreakDeadlock={handleBreakDeadlock}
      />

      {/* 3. Race Condition Demonstration & Hazards Banner */}
      <RaceConditionAlert
        snapshot={snapshot}
        onToggleRaceCondition={handleToggleRaceCondition}
      />

      {/* 4. Controls Bar (Play/Pause, Speed, 40-250 Capacity, Auto-Gen, Emergency, Scenarios) */}
      <ControlsBar
        snapshot={snapshot}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
        onReset={handleReset}
        onStep={handleStep}
        onSetSpeed={handleSetSpeed}
        onApplyScenario={handleApplyScenario}
        onAddProducer={(config) => simulationEngine.addProducer(config)}
        onAddConsumer={(config) => simulationEngine.addConsumer(config)}
        onAdjustProducerSpeed={(factor) => simulationEngine.adjustProducerSpeed(factor)}
        onAdjustConsumerSpeed={(factor) => simulationEngine.adjustConsumerSpeed(factor)}
        onUpdateCapacity={(cap) => simulationEngine.setCapacity(cap)}
        onAutoGenerateProducers={() => simulationEngine.autoGenerateProducers(3)}
        onAutoGenerateConsumers={() => simulationEngine.autoGenerateConsumers(3)}
        onInjectEmergencyOrder={() => simulationEngine.injectEmergencyOrder()}
        onToggleAutoRestock={() => simulationEngine.toggleAutoRestock()}
      />

      {/* 5. Main KPI Dashboard Panel (All 17 Required OS & Warehouse Metrics) */}
      <StatsPanel snapshot={snapshot} />

      {/* 6. Warehouse Bounded Buffer Visualizer (Inbound Docks, Adaptive 40-250 Racks, Outbound Docks) */}
      <WarehouseVisualizer snapshot={snapshot} />

      {/* 7. Live Synchronization Monitoring Panel (Mutex, Counting Semaphores, Timeline, Resource Matrix) */}
      <SyncMonitoringPanel snapshot={snapshot} />

      {/* 8. AI Inventory Forecasting & Recommendations Engine */}
      <AiRecommendationsPanel
        snapshot={snapshot}
        onApplyScenario={handleApplyScenario}
      />

      {/* 9. Dynamic Producer & Consumer Thread Manager (OS Thread States: Running, Waiting, Blocked, Ready, Sleeping) */}
      <ProducerConsumerManager
        snapshot={snapshot}
        onAddProducer={(config) => simulationEngine.addProducer(config)}
        onRemoveProducer={(id) => simulationEngine.removeProducer(id)}
        onUpdateProducer={(id, updates) => simulationEngine.updateProducer(id, updates)}
        onAddConsumer={(config) => simulationEngine.addConsumer(config)}
        onRemoveConsumer={(id) => simulationEngine.removeConsumer(id)}
        onUpdateConsumer={(id, updates) => simulationEngine.updateConsumer(id, updates)}
      />

      {/* 10. Performance Analytics & Live 60fps Charts */}
      <ChartsPanel snapshot={snapshot} theme={theme} />

      {/* 11. Active Code Line Inspector & Educational Syntax Tracer */}
      <CodeInspector snapshot={snapshot} />

      {/* 12. Real-Time Event Log Panel & Export Actions */}
      <EventLog
        snapshot={snapshot}
        onClearLogs={() => {
          simulationEngine.logs = [];
          simulationEngine.notify();
        }}
      />

      {/* Educational Guide Modal (9 Theory Modules + Step Flow + 10-Question Graded Quiz) */}
      <EducationalModal
        isOpen={isEduOpen}
        onClose={() => setIsEduOpen(false)}
      />

      {/* Interactive Flowchart Modal */}
      <FlowchartModal
        isOpen={isFlowchartOpen}
        onClose={() => setIsFlowchartOpen(false)}
      />

      {/* Admin & Warehouse Capacity Configuration Modal (40-250 units) */}
      <AdminConfigModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        snapshot={snapshot}
        onUpdateCapacity={(cap) => simulationEngine.setCapacity(cap)}
        onReset={() => simulationEngine.reset()}
      />

      {/* Product Management & Live Package Tracking Catalog Modal */}
      <ProductManagementModal
        isOpen={isProductCatalogOpen}
        onClose={() => setIsProductCatalogOpen(false)}
        snapshot={snapshot}
      />

      {/* Executive Report & Export Suite Modal (9 Reports in PDF, CSV, Excel) */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        snapshot={snapshot}
      />
    </div>
  );
}
