package com.warehouse.simulator.repository;

import com.warehouse.simulator.model.SimulationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationReportRepository extends JpaRepository<SimulationReport, Long> {
    List<SimulationReport> findBySyncAlgorithmOrderByCreatedAtDesc(String syncAlgorithm);
}
