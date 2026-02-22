package com.moveinsync.alertsystem.service;

import com.moveinsync.alertsystem.model.Edge;
import com.moveinsync.alertsystem.model.PathResult;
import com.moveinsync.alertsystem.repository.MetroGraphRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PathOptimizationService {

    private final MetroGraphRepository repository;
    private static final int TRANSFER_PENALTY = 10; // 10 mins penalty for changing lines

    @AllArgsConstructor
    private static class NodeState implements Comparable<NodeState> {
        String stopId;
        String currentLine;
        int totalCost; // time + transfer penalties
        int realTime;  // actual travel time
        int transfers;
        List<String> path;

        @Override
        public int compareTo(NodeState other) {
            return Integer.compare(this.totalCost, other.totalCost);
        }
    }

    public PathResult findShortestPath(String sourceId, String destId) {
        Map<String, List<Edge>> graph = repository.getGraph();

    // 1. Requirement: Handle same source/destination
    // Changed: Must return an error string to pass 'testEdgeCase_SameSourceAndDestination'
    if (sourceId.equals(destId)) {
        return new PathResult(new ArrayList<>(), 0, 0, "Source and destination cannot be the same.");
    }

    // 2. Requirement: Handle non-existent stations
    // Changed: Message must contain "Invalid" to pass 'testEdgeCase_InvalidStation'
    if (!graph.containsKey(sourceId) || !graph.containsKey(destId)) {
        return new PathResult(new ArrayList<>(), 0, 0, "Invalid source or destination station.");
    }

        PriorityQueue<NodeState> pq = new PriorityQueue<>();
        Map<String, Integer> minCostMap = new HashMap<>();

        pq.add(new NodeState(sourceId, null, 0, 0, 0, new ArrayList<>(Collections.singletonList(sourceId))));

        while (!pq.isEmpty()) {
            NodeState current = pq.poll();

            // Reached destination!
            if (current.stopId.equals(destId)) {
                return new PathResult(current.path, current.realTime, current.transfers, null);
            }

            String stateKey = current.stopId + "_" + current.currentLine;
            if (minCostMap.containsKey(stateKey) && minCostMap.get(stateKey) < current.totalCost) {
                continue;
            }
            minCostMap.put(stateKey, current.totalCost);

            List<Edge> neighbors = graph.getOrDefault(current.stopId, new ArrayList<>());
            for (Edge edge : neighbors) {
                int additionalTransfer = 0;
                int penalty = 0;

                // Check for interchange (switching lines)
                if (current.currentLine != null && !current.currentLine.equals(edge.getLineId())) {
                    additionalTransfer = 1;
                    penalty = TRANSFER_PENALTY;
                }

                int newTotalCost = current.totalCost + edge.getTravelTime() + penalty;
                int newRealTime = current.realTime + edge.getTravelTime();
                int newTransfers = current.transfers + additionalTransfer;

                List<String> newPath = new ArrayList<>(current.path);
                newPath.add(edge.getTargetStopId());

                pq.add(new NodeState(edge.getTargetStopId(), edge.getLineId(), newTotalCost, newRealTime, newTransfers, newPath));
            }
        }
        // Edge Case: No path exists
        return new PathResult(null, 0, 0, "No connecting path exists.");
    }
}