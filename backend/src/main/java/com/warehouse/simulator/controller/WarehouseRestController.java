package com.warehouse.simulator.controller;

import com.warehouse.simulator.model.SimulationReport;
import com.warehouse.simulator.service.WarehouseSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseRestController {

    @Autowired
    private WarehouseSimulationService simulationService;

    @GetMapping("/state")
    public ResponseEntity<Map<String, Object>> getState() {
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> start() {
        simulationService.startSimulation();
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/pause")
    public ResponseEntity<Map<String, Object>> pause() {
        simulationService.pauseSimulation();
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/resume")
    public ResponseEntity<Map<String, Object>> resume() {
        simulationService.resumeSimulation();
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/stop")
    public ResponseEntity<Map<String, Object>> stop() {
        simulationService.stopSimulation();
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> reset() {
        simulationService.resetSimulation();
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/algorithm")
    public ResponseEntity<Map<String, Object>> setAlgorithm(@RequestParam String name) {
        simulationService.setSyncAlgorithm(name);
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/capacity")
    public ResponseEntity<Map<String, Object>> setCapacity(@RequestParam int size) {
        simulationService.setCapacity(size);
        return ResponseEntity.ok(simulationService.getWarehouseState());
    }

    @PostMapping("/reports/save")
    public ResponseEntity<SimulationReport> saveReport() {
        SimulationReport report = simulationService.saveSimulationReport();
        return ResponseEntity.ok(report);
    }
}
