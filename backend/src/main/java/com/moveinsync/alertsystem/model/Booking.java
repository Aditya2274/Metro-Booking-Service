package com.moveinsync.alertsystem.model;

import lombok.Data;
import java.util.List;

@Data
public class Booking {
    private String bookingId;
    private String source;
    private String destination;
    private List<String> routeTaken;
    private int totalTimeMins;
    private int transfers;
    private String qrString;
    private String error;
}