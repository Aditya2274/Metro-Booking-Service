package com.moveinsync.alertsystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Route {
    private String id;
    private String color;
    private List<String> stopIds; // Ordered list of stops on this line
}