import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  RotateCcw,
  Play,
  Copy,
  Check
} from 'lucide-react';

export default function FlowchartView() {
  const [activeFlow, setActiveFlow] = useState('producer'); // 'producer' | 'consumer' | 'system'
  const [highlightedStep, setHighlightedStep] = useState(null);
  const [copied, setCopied] = useState(false);

  // Producer Flowchart Steps definition
  const producerSteps = [
    {
      id: 1,
      type: 'terminal',
      title: '1. Start Cycle',
      code: 'while (true) { ... }',
      desc: 'Producer thread wakes up to prepare the next item.',
      status: 'Ready'
    },
    {
      id: 2,
      type: 'action',
      title: '2. Produce Item',
      code: 'produce_item(&item);',
      desc: 'Generates product in private local memory outside the critical section.',
      status: 'Active'
    },
    {
      id: 3,
      type: 'decision',
      title: '3. Check Buffer Space (wait(empty))',
      code: 'wait(empty); // or empty.acquire()',
      desc: 'Checks if empty slots > 0. If empty == 0 (buffer full), the thread BLOCKS until a consumer frees a slot.',
      condition: 'Is Buffer Full? (empty == 0)',
      noBranch: 'Wait in Empty Queue',
      yesBranch: 'Decrement empty (empty--) & Proceed'
    },
    {
      id: 4,
      type: 'decision',
      title: '4. Acquire Mutex (wait(mutex))',
      code: 'wait(mutex); // or mutex.acquire()',
      desc: 'Ensures exclusive access. If mutex == 0 (locked by another thread), thread BLOCKS.',
      condition: 'Is Mutex Locked? (mutex == 0)',
      noBranch: 'Wait for Lock Release',
      yesBranch: 'Lock Acquired (mutex = 0)'
    },
    {
      id: 5,
      type: 'critical',
      title: '5. Critical Section: Write to Buffer',
      code: 'buffer[in] = item;\nin = (in + 1) % BUFFER_SIZE;\ncount++;',
      desc: 'Mutually exclusive zone: safe atomic insertion into circular FIFO buffer slot.',
      status: 'Locked / Exclusive'
    },
    {
      id: 6,
      type: 'action',
      title: '6. Release Mutex (signal(mutex))',
      code: 'signal(mutex); // or mutex.release()',
      desc: 'Unlocks the critical section (mutex = 1). Other waiting threads can now enter.',
      status: 'Unlocked'
    },
    {
      id: 7,
      type: 'action',
      title: '7. Signal Consumer (signal(full))',
      code: 'signal(full); // or full.release()',
      desc: 'Increments full semaphore (full++). Wakes up any consumer thread blocked on an empty buffer.',
      status: 'Signaled'
    },
    {
      id: 8,
      type: 'terminal',
      title: '8. Loop Back',
      code: 'Repeat for next production cycle',
      desc: 'Returns to step 1 to manufacture additional items.',
      status: 'Complete'
    }
  ];

  // Consumer Flowchart Steps definition
  const consumerSteps = [
    {
      id: 1,
      type: 'terminal',
      title: '1. Start Cycle',
      code: 'while (true) { ... }',
      desc: 'Consumer thread wakes up ready to fulfill order / retrieve product.',
      status: 'Ready'
    },
    {
      id: 2,
      type: 'decision',
      title: '2. Check Available Items (wait(full))',
      code: 'wait(full); // or full.acquire()',
      desc: 'Checks if full items > 0. If full == 0 (buffer empty), the thread BLOCKS until a producer adds an item.',
      condition: 'Is Buffer Empty? (full == 0)',
      noBranch: 'Wait in Full Queue',
      yesBranch: 'Decrement full (full--) & Proceed'
    },
    {
      id: 3,
      type: 'decision',
      title: '3. Acquire Mutex (wait(mutex))',
      code: 'wait(mutex); // or mutex.acquire()',
      desc: 'Ensures exclusive access. If mutex == 0 (locked by another thread), thread BLOCKS.',
      condition: 'Is Mutex Locked? (mutex == 0)',
      noBranch: 'Wait for Lock Release',
      yesBranch: 'Lock Acquired (mutex = 0)'
    },
    {
      id: 4,
      type: 'critical',
      title: '4. Critical Section: Read from Buffer',
      code: 'item = buffer[out];\nout = (out + 1) % BUFFER_SIZE;\ncount--;',
      desc: 'Mutually exclusive zone: safe atomic extraction from circular FIFO buffer slot.',
      status: 'Locked / Exclusive'
    },
    {
      id: 5,
      type: 'action',
      title: '5. Release Mutex (signal(mutex))',
      code: 'signal(mutex); // or mutex.release()',
      desc: 'Unlocks the critical section (mutex = 1). Other waiting threads can now enter.',
      status: 'Unlocked'
    },
    {
      id: 6,
      type: 'action',
      title: '6. Signal Producer (signal(empty))',
      code: 'signal(empty); // or empty.release()',
      desc: 'Increments empty semaphore (empty++). Wakes up any producer thread blocked on a full buffer.',
      status: 'Signaled'
    },
    {
      id: 7,
      type: 'action',
      title: '7. Consume Item',
      code: 'consume_item(&item);',
      desc: 'Processes, packs, or ships product in private memory outside the critical section.',
      status: 'Active'
    },
    {
      id: 8,
      type: 'terminal',
      title: '8. Loop Back',
      code: 'Repeat for next consumption cycle',
      desc: 'Returns to step 1 to process subsequent requests.',
      status: 'Complete'
    }
  ];

  const currentSteps = activeFlow === 'producer' ? producerSteps : consumerSteps;

  const handleCopyMermaid = () => {
    const mermaidCode = activeFlow === 'producer' 
      ? `flowchart TD
    Start([Start Producer Thread]) --> Produce[Produce Item in Memory]
    Produce --> CheckEmpty{Buffer Full?\\nempty == 0?}
    CheckEmpty -- Yes: Buffer Full --> BlockEmpty[Block & Sleep in Empty Queue]
    BlockEmpty -.->|Woken by Consumer signal(empty)| CheckEmpty
    CheckEmpty -- No: Slots Available --> MutexCheck{Mutex Locked?\\nmutex == 0?}
    MutexCheck -- Yes: Locked --> BlockMutex[Wait for Mutex Lock]
    BlockMutex -.->|Lock Released| MutexCheck
    MutexCheck -- No: Free --> Critical[Critical Section\\nbuffer[in] = item\\nin = (in + 1) % N]
    Critical --> ReleaseMutex[Release Mutex\\nsignal(mutex)]
    ReleaseMutex --> SignalConsumer[Signal Consumer\\nsignal(full)]
    SignalConsumer --> Loop([Repeat Cycle])
    Loop --> Produce`
      : `flowchart TD
    Start([Start Consumer Thread]) --> CheckFull{Buffer Empty?\\nfull == 0?}
    CheckFull -- Yes: Buffer Empty --> BlockFull[Block & Sleep in Full Queue]
    BlockFull -.->|Woken by Producer signal(full)| CheckFull
    CheckFull -- No: Items Available --> MutexCheck{Mutex Locked?\\nmutex == 0?}
    MutexCheck -- Yes: Locked --> BlockMutex[Wait for Mutex Lock]
    BlockMutex -.->|Lock Released| MutexCheck
    MutexCheck -- No: Free --> Critical[Critical Section\\nitem = buffer[out]\\nout = (out + 1) % N]
    Critical --> ReleaseMutex[Release Mutex\\nsignal(mutex)]
    ReleaseMutex --> SignalProducer[Signal Producer\\nsignal(empty)]
    SignalProducer --> Consume[Consume / Ship Item]
    Consume --> Loop([Repeat Cycle])
    Loop --> CheckFull`;

    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Header & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--bg-tertiary)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Flow Selector Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              setActiveFlow('producer');
              setHighlightedStep(null);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeFlow === 'producer' ? 'var(--accent-producer)' : 'var(--bg-secondary)',
              color: activeFlow === 'producer' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid ' + (activeFlow === 'producer' ? 'var(--accent-producer)' : 'var(--border-color)'),
              transition: 'all 150ms ease'
            }}
          >
            <Boxes size={15} /> Producer Flowchart
          </button>

          <button
            onClick={() => {
              setActiveFlow('consumer');
              setHighlightedStep(null);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeFlow === 'consumer' ? 'var(--accent-consumer)' : 'var(--bg-secondary)',
              color: activeFlow === 'consumer' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid ' + (activeFlow === 'consumer' ? 'var(--accent-consumer)' : 'var(--border-color)'),
              transition: 'all 150ms ease'
            }}
          >
            <Cpu size={15} /> Consumer Flowchart
          </button>

          <button
            onClick={() => {
              setActiveFlow('system');
              setHighlightedStep(null);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeFlow === 'system' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
              color: activeFlow === 'system' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid ' + (activeFlow === 'system' ? 'var(--accent-blue)' : 'var(--border-color)'),
              transition: 'all 150ms ease'
            }}
          >
            <Layers size={15} /> System Architecture
          </button>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyMermaid}
            title="Copy Flowchart Mermaid Syntax"
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--accent-producer)' }} /> : <Copy size={14} />}
            {copied ? 'Copied Mermaid!' : 'Copy Mermaid Code'}
          </button>
        </div>
      </div>

      {/* Legend & Guide */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '8px 14px',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontSize: '0.74rem'
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Legend:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)' }} />
          <span>Start / Loop (Terminal)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '12px', borderRadius: '3px', background: 'var(--accent-blue)' }} />
          <span>Action / Process</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              transform: 'rotate(45deg)',
              background: 'var(--accent-warning)',
              borderRadius: '2px'
            }}
          />
          <span>Semaphore Decision Check</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '14px',
              height: '12px',
              borderRadius: '3px',
              background: 'linear-gradient(135deg, #ef4444, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '8px'
            }}
          >
            <Lock size={8} />
          </div>
          <span>Critical Section (Locked)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '12px', borderRadius: '3px', background: 'var(--accent-danger)' }} />
          <span>Thread Blocked / Waiting</span>
        </div>
      </div>

      {/* FLOW VIEW 1 & 2: PRODUCER / CONSUMER DIAGRAM */}
      {activeFlow !== 'system' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Flowchart Diagram Tree */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {currentSteps.map((step, idx) => {
              const isHighlighted = highlightedStep === step.id;
              const isProducer = activeFlow === 'producer';
              const accentColor = isProducer ? 'var(--accent-producer)' : 'var(--accent-consumer)';

              return (
                <React.Fragment key={step.id}>
                  {/* Step Card / Node */}
                  <div
                    onClick={() => setHighlightedStep(isHighlighted ? null : step.id)}
                    style={{
                      width: '100%',
                      maxWidth: '440px',
                      cursor: 'pointer',
                      borderRadius: step.type === 'terminal' ? '25px' : '10px',
                      padding: '10px 14px',
                      background: isHighlighted
                        ? 'var(--bg-secondary)'
                        : step.type === 'critical'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))'
                        : step.type === 'decision'
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'var(--bg-secondary)',
                      border: isHighlighted
                        ? `2px solid ${accentColor}`
                        : step.type === 'critical'
                        ? '2px solid rgba(239, 68, 68, 0.5)'
                        : step.type === 'decision'
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : '1px solid var(--border-color)',
                      boxShadow: isHighlighted ? `0 0 16px ${isProducer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'}` : 'var(--shadow-sm)',
                      transform: isHighlighted ? 'scale(1.02)' : 'none',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {step.type === 'terminal' && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: accentColor }} />
                        )}
                        {step.type === 'decision' && (
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              transform: 'rotate(45deg)',
                              background: 'var(--accent-warning)',
                              borderRadius: '2px'
                            }}
                          />
                        )}
                        {step.type === 'critical' && (
                          <Lock size={15} style={{ color: 'var(--accent-danger)' }} />
                        )}
                        {step.type === 'action' && (
                          <CheckCircle2 size={15} style={{ color: accentColor }} />
                        )}

                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: step.type === 'critical' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-tertiary)',
                          color: step.type === 'critical' ? 'var(--accent-danger)' : 'var(--text-secondary)'
                        }}
                      >
                        {step.code.split('\n')[0]}
                      </span>
                    </div>

                    {/* Decision Branch Visualization */}
                    {step.type === 'decision' && (
                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '6px',
                          borderTop: '1px dashed var(--border-color)',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '6px',
                          fontSize: '0.72rem'
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '4px 6px',
                            borderRadius: '5px',
                            color: 'var(--accent-danger)'
                          }}
                        >
                          <strong>[NO]</strong> {step.noBranch}
                        </div>
                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '4px 6px',
                            borderRadius: '5px',
                            color: 'var(--accent-producer)'
                          }}
                        >
                          <strong>[YES]</strong> {step.yesBranch}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow */}
                  {idx < currentSteps.length - 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                      <ArrowDown size={18} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right Panel: Step Detail & OS Principles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Active Step Explainer Card */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                padding: '1.2rem',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} style={{ color: activeFlow === 'producer' ? 'var(--accent-producer)' : 'var(--accent-consumer)' }} />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {highlightedStep ? currentSteps.find(s => s.id === highlightedStep)?.title : 'Interactive Step Inspector'}
                </h4>
              </div>

              {highlightedStep ? (
                (() => {
                  const s = currentSteps.find(st => st.id === highlightedStep);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        {s.desc}
                      </p>

                      <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                          SYNCHRONIZATION CODE
                        </div>
                        <pre style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {s.code}
                        </pre>
                      </div>

                      <button
                        onClick={() => setHighlightedStep(null)}
                        style={{
                          alignSelf: 'flex-start',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.74rem',
                          color: 'var(--accent-blue)',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600
                        }}
                      >
                        Reset Selection
                      </button>
                    </div>
                  );
                })()
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Click any flowchart node on the left to inspect its exact synchronization logic, atomic operations, and how it prevents deadlocks or buffer corruption.
                </p>
              )}
            </div>

            {/* Invariants & Rules */}
            <div
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                padding: '1.2rem',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeFlow === 'producer' ? 'Producer Critical Invariants' : 'Consumer Critical Invariants'}
              </h4>

              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeFlow === 'producer' ? (
                  <>
                    <li>
                      <strong>Ordering is vital:</strong> <code>wait(empty)</code> MUST precede <code>wait(mutex)</code>. Swapping them causes DEADLOCK if buffer is full!
                    </li>
                    <li>
                      <strong>Buffer bounds:</strong> Modulo increment <code>(in + 1) % N</code> prevents out-of-bounds array access.
                    </li>
                    <li>
                      <strong>Signal waking:</strong> <code>signal(full)</code> alerts blocked consumers that an item is now ready.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <strong>Ordering is vital:</strong> <code>wait(full)</code> MUST precede <code>wait(mutex)</code>. Swapping them causes DEADLOCK if buffer is empty!
                    </li>
                    <li>
                      <strong>Buffer bounds:</strong> Modulo increment <code>(out + 1) % N</code> prevents out-of-bounds array access.
                    </li>
                    <li>
                      <strong>Signal waking:</strong> <code>signal(empty)</code> alerts blocked producers that buffer space is now free.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FLOW VIEW 3: FULL SYSTEM ARCHITECTURE FLOW */}
      {activeFlow === 'system' && (
        <div
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Complete End-to-End System Synchronization Flow
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              How Producers, Consumers, Counting Semaphores, and Mutex Locks interact in Shared Memory
            </p>
          </div>

          {/* 3-Column Pipeline Architecture */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.3fr 1.2fr 0.3fr 1fr',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Producers Column */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid var(--accent-producer)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Boxes size={18} style={{ color: 'var(--accent-producer)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-producer)' }}>
                  PRODUCERS (1..P)
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Concurrent threads manufacturing packages.
              </p>
              <div style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '6px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                1. wait(empty)<br />
                2. wait(mutex)<br />
                3. put in buffer<br />
                4. signal(mutex)<br />
                5. signal(full)
              </div>
            </div>

            {/* Connector Arrow 1 */}
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <ArrowRight size={24} />
            </div>

            {/* Central Shared Memory & Synchronization Hub */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '1.2rem',
                border: '2px solid var(--accent-blue)',
                boxShadow: 'var(--glow-blue)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    SHARED BOUNDED BUFFER (FIFO)
                  </span>
                </div>
                <span className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  CRITICAL SECTION
                </span>
              </div>

              {/* Semaphores status bars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '6px 8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>SEMAPHORE</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-producer)' }}>empty = N</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '6px 8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>MUTEX LOCK</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-warning)' }}>mutex = 1</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '6px 8px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 700 }}>SEMAPHORE</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-consumer)' }}>full = 0</div>
                </div>
              </div>

              <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Capacity = N slots &bull; Pointers: in (write) and out (read)
              </div>
            </div>

            {/* Connector Arrow 2 */}
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <ArrowRight size={24} />
            </div>

            {/* Consumers Column */}
            <div
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid var(--accent-consumer)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} style={{ color: 'var(--accent-consumer)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--accent-consumer)' }}>
                  CONSUMERS (1..C)
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Concurrent threads fulfilling customer orders.
              </p>
              <div style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '6px', borderRadius: '6px', color: 'var(--text-primary)' }}>
                1. wait(full)<br />
                2. wait(mutex)<br />
                3. take from buffer<br />
                4. signal(mutex)<br />
                5. signal(empty)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
