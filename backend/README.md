# Smart Warehouse Producer-Consumer Simulator (Backend Service)

A multi-threaded Operating System concurrency simulation backend built with **Spring Boot 3**, **Spring WebSocket (STOMP)**, **Java Concurrency (Semaphores, ReentrantLock, Monitors)**, and **MySQL / H2 Database**.

---

## 🌟 Architecture & Features

- **Concurrent Bounded Buffer Implementations**:
  - `SemaphoreBoundedBuffer.java`: Implements Dijkstra's counting and binary semaphores (`java.util.concurrent.Semaphore`).
  - `MutexLockBoundedBuffer.java`: Implements `java.util.concurrent.locks.ReentrantLock` and `Condition` variables (`notFull`, `notEmpty`).
  - `MonitorBoundedBuffer.java`: Implements Mesa/Hoare monitor semantics with Java intrinsic `synchronized`, `wait()`, and `notifyAll()`.
- **Thread Management**: Real JVM worker threads managed via `ExecutorService` pools executing continuous production and consumption loops.
- **Real-Time WebSocket Updates**: Pushes warehouse occupancy, buffer slots, throughput, and metrics every 500ms to `/topic/warehouse-updates`.
- **Persistence**: Simulation runs and audit logs persisted to MySQL or in-memory H2 database via Spring Data JPA.

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** (Java 25 compatible)
- **Maven 3.8+**
- **MySQL 8.0+** (Optional — defaults to embedded H2 for zero-configuration startup)

### Running the Backend

From the `backend/` directory:

```bash
# Using Maven
mvn spring-boot:run
```

The application will start on **`http://localhost:8080`**.

- **H2 Interactive Database Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:warehouse_db`
  - User: `sa`
  - Password: *(leave blank)*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/warehouse/state` | Returns the current warehouse buffer snapshot and metrics |
| `POST` | `/api/warehouse/start` | Starts background producer & consumer thread pools |
| `POST` | `/api/warehouse/pause` | Temporarily suspends thread execution |
| `POST` | `/api/warehouse/resume` | Resumes active simulation |
| `POST` | `/api/warehouse/stop` | Terminates worker thread pools |
| `POST` | `/api/warehouse/reset` | Clears bounded buffer and resets statistics |
| `POST` | `/api/warehouse/algorithm?name={SEMAPHORE\|MUTEX_LOCK\|MONITOR}` | Switches active concurrency primitive |
| `POST` | `/api/warehouse/capacity?size={N}` | Dynamically resizes buffer capacity |
| `POST` | `/api/warehouse/reports/save` | Saves simulation run audit report to database |

---

## 🔌 WebSocket STOMP Protocol

- **STOMP Endpoint**: `ws://localhost:8080/ws-warehouse`
- **Subscribe Topic**: `/topic/warehouse-updates`
- **Client Action Destinations**:
  - `/app/warehouse/start`
  - `/app/warehouse/pause`
  - `/app/warehouse/resume`
  - `/app/warehouse/stop`
  - `/app/warehouse/reset`

---

## 🗄️ MySQL Database Setup (Optional Production DB)

To switch from H2 to MySQL, configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/warehouse_simulator_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

Run `src/main/resources/schema.sql` in your MySQL database to create the required tables.
