package com.moveinsync.alertsystem.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteResponse {
    private String bookingId;
    private String source;
    private String destination;
    private List<String> routeTaken;
    private int totalTimeMins;
    private int transfers;
    private String qrString;
    private String error;
}