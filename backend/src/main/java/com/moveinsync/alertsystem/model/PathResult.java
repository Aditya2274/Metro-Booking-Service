package com.moveinsync.alertsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PathResult {
    private List<String> path;
    private int totalTime;
    private int transfers;
    private String error;
}