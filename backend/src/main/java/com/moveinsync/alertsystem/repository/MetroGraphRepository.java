package com.moveinsync.alertsystem.repository;

import com.moveinsync.alertsystem.model.Edge;
import com.moveinsync.alertsystem.model.Route;
import com.moveinsync.alertsystem.model.Stop;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class MetroGraphRepository {

    private final Map<String, Stop> stops = new ConcurrentHashMap<>();
    private final Map<String, Route> routes = new ConcurrentHashMap<>();

    // The Adjacency List: StopID -> List of connected Edges
    private final Map<String, List<Edge>> graph = new ConcurrentHashMap<>();

    @PostConstruct
    public void initData() {
        // 1. Create fake stations
        addStop(new Stop("S1", "Station A"));
        addStop(new Stop("S2", "Station B"));
        addStop(new Stop("S3", "Station C (Interchange)"));
        addStop(new Stop("S4", "Station D"));
        addStop(new Stop("S5", "Station E"));

        // 2. Create fake Metro Lines
        // Red Line goes A -> B -> C -> D
        addRoute(new Route("R1", "Red Line", Arrays.asList("S1", "S2", "S3", "S4")));
        // Blue Line goes E -> C (Intersection at C)
        addRoute(new Route("R2", "Blue Line", Arrays.asList("S5", "S3")));

        // 3. Automatically build the graph
        buildGraph();
        System.out.println("METRO GRAPH INITIALIZED: " + stops.size() + " stops, " + routes.size() + " routes.");
    }

    public void addStop(Stop stop) { stops.put(stop.getId(), stop); }
    public void addRoute(Route route) { routes.put(route.getId(), route); }

    private void buildGraph() {
        graph.clear();
        for (Route route : routes.values()) {
            List<String> lineStops = route.getStopIds();
            for (int i = 0; i < lineStops.size() - 1; i++) {
                String current = lineStops.get(i);
                String next = lineStops.get(i + 1);

                // Assuming trains go both ways, default travel time = 5 mins between any two stops
                graph.computeIfAbsent(current, k -> new ArrayList<>()).add(new Edge(next, route.getId(), 5));
                graph.computeIfAbsent(next, k -> new ArrayList<>()).add(new Edge(current, route.getId(), 5));
            }
        }
    }

    public Map<String, List<Edge>> getGraph() { return graph; }
    public Stop getStop(String id) { return stops.get(id); }
}