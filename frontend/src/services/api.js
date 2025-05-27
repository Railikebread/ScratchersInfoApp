import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const NY_LOTTERY_API = 'https://data.ny.gov/resource/nzqa-7unk.json';

// Helper function to format game name for URL
function formatGameNameForUrl(gameName) {
    return gameName
        .replace(/\$/g, '')
        .replace(/,/g, '')
        .replace(/\s+/g, '')
        .replace(/'/g, '')
        .toLowerCase();
}

// Helper function to get ticket image URL
function getTicketImageUrl(ticket) {
    try {
        // Extract date from launch_date if available
        const launchDate = ticket.launch_date || ticket.launchDate;
        if (!launchDate) return null;
        
        const date = new Date(launchDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateFolder = `${year}-${month}`;
        
        // Format game name
        const formattedName = formatGameNameForUrl(ticket.game_name || ticket.gameName);
        const gameNumber = ticket.game_number || ticket.gameNumber;
        
        return `https://edit.nylottery.ny.gov/sites/default/files/styles/scratch_games_logo_380px/public/${dateFolder}/${formattedName}_${gameNumber}_cropped.jpg.webp`;
    } catch {
        return null;
    }
}

// Helper function to get PDF URL
function getTicketPdfUrl(ticket) {
    try {
        const launchDate = ticket.launch_date || ticket.launchDate;
        if (!launchDate) return null;
        
        const date = new Date(launchDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateFolder = `${year}-${month}`;
        
        const price = ticket.price || ticket.ticketPrice;
        const gameName = ticket.game_name || ticket.gameName;
        const gameNumber = ticket.game_number || ticket.gameNumber;
        
        // Format: $PRICE - GAME_NAME GAME_NUMBER.pdf
        const pdfName = `$${price} - ${gameName} ${gameNumber}.pdf`;
        
        return `https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${encodeURIComponent(pdfName)}`;
    } catch {
        return null;
    }
}

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
                        prizesUnclaimed: parseInt(ticket.prizes_unclaimed) || 0,
                        prizesUnclaimedValue: parseFloat(ticket.prizes_unclaimed_value?.replace(/[$,]/g, '')) || 0,
                        launchDate: ticket.launch_date,
                        endSaleDate: ticket.end_sale_date,
                        claimDeadline: ticket.claim_deadline,
                        imageUrl: getTicketImageUrl(ticket),
                        pdfUrl: getTicketPdfUrl(ticket),
                        rawData: ticket // Keep raw data for debugging
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