package com.warehouse.simulator.service.impl;

import com.warehouse.simulator.model.Product;
import com.warehouse.simulator.service.BoundedBuffer;

public class MonitorBoundedBuffer implements BoundedBuffer {
    private final int capacity;
    private final Product[] buffer;
    private int inIndex = 0;
    private int outIndex = 0;
    private int count = 0;

    public MonitorBoundedBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new Product[capacity];
    }

    // Monitor synchronized entry method for producers
    @Override
    public synchronized void put(Product product) throws InterruptedException {
        while (count == capacity) {
            wait(); // Suspends producer inside monitor condition queue
        }
        buffer[inIndex] = product;
        inIndex = (inIndex + 1) % capacity;
        count++;
        // Wakes up any consumer waiting in the monitor
        notifyAll();
    }

    // Monitor synchronized entry method for consumers
    @Override
    public synchronized Product take() throws InterruptedException {
        while (count == 0) {
            wait(); // Suspends consumer inside monitor condition queue
        }
        Product product = buffer[outIndex];
        buffer[outIndex] = null;
        outIndex = (outIndex + 1) % capacity;
        count--;
        // Wakes up any producer waiting in the monitor
        notifyAll();
        return product;
    }

    @Override
    public synchronized Product[] getBufferSnapshot() {
        return buffer.clone();
    }

    @Override
    public int getCapacity() { return capacity; }

    @Override
    public synchronized int getOccupancy() { return count; }

    @Override
    public synchronized int getInIndex() { return inIndex; }

    @Override
    public synchronized int getOutIndex() { return outIndex; }
}
