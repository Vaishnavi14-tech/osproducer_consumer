package com.warehouse.simulator.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulation_reports")
public class SimulationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sync_algorithm", nullable = false)
    private String syncAlgorithm;

    @Column(name = "execution_mode", nullable = false)
    private String executionMode;

    @Column(name = "buffer_capacity", nullable = false)
    private int bufferCapacity;

    @Column(name = "total_produced", nullable = false)
    private int totalProduced;

    @Column(name = "total_consumed", nullable = false)
    private int totalConsumed;

    @Column(name = "peak_occupancy", nullable = false)
    private int peakOccupancy;

    @Column(name = "throughput_items_per_sec", nullable = false)
    private double throughputItemsPerSec;

    @Column(name = "avg_producer_wait_time_ms")
    private int avgProducerWaitTimeMs;

    @Column(name = "avg_consumer_wait_time_ms")
    private int avgConsumerWaitTimeMs;

    @Column(name = "race_hazards_count")
    private int raceHazardsCount;

    @Column(name = "deadlock_occurred")
    private boolean deadlockOccurred;

    @Column(name = "duration_seconds")
    private int durationSeconds;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public SimulationReport() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSyncAlgorithm() { return syncAlgorithm; }
    public void setSyncAlgorithm(String syncAlgorithm) { this.syncAlgorithm = syncAlgorithm; }

    public String getExecutionMode() { return executionMode; }
    public void setExecutionMode(String executionMode) { this.executionMode = executionMode; }

    public int getBufferCapacity() { return bufferCapacity; }
    public void setBufferCapacity(int bufferCapacity) { this.bufferCapacity = bufferCapacity; }

    public int getTotalProduced() { return totalProduced; }
    public void setTotalProduced(int totalProduced) { this.totalProduced = totalProduced; }

    public int getTotalConsumed() { return totalConsumed; }
    public void setTotalConsumed(int totalConsumed) { this.totalConsumed = totalConsumed; }

    public int getPeakOccupancy() { return peakOccupancy; }
    public void setPeakOccupancy(int peakOccupancy) { this.peakOccupancy = peakOccupancy; }

    public double getThroughputItemsPerSec() { return throughputItemsPerSec; }
    public void setThroughputItemsPerSec(double throughputItemsPerSec) { this.throughputItemsPerSec = throughputItemsPerSec; }

    public int getAvgProducerWaitTimeMs() { return avgProducerWaitTimeMs; }
    public void setAvgProducerWaitTimeMs(int avgProducerWaitTimeMs) { this.avgProducerWaitTimeMs = avgProducerWaitTimeMs; }

    public int getAvgConsumerWaitTimeMs() { return avgConsumerWaitTimeMs; }
    public void setAvgConsumerWaitTimeMs(int avgConsumerWaitTimeMs) { this.avgConsumerWaitTimeMs = avgConsumerWaitTimeMs; }

    public int getRaceHazardsCount() { return raceHazardsCount; }
    public void setRaceHazardsCount(int raceHazardsCount) { this.raceHazardsCount = raceHazardsCount; }

    public boolean isDeadlockOccurred() { return deadlockOccurred; }
    public void setDeadlockOccurred(boolean deadlockOccurred) { this.deadlockOccurred = deadlockOccurred; }

    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
