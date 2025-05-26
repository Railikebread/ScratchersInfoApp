package com.scratchersinfo.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class LotteryTicket {
    @JsonProperty("game_name")
    private String gameName;
    
    @JsonProperty("ticket_price")
    private Double ticketPrice;
    
    @JsonProperty("tickets_remaining")
    private Integer ticketsRemaining;
    
    @JsonProperty("total_prizes_remaining")
    private Integer totalPrizesRemaining;
    
    @JsonProperty("top_prize")
    private Double topPrize;
    
    @JsonProperty("top_prizes_remaining")
    private Integer topPrizesRemaining;
    
    @JsonProperty("overall_odds")
    private String overallOdds;
    
    @JsonProperty("game_number")
    private String gameNumber;
    
    // Calculated fields
    private Double expectedValue;
    private String state = "NY"; // Default to NY for now, will be dynamic later
    
    public Double calculateExpectedValue() {
        if (ticketsRemaining == null || ticketsRemaining == 0) {
            return 0.0;
        }
        return (totalPrizesRemaining * 1.0) / ticketsRemaining;
    }
} 