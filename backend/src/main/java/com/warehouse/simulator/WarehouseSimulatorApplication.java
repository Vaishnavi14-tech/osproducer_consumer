package com.warehouse.simulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WarehouseSimulatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(WarehouseSimulatorApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  Smart Warehouse Producer-Consumer Simulator Backend Started     ");
        System.out.println("  REST Endpoints: http://localhost:8080/api/warehouse             ");
        System.out.println("  WebSocket Endpoint: ws://localhost:8080/ws-warehouse            ");
        System.out.println("  H2 Console: http://localhost:8080/h2-console                    ");
        System.out.println("==================================================================");
    }
}
