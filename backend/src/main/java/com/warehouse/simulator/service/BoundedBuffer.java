package com.warehouse.simulator.service;

import com.warehouse.simulator.model.Product;

public interface BoundedBuffer {
    void put(Product product) throws InterruptedException;
    Product take() throws InterruptedException;
    Product[] getBufferSnapshot();
    int getCapacity();
    int getOccupancy();
    int getInIndex();
    int getOutIndex();
}
