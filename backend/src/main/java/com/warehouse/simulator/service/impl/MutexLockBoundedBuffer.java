package com.warehouse.simulator.service.impl;

import com.warehouse.simulator.model.Product;
import com.warehouse.simulator.service.BoundedBuffer;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class MutexLockBoundedBuffer implements BoundedBuffer {
    private final int capacity;
    private final Product[] buffer;
    private int inIndex = 0;
    private int outIndex = 0;
    private int count = 0;

    private final Lock lock = new ReentrantLock(true);
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public MutexLockBoundedBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new Product[capacity];
    }

    @Override
    public void put(Product product) throws InterruptedException {
        lock.lock();
        try {
            // Guard with loop to protect against spurious wakeups
            while (count == capacity) {
                notFull.await(); // Sleep and atomically release lock
            }
            buffer[inIndex] = product;
            inIndex = (inIndex + 1) % capacity;
            count++;
            // Signal condition variable that buffer is no longer empty
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Product take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {
                notEmpty.await(); // Sleep and atomically release lock
            }
            Product product = buffer[outIndex];
            buffer[outIndex] = null;
            outIndex = (outIndex + 1) % capacity;
            count--;
            // Signal condition variable that buffer is no longer full
            notFull.signal();
            return product;
        } finally {
            lock.unlock();
        }
    }

    @Override
    public Product[] getBufferSnapshot() {
        lock.lock();
        try {
            return buffer.clone();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public int getCapacity() { return capacity; }

    @Override
    public int getOccupancy() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }

    @Override
    public int getInIndex() { return inIndex; }

    @Override
    public int getOutIndex() { return outIndex; }
}
