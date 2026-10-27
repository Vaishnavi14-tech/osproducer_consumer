import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Cpu,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileCode,
  Layers,
  HelpCircle,
  ArrowRight,
  Database,
  Users,
  Award,
  Sparkles,
  RotateCcw,
  GitFork
} from 'lucide-react';
import FlowchartView from './FlowchartView';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'In the Producer-Consumer problem with a bounded buffer of size N, what initial value should the empty semaphore have?',
    options: ['0', '1', 'N', 'N - 1'],
    correct: 2,
    explanation: 'The empty semaphore tracks available empty slots in the buffer, so it is initialized to the total buffer capacity N.'
  },
  {
    id: 2,
    question: 'Why must the mutex lock be acquired AFTER wait(empty) and not before in the producer flow?',
    options: [
      'To prevent deadlock when the buffer is full',
      'To allow consumers to read while producing',
      'Because semaphores require alphabetical order',
      'It does not matter which is called first'
    ],
    correct: 0,
    explanation: 'If a producer locks the mutex before wait(empty) and the buffer is full, it blocks holding the mutex. The consumer can never enter the critical section to consume and free space, causing a deadlock!'
  },
  {
    id: 3,
    question: 'What are the three essential requirements of a solution to the Critical Section problem?',
    options: [
      'Mutual Exclusion, Progress, and Bounded Waiting',
      'Semaphores, Mutexes, and Monitors',
      'Atomicity, Consistency, and Durability',
      'High Priority, Low Latency, and Fast CPU'
    ],
    correct: 0,
    explanation: 'Dijkstra and Operating System theory defines Mutual Exclusion (only 1 thread inside), Progress (no deadlock when selecting next thread), and Bounded Waiting (no starvation).'
  },
  {
    id: 4,
    question: 'What is a Race Condition?',
    options: [
      'When two threads compete for fastest execution without errors',
      'When multiple threads access and manipulate shared data concurrently and the outcome depends on the order of execution',
      'A hardware error when the CPU clock frequency exceeds thermal limits',
      'When a consumer finishes before a producer'
    ],
    correct: 1,
    explanation: 'A race condition occurs when concurrent threads access shared data without synchronization, causing non-deterministic results and data corruption (like lost updates).'
  },
  {
    id: 5,
    question: 'What happens when a Consumer thread executes wait(full) when full == 0?',
    options: [
      'It immediately reads NULL from the buffer',
      'It terminates with an underflow exception',
      'It blocks and enters the waiting queue until a producer signals that an item is available',
      'The operating system restarts the simulation'
    ],
    correct: 2,
    explanation: 'The counting semaphore wait operation suspends (blocks) the thread when the value is <= 0 until another thread increments it via signal().'
  },
  {
    id: 6,
    question: 'What is the key difference between a Binary Semaphore and a Mutex Lock?',
    options: [
      'They are identical in all Operating Systems',
      'A Mutex has ownership semantics (only the thread that locked it can unlock it), whereas any thread can signal a semaphore',
      'Semaphores can only be used in hardware',
      'Mutex locks cannot prevent race conditions'
    ],
    correct: 1,
    explanation: 'A Mutex enforces thread ownership (the owning thread must release it), making it suitable for mutual exclusion, whereas semaphores are signaling mechanisms.'
  },
  {
    id: 7,
    question: 'Which of the following is NOT one of Coffman’s four necessary conditions for Deadlock?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemption of locks by the Operating System',
      'Circular Wait'
    ],
    correct: 2,
    explanation: 'No Preemption is the condition (resources cannot be forcibly taken). If preemption is allowed, deadlock is broken!'
  },
  {
    id: 8,
    question: 'In thread management, which state represents a thread waiting for an I/O event, semaphore signal, or lock release?',
    options: ['Running', 'Blocked / Waiting', 'Ready', 'Terminated'],
    correct: 1,
    explanation: 'A Blocked / Waiting thread cannot be scheduled on the CPU until the synchronization event or resource it is waiting on occurs.'
  },
  {
    id: 9,
    question: 'In a circular FIFO bounded buffer with capacity N, how are the in and out pointers incremented?',
    options: [
      'in = (in + 1) % N and out = (out + 1) % N',
      'in = in + 1 and out = out + 1',
      'in = in * 2 and out = out / 2',
      'in = Math.random() * N'
    ],
    correct: 0,
    explanation: 'Using the modulo operator (index + 1) % N wraps the pointers back to index 0 when reaching the end of the buffer, forming a circular ring.'
  },
  {
    id: 10,
    question: 'What is Priority Inversion in multithreaded systems?',
    options: [
      'When high-priority threads run faster than low-priority threads',
      'When a lower-priority thread holds a lock needed by a higher-priority thread, and a medium thread preempts the lower thread',
      'Reversing the order of producers and consumers',
      'When CPU cores are inverted'
    ],
    correct: 1,
    explanation: 'Priority Inversion occurs when a high-priority thread is indirectly blocked by a medium-priority thread because a low-priority thread holds a required mutex lock.'
  }
];

