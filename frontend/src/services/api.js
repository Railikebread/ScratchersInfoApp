import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const NY_LOTTERY_API = 'https://data.ny.gov/resource/nzqa-7unk.json';

const api = {
    getStates: async () => {
        const response = await axios.get(`${API_BASE_URL}/states`);
        return response.data;
    },

    getTicketsByState: async (state) => {
        if (state.toUpperCase() === 'NY') {
            // Fetch NY lottery data with pagination
            const allTickets = [];
            let offset = 0;
            const limit = 1000; // API limit per request
            
            try {
                while (true) {
                    const response = await axios.get(NY_LOTTERY_API, {
                        params: {
                            $limit: limit,
                            $offset: offset,
                            $order: 'game_name ASC'
                        }
                    });
                    
                    if (response.data.length === 0) break;
                    
                    // Transform NY data to match our format
                    const transformedData = response.data.map(ticket => ({
                        gameNumber: ticket.game_number,
                        gameName: ticket.game_name,
                        ticketPrice: parseFloat(ticket.price) || 0,
                        topPrize: parseFloat(ticket.top_prize?.replace(/[$,]/g, '')) || 0,
                        topPrizesRemaining: parseInt(ticket.top_prizes_unclaimed) || 0,
                        overallOdds: ticket.overall_odds || 'N/A',
                        expectedValue: calculateExpectedValue(ticket),
                        prizesUnclaimed: ticket.prizes_unclaimed || 0,
                        prizesUnclaimedValue: parseFloat(ticket.prizes_unclaimed_value?.replace(/[$,]/g, '')) || 0,
                        launchDate: ticket.launch_date,
                        endSaleDate: ticket.end_sale_date,
                        claimDeadline: ticket.claim_deadline
                    }));
                    
                    allTickets.push(...transformedData);
                    
                    if (response.data.length < limit) break;
                    offset += limit;
                }
                
                return allTickets;
            } catch (error) {
                console.error('Error fetching NY lottery data:', error);
                // Fallback to local API
                const response = await axios.get(`${API_BASE_URL}/states/${state}/tickets`);
                return response.data;
            }
        } else {
            const response = await axios.get(`${API_BASE_URL}/states/${state}/tickets`);
            return response.data;
        }
    },

    getTicketById: async (state, ticketId) => {
        const response = await axios.get(`${API_BASE_URL}/states/${state}/tickets/${ticketId}`);
        return response.data;
    }
};

// Helper function to calculate expected value
function calculateExpectedValue(ticket) {
    try {
        const price = parseFloat(ticket.price) || 0;
        const unclaimedValue = parseFloat(ticket.prizes_unclaimed_value?.replace(/[$,]/g, '')) || 0;
        const totalTickets = parseInt(ticket.total_tickets) || 1;
        const ticketsSold = parseInt(ticket.tickets_sold) || 0;
        const remainingTickets = totalTickets - ticketsSold;
        
        if (remainingTickets > 0 && price > 0) {
            return (unclaimedValue / remainingTickets) - price;
        }
        return 0;
    } catch {
        return 0;
    }
}

export default api; 