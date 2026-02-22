package com.moveinsync.alertsystem;

import com.moveinsync.alertsystem.model.PathResult;
import com.moveinsync.alertsystem.repository.MetroGraphRepository;
import com.moveinsync.alertsystem.service.PathOptimizationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PathOptimizationServiceTest {

    private PathOptimizationService service;
    private MetroGraphRepository repository;

    @BeforeEach
    void setUp() {
        repository = new MetroGraphRepository();
        repository.initData(); // Loads the mock stations
        service = new PathOptimizationService(repository);
    }

    @Test
    void testDirectRoute_NoTransfers() {
        PathResult response = service.findShortestPath("S1", "S2");
        assertNull(response.getError());
        assertEquals(5, response.getTotalTime());
        assertEquals(0, response.getTransfers());
        assertEquals(2, response.getPath().size());
    }

    @Test
    void testInterchangeRoute_WithTransferPenalty() {
        PathResult response = service.findShortestPath("S1", "S5");
        assertNull(response.getError());
        assertEquals(15, response.getTotalTime()); // Includes 10 min penalty
        assertEquals(1, response.getTransfers());
    }

    @Test
    void testEdgeCase_SameSourceAndDestination() {
        PathResult response = service.findShortestPath("S1", "S1");
        assertNotNull(response.getError());
        assertEquals("Source and destination cannot be the same.", response.getError());
    }

    @Test
    void testEdgeCase_InvalidStation() {
        PathResult response = service.findShortestPath("INVALID", "S2");
        assertNotNull(response.getError());
        assertTrue(response.getError().contains("Invalid source or destination"));
    }
}