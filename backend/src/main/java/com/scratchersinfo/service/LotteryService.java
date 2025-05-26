package com.scratchersinfo.service;

import com.scratchersinfo.model.LotteryTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LotteryService {
    private static final String NY_API_URL = "https://data.ny.gov/resource/nzqa-7unk.json";
    
    @Autowired
    private RestTemplate restTemplate;
    
    public List<LotteryTicket> getAllTickets() {
        List<LotteryTicket> tickets = restTemplate.exchange(
            NY_API_URL,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<LotteryTicket>>() {}
        ).getBody();
        
        // Calculate expected value for each ticket
        return tickets.stream()
            .peek(ticket -> ticket.setExpectedValue(ticket.calculateExpectedValue()))
            .collect(Collectors.toList());
    }
    
    public List<LotteryTicket> getTicketsByState(String state) {
        // For now, only NY is supported
        if ("NY".equalsIgnoreCase(state)) {
            return getAllTickets();
        }
        throw new UnsupportedOperationException("Only NY state is currently supported");
    }
    
    public LotteryTicket getTicketById(String state, String gameNumber) {
        return getAllTickets().stream()
            .filter(ticket -> ticket.getGameNumber().equals(gameNumber))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
} 