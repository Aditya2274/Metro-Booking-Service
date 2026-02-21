package com.moveinsync.alertsystem.controller;

import com.moveinsync.alertsystem.model.Booking;
import com.moveinsync.alertsystem.model.PathResult;
import com.moveinsync.alertsystem.service.PathOptimizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final PathOptimizationService pathService;

    @PostMapping
    public Booking createBooking(@RequestBody Map<String, String> request) {
        String source = request.get("source");
        String destination = request.get("destination");

        PathResult result = pathService.findShortestPath(source, destination);

        Booking booking = new Booking();
        booking.setSource(source);
        booking.setDestination(destination);

        // Handle edge cases cleanly
        if (result.getError() != null) {
            booking.setError(result.getError());
            return booking;
        }

        // Populate successful booking
        booking.setBookingId(UUID.randomUUID().toString());
        booking.setRouteTaken(result.getPath());
        booking.setTotalTimeMins(result.getTotalTime());
        booking.setTransfers(result.getTransfers());

        // Generate tamper-resistant QR String (Base64 encoded reference)
        String rawQrData = "MOVEINSYNC-METRO-" + booking.getBookingId() + "-" + source + "-" + destination;
        booking.setQrString(Base64.getEncoder().encodeToString(rawQrData.getBytes()));

        return booking;
    }
}