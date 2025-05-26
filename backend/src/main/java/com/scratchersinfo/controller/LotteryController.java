package com.scratchersinfo.controller;

import com.scratchersinfo.model.LotteryTicket;
import com.scratchersinfo.service.LotteryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*") // Enable CORS for development
public class LotteryController {
    
    @Autowired
    private LotteryService lotteryService;
    
    @GetMapping("/states")
    public ResponseEntity<List<String>> getAvailableStates() {
        // For now, only return NY
        return ResponseEntity.ok(List.of("NY"));
    }
    
    @GetMapping("/states/{state}/tickets")
    public ResponseEntity<List<LotteryTicket>> getTicketsByState(
            @PathVariable String state) {
        return ResponseEntity.ok(lotteryService.getTicketsByState(state));
    }
    
    @GetMapping("/states/{state}/tickets/{gameNumber}")
    public ResponseEntity<LotteryTicket> getTicketById(
            @PathVariable String state,
            @PathVariable String gameNumber) {
        return ResponseEntity.ok(lotteryService.getTicketById(state, gameNumber));
    }
} 