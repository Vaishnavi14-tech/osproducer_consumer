-- MySQL Database Schema for Smart Warehouse Producer-Consumer Simulator

CREATE DATABASE IF NOT EXISTS warehouse_simulator_db;
USE warehouse_simulator_db;

-- 1. Simulation Run Reports Table
CREATE TABLE IF NOT EXISTS simulation_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sync_algorithm VARCHAR(32) NOT NULL,
    execution_mode VARCHAR(32) NOT NULL,
    buffer_capacity INT NOT NULL,
    total_produced INT NOT NULL,
    total_consumed INT NOT NULL,
    peak_occupancy INT NOT NULL,
    throughput_items_per_sec DOUBLE NOT NULL,
    avg_producer_wait_time_ms INT NOT NULL,
    avg_consumer_wait_time_ms INT NOT NULL,
    race_hazards_count INT NOT NULL,
    deadlock_occurred BOOLEAN NOT NULL,
    duration_seconds INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Audit Event Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    simulation_report_id BIGINT,
    event_timestamp VARCHAR(32) NOT NULL,
    event_type VARCHAR(32) NOT NULL,
    thread_name VARCHAR(64),
    event_message TEXT NOT NULL,
    FOREIGN KEY (simulation_report_id) REFERENCES simulation_reports(id) ON DELETE CASCADE
);

-- 3. Warehouse Inventory Snapshot Table
CREATE TABLE IF NOT EXISTS warehouse_inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_index INT NOT NULL,
    product_id VARCHAR(32) NOT NULL,
    category VARCHAR(64) NOT NULL,
    weight VARCHAR(32),
    priority VARCHAR(16),
    produced_by VARCHAR(64),
    consumed_by VARCHAR(64),
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
