package com.warehouse.simulator.model;

public class Product {
    private String id;
    private int serial;
    private String batchId;
    private String category;
    private String categoryName;
    private String code;
    private String icon;
    private String color;
    private String weight;
    private String priority;
    private boolean fragile;
    private long timestamp;
    private String producedBy;
    private String consumedBy;

    public Product() {}

    public Product(String id, int serial, String category, String categoryName, String color, String weight, String priority) {
        this.id = id;
        this.serial = serial;
        this.category = category;
        this.categoryName = categoryName;
        this.color = color;
        this.weight = weight;
        this.priority = priority;
        this.timestamp = System.currentTimeMillis();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public int getSerial() { return serial; }
    public void setSerial(int serial) { this.serial = serial; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public boolean isFragile() { return fragile; }
    public void setFragile(boolean fragile) { this.fragile = fragile; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getProducedBy() { return producedBy; }
    public void setProducedBy(String producedBy) { this.producedBy = producedBy; }

    public String getConsumedBy() { return consumedBy; }
    public void setConsumedBy(String consumedBy) { this.consumedBy = consumedBy; }
}
