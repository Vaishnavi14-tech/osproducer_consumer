package com.warehouse.simulator.service.impl;

import com.warehouse.simulator.model.Product;
import com.warehouse.simulator.service.BoundedBuffer;

import java.util.concurrent.Semaphore;

public class SemaphoreBoundedBuffer implements BoundedBuffer {
    private final int capacity;
    private final Product[] buffer;
    private int inIndex = 0;
    private int outIndex = 0;
    private int count = 0;

    private final Semaphore mutex;
    private final Semaphore empty;
    private final Semaphore full;

    public SemaphoreBoundedBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new Product[capacity];
        this.mutex = new Semaphore(1, true);       // Binary semaphore for mutual exclusion (fair)
        this.empty = new Semaphore(capacity, true); // Counting semaphore for empty slots
        this.full = new Semaphore(0, true);        // Counting semaphore for populated items
    }

    @Override
    public void put(Product product) throws InterruptedException {
        // Step 1: wait(empty)
        empty.acquire();
        // Step 2: wait(mutex)
        mutex.acquire();
        try {
            // Critical Section
            buffer[inIndex] = product;
            inIndex = (inIndex + 1) % capacity;
            count++;
        } finally {
            // Step 4: signal(mutex)
            mutex.release();
            // Step 5: signal(full)
            full.release();
        }
    }

    @Override
    public Product take() throws InterruptedException {
        // Step 1: wait(full)
        full.acquire();
        // Step 2: wait(mutex)
        mutex.acquire();
        Product product;
        try {
            // Critical Section
            product = buffer[outIndex];
            buffer[outIndex] = null;
            outIndex = (outIndex + 1) % capacity;
            count--;
        } finally {
            // Step 4: signal(mutex)
            mutex.release();
            // Step 5: signal(empty)
            empty.release();
        }
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
