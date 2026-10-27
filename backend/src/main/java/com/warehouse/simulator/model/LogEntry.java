package com.warehouse.simulator.model;

public class LogEntry {
    private String id;
    private String timestamp;
    private String type;
    private String message;

    public LogEntry() {}

    public LogEntry(String id, String timestamp, String type, String message) {
        this.id = id;
        this.timestamp = timestamp;
        this.type = type;
        this.message = message;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