export default function EducationalModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'semaphores', 'mutex', 'sync', 'race', 'critical', 'buffer', 'threads', 'deadlock', 'flow', 'quiz'

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (questionId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', height: '88vh', display: 'flex', flexDirection: 'column' }}
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
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
                Operating System Concurrency & Synchronization Learning Lab
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>
                Interactive Educational Modules &bull; Semaphores, Mutex, Critical Sections &bull; Step Flow & Quiz
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

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 1.4rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'problem', label: '1. Producer-Consumer', icon: Layers },
            { id: 'semaphores', label: '2. Semaphores', icon: Database },
            { id: 'mutex', label: '3. Mutex Locks', icon: Lock },
            { id: 'sync', label: '4. Synchronization', icon: Cpu },
            { id: 'race', label: '5. Race Conditions', icon: Flame },
            { id: 'critical', label: '6. Critical Section', icon: Eye },
            { id: 'buffer', label: '7. Bounded Buffer', icon: Layers },
            { id: 'threads', label: '8. Thread States', icon: Users },
            { id: 'deadlock', label: '9. Deadlock Prevention', icon: AlertTriangle },
            { id: 'flow', label: '10. Flowcharts & Logic', icon: GitFork },
            { id: 'quiz', label: 'Interactive OS Quiz', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '7px',
                  fontSize: '0.72rem',
                  fontWeight: isSel ? 800 : 500,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: isSel ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  color: isSel ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${isSel ? 'var(--accent-blue)' : 'var(--border-color)'}`
                }}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* TAB 1: Producer-Consumer Problem */}
          {activeTab === 'problem' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                The Classical Producer-Consumer (Bounded Buffer) Problem
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Formulated by Edsger W. Dijkstra in 1965, the Producer-Consumer problem is the cornerstone archetype of concurrent process synchronization in modern operating systems. Two classes of concurrent threads share a fixed-size storage buffer:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--accent-producer)', margin: '0 0 6px 0', fontSize: '0.95rem' }}>The Producer (Supplier)</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Continuously manufactures or ingests items and deposits them into the warehouse buffer. If the warehouse reaches capacity, the producer must be put to sleep (blocked) until a consumer removes an item.
                  </p>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--accent-consumer)', margin: '0 0 6px 0', fontSize: '0.95rem' }}>The Consumer (Delivery Agent)</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Continuously retrieves and dispatches items from the warehouse buffer. If the warehouse is completely empty, the consumer must block until a producer generates an item.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Semaphores */}
          {activeTab === 'semaphores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                Counting & Binary Semaphores
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                A semaphore is an integer variable accessed only through two atomic operations: <code>wait()</code> (originally <i>P()</i> from Dutch <i>proberen</i>) and <code>signal()</code> (originally <i>V()</i> from Dutch <i>verhogen</i>).
              </p>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>The Two Core Counting Semaphores in Our Warehouse:</h4>
                <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                  <li><strong>empty Semaphore:</strong> Initialized to warehouse capacity <code>N</code>. Tracks empty slots. Decrements on each produce; increments on each consume.</li>
                  <li><strong>full Semaphore:</strong> Initialized to <code>0</code>. Tracks stored products. Increments on each produce; decrements on each consume.</li>
                  <li><strong>mutex Semaphore:</strong> Initialized to <code>1</code>. Binary semaphore ensuring only 1 thread writes/reads from buffer at a time.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Mutex Locks */}
          {activeTab === 'mutex' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                Mutual Exclusion Locks (Mutex)
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                A Mutex is a locking mechanism used to synchronize access to a resource. It is owned by the thread that acquires it, and only that same thread can unlock it. If another thread tries to acquire the lock while it is held, that thread is suspended in the mutex wait queue.
              </p>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 6px 0', fontSize: '0.9rem' }}>Why Binary Semaphore != Mutex</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  While both have values 0 and 1, a Mutex possesses <strong>ownership semantics</strong> and supports <strong>priority inheritance</strong> to prevent priority inversion bugs. Any thread can signal a binary semaphore, but only the lock owner can release a Mutex.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Synchronization */}
          {activeTab === 'sync' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                Process Synchronization
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Synchronization ensures that concurrently executing processes share system resources without conflict. Without synchronization, memory race conditions, corrupted stock lists, and buffer overflows inevitably occur.
              </p>
            </div>
          )}

          {/* TAB 5: Race Conditions */}
          {activeTab === 'race' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-danger)', margin: 0 }}>
                Race Conditions & Lost Updates
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                A Race Condition occurs when multiple threads read and write shared data concurrently and the final result depends on thread execution scheduling.
              </p>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <h4 style={{ color: 'var(--accent-danger)', margin: '0 0 6px 0', fontSize: '0.9rem' }}>The Read-Modify-Write Vulnerability:</h4>
                <pre style={{ fontSize: '0.75rem', color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '6px' }}>
{`// Thread 1 (Producer A)        // Thread 2 (Producer B)
1. Read count (e.g. 10)
                                1. Read count (10)
2. Increment (11)
                                2. Increment (11)
3. Write back count = 11
                                3. Write back count = 11
// Result: 2 items added, but count only increased by 1! (Lost Update)`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: Critical Section */}
          {activeTab === 'critical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                The Critical Section Problem
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                The Critical Section is the block of code where shared resources (e.g. the warehouse inventory array, the in/out pointers) are accessed and updated. Any valid solution must satisfy:
              </p>
              <ol style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li><strong>Mutual Exclusion:</strong> If thread P is executing in its critical section, no other threads can execute in their critical sections.</li>
                <li><strong>Progress:</strong> If no thread is executing in its critical section and some threads wish to enter, only those threads not in remainder sections participate in selecting who enters next.</li>
                <li><strong>Bounded Waiting:</strong> A bound must exist on the number of times other threads enter their critical sections after a thread has requested entry, preventing indefinite starvation.</li>
              </ol>
            </div>
          )}

          {/* TAB 7: Bounded Buffer */}
          {activeTab === 'buffer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                Circular FIFO Bounded Buffer
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                The warehouse storage acts as a circular bounded array with size N. Two index pointers cycle modulo N:
              </p>
              <pre style={{ fontSize: '0.78rem', background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)' }}>
{`inIndex = (inIndex + 1) % capacity;   // Producer next write slot
outIndex = (outIndex + 1) % capacity; // Consumer next read slot`}
              </pre>
            </div>
          )}

          {/* TAB 8: Thread States */}
          {activeTab === 'threads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                Operating System Thread Lifecycle States
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-producer)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-producer)' }}>Running</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Executing instructions on CPU inside critical section or producing/consuming.</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-warning)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-warning)' }}>Waiting</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Suspended waiting for Mutex lock acquisition.</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-danger)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-danger)' }}>Blocked</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Blocked on wait(empty) [Full buffer] or wait(full) [Empty buffer].</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>Ready</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Product prepared, awaiting turn to acquire synchronization primitive.</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}>
                  <div style={{ fontWeight: 800, color: '#8b5cf6' }}>Sleeping</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Idle delay cycle between successive operations.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Deadlock Prevention */}
          {activeTab === 'deadlock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-danger)', margin: 0 }}>
                Deadlock Principles & Coffman Conditions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                A Deadlock occurs when every process in a set is waiting for an event that can only be caused by another process in the set. Coffman's four conditions:
              </p>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                <li><strong>Mutual Exclusion:</strong> At least one resource must be held in non-shareable mode.</li>
                <li><strong>Hold and Wait:</strong> A process must be holding a resource and waiting to acquire additional resources.</li>
                <li><strong>No Preemption:</strong> Resources cannot be preempted; only released voluntarily.</li>
                <li><strong>Circular Wait:</strong> A set of waiting processes {'{P0, P1... Pn}'} exists such that P0 waits for P1, and Pn waits for P0.</li>
              </ul>
            </div>
          )}

          {/* TAB 10: Step-by-Step Flow & Interactive Flowcharts */}
          {activeTab === 'flow' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                    Operating System Synchronization Flowcharts
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Visual flow of Producer & Consumer execution loops, semaphore checks, and critical sections
                  </p>
                </div>
              </div>

              <FlowchartView />
            </div>
          )}

          {/* TAB 11: Interactive OS Quiz */}
          {activeTab === 'quiz' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                    Operating System Concurrency Knowledge Assessment
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    10 Challenging Multiple Choice Questions with Explanations & Scoring
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {quizSubmitted ? (
                    <button
                      onClick={handleResetQuiz}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '6px 14px',
                        borderRadius: '7px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RotateCcw size={14} /> Retake Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleGradeQuiz}
                      style={{
                        background: 'var(--accent-blue)',
                        color: '#ffffff',
                        padding: '6px 16px',
                        borderRadius: '7px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Award size={14} /> Submit & Grade
                    </button>
                  )}
                </div>
              </div>

              {/* Score Banner when Submitted */}
              {quizSubmitted && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.15))',
                    border: '1px solid var(--accent-blue)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={26} style={{ color: 'var(--accent-blue)' }} />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Your Score: {calculateScore()} / {QUIZ_QUESTIONS.length} ({Math.round((calculateScore() / QUIZ_QUESTIONS.length) * 100)}%)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {calculateScore() >= 8 ? '🎉 Outstanding Master of OS Concurrency!' : calculateScore() >= 5 ? '👍 Solid Knowledge! Review explanations below.' : '📚 Keep studying! Review the theory modules.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const selectedOpt = quizAnswers[q.id];
                  const isCorrect = selectedOpt === q.correct;

                  return (
                    <div
                      key={q.id}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: quizSubmitted
                          ? isCorrect
                            ? '1px solid rgba(16, 185, 129, 0.5)'
                            : '1px solid rgba(239, 68, 68, 0.5)'
                          : '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {idx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          const isAnswerCorrect = q.correct === optIdx;

                          let bg = 'var(--bg-secondary)';
                          let border = '1px solid var(--border-color)';
                          let color = 'var(--text-primary)';

                          if (quizSubmitted) {
                            if (isAnswerCorrect) {
                              bg = 'var(--accent-producer-bg)';
                              border = '1px solid var(--accent-producer)';
                              color = 'var(--accent-producer)';
                            } else if (isSelected && !isAnswerCorrect) {
                              bg = 'var(--accent-danger-bg)';
                              border = '1px solid var(--accent-danger)';
                              color = 'var(--accent-danger)';
                            }
                          } else if (isSelected) {
                            bg = 'var(--accent-blue-light)';
                            border = '1px solid var(--accent-blue)';
                            color = 'var(--accent-blue)';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              style={{
                                textAlign: 'left',
                                padding: '8px 12px',
                                borderRadius: '7px',
                                fontSize: '0.78rem',
                                fontWeight: isSelected ? 700 : 500,
                                background: bg,
                                border: border,
                                color: color,
                                transition: 'all 120ms ease'
                              }}
                            >
                              <span style={{ fontWeight: 800, marginRight: '8px' }}>
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation shown after submission */}
                      {quizSubmitted && (
                        <div
                          style={{
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid var(--border-color)',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
