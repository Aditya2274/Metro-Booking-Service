package com.moveinsync.alertsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Edge {
    private String targetStopId;
    private String lineId;
    private int travelTime;
}