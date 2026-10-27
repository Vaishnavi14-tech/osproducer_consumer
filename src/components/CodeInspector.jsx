import React, { useState } from 'react';
import { Code2, Terminal, Cpu, Lock, Eye, Play, Sparkles } from 'lucide-react';
import { SYNCHRONIZATION_MODES } from '../constants/productTypes';

export default function CodeInspector({ snapshot }) {
  const [language, setLanguage] = useState('java'); // 'c', 'java', 'python'

  const { syncAlgorithm, activeCodeLine } = snapshot;

  // Code templates according to algorithm and language
  const codeSnippets = {
    [SYNCHRONIZATION_MODES.SEMAPHORE]: {
      java: [
        { line: 1, text: '// Java Semaphore Bounded Buffer' },
        { line: 2, text: 'Semaphore mutex = new Semaphore(1);' },
        { line: 3, text: 'Semaphore empty = new Semaphore(CAPACITY);' },
        { line: 4, text: 'Semaphore full = new Semaphore(0);' },
        { line: 5, text: '' },
        { line: 6, text: 'void produce(Product item) throws InterruptedException {' },
        { line: 7, text: '    empty.acquire(); // wait(empty)' },
        { line: 8, text: '    mutex.acquire(); // wait(mutex)' },
        { line: 9, text: '    buffer[in] = item;' },
        { line: 10, text: '    in = (in + 1) % CAPACITY;' },
        { line: 11, text: '    mutex.release(); // signal(mutex)' },
        { line: 12, text: '    full.release();  // signal(full)' },
        { line: 13, text: '}' },
        { line: 14, text: '' },
        { line: 15, text: 'Product consume() throws InterruptedException {' },
        { line: 16, text: '    full.acquire();  // wait(full)' },
        { line: 17, text: '    mutex.acquire(); // wait(mutex)' },
        { line: 18, text: '    Product item = buffer[out];' },
        { line: 19, text: '    out = (out + 1) % CAPACITY;' },
        { line: 20, text: '    mutex.release(); // signal(mutex)' },
        { line: 21, text: '    empty.release(); // signal(empty)' },
        { line: 22, text: '    return item;' },
        { line: 23, text: '}' }
      ],
      c: [
        { line: 1, text: '// POSIX C Semaphore Implementation' },
        { line: 2, text: 'sem_t mutex, empty, full;' },
        { line: 3, text: 'sem_init(&mutex, 0, 1);' },
        { line: 4, text: 'sem_init(&empty, 0, BUFFER_SIZE);' },
        { line: 5, text: 'sem_init(&full, 0, 0);' },
        { line: 6, text: '' },
        { line: 7, text: 'void* producer(void* arg) {' },
        { line: 8, text: '    sem_wait(&empty);' },
        { line: 9, text: '    sem_wait(&mutex);' },
        { line: 10, text: '    buffer[in] = item;' },
        { line: 11, text: '    in = (in + 1) % BUFFER_SIZE;' },
        { line: 12, text: '    sem_post(&mutex);' },
        { line: 13, text: '    sem_post(&full);' },
        { line: 14, text: '}' },
        { line: 15, text: '' },
        { line: 16, text: 'void* consumer(void* arg) {' },
        { line: 17, text: '    sem_wait(&full);' },
        { line: 18, text: '    sem_wait(&mutex);' },
        { line: 19, text: '    item = buffer[out];' },
        { line: 20, text: '    out = (out + 1) % BUFFER_SIZE;' },
        { line: 21, text: '    sem_post(&mutex);' },
        { line: 22, text: '    sem_post(&empty);' },
        { line: 23, text: '}' }
      ],
      python: [
        { line: 1, text: '# Python Semaphore Bounded Buffer' },
        { line: 2, text: 'mutex = threading.Semaphore(1)' },
        { line: 3, text: 'empty = threading.Semaphore(CAPACITY)' },
        { line: 4, text: 'full = threading.Semaphore(0)' },
        { line: 5, text: '' },
        { line: 6, text: 'def produce(item):' },
        { line: 7, text: '    empty.acquire()' },
        { line: 8, text: '    with mutex:' },
        { line: 9, text: '        buffer[in_idx] = item' },
        { line: 10, text: '        in_idx = (in_idx + 1) % CAPACITY' },
        { line: 11, text: '    full.release()' },
        { line: 12, text: '' },
        { line: 13, text: 'def consume():' },
        { line: 14, text: '    full.acquire()' },
        { line: 15, text: '    with mutex:' },
        { line: 16, text: '        item = buffer[out_idx]' },
        { line: 17, text: '        out_idx = (out_idx + 1) % CAPACITY' },
        { line: 18, text: '    empty.release()' },
        { line: 19, text: '    return item' }
      ]
    },
    [SYNCHRONIZATION_MODES.MUTEX_LOCK]: {
      java: [
        { line: 1, text: '// Java ReentrantLock & Condition Variables' },
        { line: 2, text: 'private final Lock lock = new ReentrantLock();' },
        { line: 3, text: 'private final Condition notFull  = lock.newCondition();' },
        { line: 4, text: 'private final Condition notEmpty = lock.newCondition();' },
        { line: 5, text: '' },
        { line: 6, text: 'public void put(Product x) throws InterruptedException {' },
        { line: 7, text: '    lock.lock();' },
        { line: 8, text: '    try {' },
        { line: 9, text: '        while (count == items.length)' },
        { line: 10, text: '            notFull.await(); // sleep until space available' },
        { line: 11, text: '        items[putptr] = x;' },
        { line: 12, text: '        if (++putptr == items.length) putptr = 0;' },
        { line: 13, text: '        ++count;' },
        { line: 14, text: '        notEmpty.signal(); // wake sleeping consumers' },
        { line: 15, text: '    } finally { lock.unlock(); }' },
        { line: 16, text: '}' },
        { line: 17, text: '' },
        { line: 18, text: 'public Product take() throws InterruptedException {' },
        { line: 19, text: '    lock.lock();' },
        { line: 20, text: '    try {' },
        { line: 21, text: '        while (count == 0)' },
        { line: 22, text: '            notEmpty.await(); // sleep until item available' },
        { line: 23, text: '        Product x = items[takeptr];' },
        { line: 24, text: '        if (++takeptr == items.length) takeptr = 0;' },
        { line: 25, text: '        --count;' },
        { line: 26, text: '        notFull.signal(); // wake sleeping producers' },
        { line: 27, text: '        return x;' },
        { line: 28, text: '    } finally { lock.unlock(); }' },
        { line: 29, text: '}' }
      ],
      c: [
        { line: 1, text: '// POSIX pthread_mutex & pthread_cond' },
        { line: 2, text: 'pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;' },
        { line: 3, text: 'pthread_cond_t not_full = PTHREAD_COND_INITIALIZER;' },
        { line: 4, text: 'pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;' },
        { line: 5, text: '' },
        { line: 6, text: 'void produce(item_t item) {' },
        { line: 7, text: '    pthread_mutex_lock(&lock);' },
        { line: 8, text: '    while (count == CAPACITY) {' },
        { line: 9, text: '        pthread_cond_wait(&not_full, &lock);' },
        { line: 10, text: '    }' },
        { line: 11, text: '    buffer[in] = item;' },
        { line: 12, text: '    count++;' },
        { line: 13, text: '    pthread_cond_signal(&not_empty);' },
        { line: 14, text: '    pthread_mutex_unlock(&lock);' },
        { line: 15, text: '}' }
      ],
      python: [
        { line: 1, text: '# Python Lock & Condition' },
        { line: 2, text: 'cv = threading.Condition()' },
        { line: 3, text: '' },
        { line: 4, text: 'def produce(item):' },
        { line: 5, text: '    with cv:' },
        { line: 6, text: '        while len(buffer) == CAPACITY:' },
        { line: 7, text: '            cv.wait() # wait for notFull' },
        { line: 8, text: '        buffer.append(item)' },
        { line: 9, text: '        cv.notify() # wake consumer' },
        { line: 10, text: '' },
        { line: 11, text: 'def consume():' },
        { line: 12, text: '    with cv:' },
        { line: 13, text: '        while len(buffer) == 0:' },
        { line: 14, text: '            cv.wait() # wait for notEmpty' },
        { line: 15, text: '        item = buffer.pop(0)' },
        { line: 16, text: '        cv.notify() # wake producer' },
        { line: 17, text: '        return item' }
      ]
    },
    [SYNCHRONIZATION_MODES.MONITOR]: {
      java: [
        { line: 1, text: '// Java Synchronized Monitor Class' },
        { line: 2, text: 'public class WarehouseMonitor {' },
        { line: 3, text: '    private final Product[] buffer;' },
        { line: 4, text: '    private int count = 0, in = 0, out = 0;' },
        { line: 5, text: '' },
        { line: 6, text: '    public synchronized void insert(Product p) throws InterruptedException {' },
        { line: 7, text: '        while (count == buffer.length) {' },
        { line: 8, text: '            wait(); // suspended inside monitor' },
        { line: 9, text: '        }' },
        { line: 10, text: '        buffer[in] = p;' },
        { line: 11, text: '        in = (in + 1) % buffer.length;' },
        { line: 12, text: '        count++;' },
        { line: 13, text: '        notifyAll(); // wake waiting threads' },
        { line: 14, text: '    }' },
        { line: 15, text: '' },
        { line: 16, text: '    public synchronized Product remove() throws InterruptedException {' },
        { line: 17, text: '        while (count == 0) {' },
        { line: 18, text: '            wait(); // suspended inside monitor' },
        { line: 19, text: '        }' },
        { line: 20, text: '        Product p = buffer[out];' },
        { line: 21, text: '        out = (out + 1) % buffer.length;' },
        { line: 22, text: '        count--;' },
        { line: 23, text: '        notifyAll();' },
        { line: 24, text: '        return p;' },
        { line: 25, text: '    }' },
        { line: 26, text: '}' }
      ],
      c: [
        { line: 1, text: '// Monitor abstraction simulated in C via struct' },
        { line: 2, text: 'typedef struct {' },
        { line: 3, text: '    pthread_mutex_t lock;' },
        { line: 4, text: '    pthread_cond_t c_full, c_empty;' },
        { line: 5, text: '    int count, in, out;' },
        { line: 6, text: '} Monitor;' },
        { line: 7, text: '' },
        { line: 8, text: 'void monitor_enter(Monitor* m) { pthread_mutex_lock(&m->lock); }' },
        { line: 9, text: 'void monitor_exit(Monitor* m)  { pthread_mutex_unlock(&m->lock); }' }
      ],
      python: [
        { line: 1, text: '# Python Monitor Object' },
        { line: 2, text: 'class WarehouseMonitor:' },
        { line: 3, text: '    def __init__(self, cap):' },
        { line: 4, text: '        self.lock = threading.RLock()' },
        { line: 5, text: '        self.c_full = threading.Condition(self.lock)' },
        { line: 6, text: '        self.c_empty = threading.Condition(self.lock)' }
      ]
    }
  };

  const lines = codeSnippets[syncAlgorithm]?.[language] || codeSnippets[SYNCHRONIZATION_MODES.SEMAPHORE].java;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Synchronization Code Inspector & Execution Pointer
          </h3>
          <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
            Live Line Tracker
          </span>
        </div>

        {/* Language Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: '8px' }}>
          {['java', 'c', 'python'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: language === lang ? 'var(--accent-blue)' : 'transparent',
                color: language === lang ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              {lang === 'c' ? 'C / Pthreads' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Active Line Status Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '10px',
          fontSize: '0.72rem'
        }}
      >
        <div
          style={{
            background: 'var(--accent-producer-bg)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: 'var(--accent-producer)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Play size={12} />
          <span>
            <strong>Producer Step:</strong> {activeCodeLine.producer?.text || 'Producer Idle / Crafting Item'}
          </span>
        </div>

        <div
          style={{
            background: 'var(--accent-consumer-bg)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: 'var(--accent-consumer)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Play size={12} />
          <span>
            <strong>Consumer Step:</strong> {activeCodeLine.consumer?.text || 'Consumer Idle / Fulfilling Delivery'}
          </span>
        </div>
      </div>

      {/* Code Display Area */}
      <div
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          maxHeight: '280px',
          overflowY: 'auto'
        }}
      >
        {lines.map((item, idx) => {
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '2px 6px',
                borderRadius: '4px',
                color: item.text.startsWith('//') || item.text.startsWith('#') ? 'var(--text-muted)' : 'var(--text-primary)'
              }}
            >
              <span
                style={{
                  width: '26px',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  textAlign: 'right',
                  userSelect: 'none'
                }}
              >
                {item.line}
              </span>
              <span style={{ flex: 1, whiteSpace: 'pre' }}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
