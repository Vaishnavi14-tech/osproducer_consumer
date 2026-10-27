# Industry-Level Warehouse Producer-Consumer Simulator
### Operating System Concurrency, Synchronization & Bounded Buffer Laboratory

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-blue.svg)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203%20%7C%20Java%2025-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![WebSocket](https://img.shields.io/badge/Real--Time-WebSocket%20%7C%20STOMP-orange.svg)](https://stomp.github.io/)
[![Chart.js](https://img.shields.io/badge/Analytics-Chart.js-ff69b4.svg)](https://www.chartjs.org/)
[![Exports](https://img.shields.io/badge/Exports-PDF%20%7C%20CSV%20%7C%20Excel-purple.svg)](https://sheetjs.com/)

An enterprise-grade, interactive, educational, and visually attractive **Operating System Concurrency Simulator** that models real-world warehouse logistics to teach and demonstrate synchronization, semaphores, mutex locks, bounded buffers, race conditions, critical sections, and thread coordination.

Suitable for academic projects, operating system laboratories, industry demonstrations, and portfolio showcases.

---

## 🌟 Core Operating System Concepts Demonstrated

1. **Producer-Consumer Problem (Dijkstra, 1965)**:
   - Multiple supplier threads (Producers) add products to warehouse storage.
   - Multiple customer/courier threads (Consumers) remove products from inventory.
   - Producers wait when the warehouse storage is full.
   - Consumers wait when the warehouse storage is empty.

2. **Bounded Buffer (40–250 Units Capacity)**:
   - Configurable storage capacity dynamically adjustable between **40 and 250 units**.
   - Circular FIFO buffer with modulo index wrapping: `in = (in + 1) % N` and `out = (out + 1) % N`.
   - Real-time occupancy tracking and slot status visualization.

3. **Counting Semaphores**:
   - `empty Semaphore`: Initialized to warehouse capacity $N$. Decrements on item arrival; increments on dispatch. Tracks free space.
   - `full Semaphore`: Initialized to $0$. Increments when items are produced; decrements when consumed. Tracks ready stock.

4. **Binary Mutex Lock & Critical Section**:
   - Protects shared inventory buffer and pointers from concurrent access.
   - Allows only one thread inside the Critical Section at a time.
   - Satisfies **Mutual Exclusion**, **Progress**, and **Bounded Waiting**.

5. **Canonical Synchronization Flows**:
   - **Producer Flow**: `Wait(Empty) -> Lock(Mutex) -> Add Product -> Update Inventory -> Unlock(Mutex) -> Signal(Full)`
   - **Consumer Flow**: `Wait(Full) -> Lock(Mutex) -> Remove Product -> Update Inventory -> Unlock(Mutex) -> Signal(Empty)`

6. **Standard OS Thread Lifecycle States**:
   - `Running`: Actively executing inside critical section or producing/consuming.
   - `Waiting`: Suspended awaiting Mutex lock ownership.
   - `Blocked`: Blocked on `wait(empty)` [buffer full] or `wait(full)` [buffer empty].
   - `Ready`: Item prepared, awaiting turn to enter synchronization.
   - `Sleeping`: Idle delay cycle between successive iterations.

---

## 🚀 Key Modules & Capabilities

### 1. Main Dashboard & Real-Time KPI Statistics
Displays 17 live metrics:
- Warehouse Capacity (40–250)
- Current Inventory & Occupancy %
- Available Empty Slots & Full Slots
- Active Producers & Active Consumers
- Waiting Producers & Waiting Consumers
- Running Threads & Blocked Threads
- Total Produced & Total Consumed Items
- Warehouse Utilization Rate % (with Radial Gauge)
- Throughput Rate (items/sec)
- Average Waiting Latency (ms)
- Critical Section Status (Occupied by thread ID / Free)
- Current Simulation Scenario
- System Health Status (Healthy, Warning, Critical Hazard, Deadlock)

### 2. The 7 Simulation Scenarios
- **Scenario 1**: Production Rate = Consumption Rate $\rightarrow$ *Status: Balanced Warehouse*
- **Scenario 2**: Production Rate > Consumption Rate $\rightarrow$ *Status: Overstock Condition*
- **Scenario 3**: Production Rate < Consumption Rate $\rightarrow$ *Status: Shortage Condition*
- **Scenario 4**: Warehouse Full $\rightarrow$ *Status: Producer Blocked*
- **Scenario 5**: Warehouse Empty $\rightarrow$ *Status: Consumer Blocked*
- **Scenario 6**: Emergency Orders $\rightarrow$ *Status: Priority Consumption*
- **Scenario 7**: High Demand Festival Season $\rightarrow$ *Status: Rapid Consumption*

### 3. Warehouse Visualization & Dynamic Animations
- **Inbound Freight Docks**: Animated supplier hauler trucks with flashing hazard lights, loading ramps, and robotic AGV forklifts.
- **Bounded Buffer Racks**: Adaptive storage supporting 40 to 250 units with **Bays Shelves View** and **High-Density Matrix View**.
- **Critical Section Vault Gate**: Visual glowing laser gate that locks red with thread ownership details and illuminates green when free.
- **Outbound Fulfillment Docks**: Animated customer express delivery vans loading orders for dispatch.
- **Radial Utilization Gauge**: SVG speedometer arc gauge displaying live 0-100% capacity.
- **Slot Inspector**: Hover tooltips showing Product ID, Name, Category, Quantity, Entry Time, Shelf Bay, and Tracking Status.

### 4. Synchronization Monitoring Panel
- **Mutex Status**: Real-time Locked/Unlocked indicator, owner thread ID, and FIFO wait queue chips.
- **Counting Semaphores**: Live dials for Empty Semaphore and Full Semaphore with wait queue chips.
- **Thread Access Timeline**: Rolling Gantt-style execution stream recording lock acquisitions, slot accesses, and releases.
- **Resource Allocation Matrix**: Live mapping table of active threads vs Mutex lock vs storage buffer slot access.

### 5. Race Condition Demonstration Mode
Special toggle to inject and demonstrate concurrency flaws:
- **Enable Race Condition**: Disables mutex protection. Allows concurrent threads to read and write shared inventory simultaneously.
  - Live counters for **Lost Updates**, **Duplicate Entries**, **Data Inconsistency**, and **Stock Count Mismatch**.
  - Animated warning banner: `"⚠ Race Condition Detected"`.
- **Disable Race Condition**: Restores mutual exclusion and guarantees accurate stock counts: `"✅ System Synchronized"`.

### 6. Product Management & Live Package Tracking
7 Categories Supported:
1. `Electronics`: Laptops, OLED TVs, GPUs, Smartwatches
2. `Food`: Arabica Coffee, Olive Oil, Rolled Oats, Honey
3. `Furniture`: Ergonomic Chairs, Standing Desks, Sofas
4. `Clothing`: Winter Parkas, Running Tees, Denim Jeans
5. `Medicines`: Insulin Ampoules, Antibiotics, Epinephrine
6. `Books`: Silberschatz OS Concepts, Tanenbaum Modern OS
7. `Household Products`: HEPA Air Purifiers, Robotic Vacuums
- Filterable and searchable catalog table with Product ID, Name, Category, Quantity, Entry Time, Exit Time, and Tracking Status.
- Export catalog to CSV.

### 7. AI Recommendations & Predictive Inventory Forecasting
- **Smart Inventory Alerts**: Low Stock Warning ($<15\%$), Overstock Warning ($>85\%$), and Auto-Restocking toggle.
- **Velocity Forecasting**: Calculates production vs consumption rate differential and predicts time until buffer exhaustion or overflow.
- **AI Bottleneck Diagnostics**: Actionable performance advice analyzing thread contention, fleet imbalance, and throughput.

### 8. Reports Module (9 Standardized Reports)
Generate and export:
1. Daily Operations Report
2. Weekly Logistics Report
3. Monthly Executive Audit
4. Production & Supplier Report
5. Consumption & Order Fulfillment Report
6. Inventory Levels & Pallet Tracking Report
7. OS Synchronization & Concurrency Audit
8. Race Condition & Hazard Anomaly Report
9. Warehouse Utilization & Space Efficiency Report
- **Export Formats**: **PDF** (jsPDF formatted printout), **CSV** (spreadsheet raw data), **Excel** (SheetJS `.xlsx`).

### 9. Educational Learning Module & Interactive Quiz
- 9 Comprehensive OS Theory Modules:
  1. Producer-Consumer Problem
  2. Semaphores (Counting & Binary)
  3. Mutex Locks & Ownership
  4. Synchronization
  5. Race Conditions & Memory Hazards
  6. Critical Section Requirements
  7. Bounded Buffer Modulo Architecture
  8. Thread Management & OS States
  9. Deadlock Prevention & Coffman Conditions
- Step-by-Step execution flow diagram.
- **Interactive OS Quiz**: 10 challenging multiple choice questions with immediate evaluation, scoring, and explanation cards.

---

## 🛠️ Technology Architecture

| Component | Implementation |
|---|---|
| **Frontend Framework** | React 19, Vite 8, Vanilla CSS3 (Industrial Design System) |
| **Icons & Visuals** | Lucide React |
| **Real-Time Charts** | Chart.js 4, react-chartjs-2 |
| **Audio Engine** | HTML5 Web Audio API (Synthesized box drop, lift, blocked, and alarm audio) |
| **Document Generators** | jsPDF, jspdf-autotable, SheetJS (`xlsx`) |
| **Companion Java Backend** | Spring Boot 3, Java 25, `java.util.concurrent.Semaphore`, `ReentrantLock` |

---

## ⚡ Quick Start Instructions

### Running the Web Simulator (Recommended)

```bash
# Navigate to project directory
cd producer-consumer

# Start Vite dev server
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser to: **`http://127.0.0.1:5173`**

### Running the Java Spring Boot Backend (Optional)

```bash
cd producer-consumer/backend
mvn spring-boot:run
```
The Java backend runs on `http://localhost:8080` with WebSocket STOMP messaging on `/ws-warehouse`.
