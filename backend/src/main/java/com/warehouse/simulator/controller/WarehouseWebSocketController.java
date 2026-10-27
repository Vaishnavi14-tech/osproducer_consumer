package com.warehouse.simulator.controller;

import com.warehouse.simulator.service.WarehouseSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WarehouseWebSocketController {

    @Autowired
    private WarehouseSimulationService simulationService;

    @MessageMapping("/warehouse/start")
    @SendTo("/topic/warehouse-updates")
    public Map<String, Object> handleStart() {
        simulationService.startSimulation();
        return simulationService.getWarehouseState();
    }

    @MessageMapping("/warehouse/pause")
    @SendTo("/topic/warehouse-updates")
    public Map<String, Object> handlePause() {
        simulationService.pauseSimulation();
        return simulationService.getWarehouseState();
    }

    @MessageMapping("/warehouse/resume")
    @SendTo("/topic/warehouse-updates")
    public Map<String, Object> handleResume() {
        simulationService.resumeSimulation();
        return simulationService.getWarehouseState();
    }

    @MessageMapping("/warehouse/stop")
    @SendTo("/topic/warehouse-updates")
    public Map<String, Object> handleStop() {
        simulationService.stopSimulation();
        return simulationService.getWarehouseState();
    }

    @MessageMapping("/warehouse/reset")
    @SendTo("/topic/warehouse-updates")
    public Map<String, Object> handleReset() {
        simulationService.resetSimulation();
        return simulationService.getWarehouseState();
    }
}
