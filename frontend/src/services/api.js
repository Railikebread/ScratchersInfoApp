import axios from 'axios';

// Detect if running in Android emulator
const isAndroidEmulator = window.location.hostname === '10.0.2.2';
const API_HOST = isAndroidEmulator ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

const API_BASE_URL = `${API_HOST}/api/v1`;
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

// Helper function to format game name with underscores (alternative format)
function formatGameNameWithUnderscores(gameName) {
    return gameName
        .replace(/\$/g, '')
        .replace(/,/g, '')
        .replace(/'/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

// Helper function to format game name in camelCase
function formatGameNameCamelCase(gameName) {
    const words = gameName
        .replace(/\$/g, '')
        .replace(/,/g, '')
        .replace(/'/g, '')
        .split(/\s+/);
    
    return words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

// Helper function to get ticket image URL with multiple fallback options
function getTicketImageUrl(ticket) {
    try {
        const launchDate = ticket.launch_date || ticket.launchDate;
        if (!launchDate) return null;
        
        const date = new Date(launchDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dateFolder = `${year}-${month}`;
        
        const gameNumber = ticket.game_number || ticket.gameNumber;
        const gameName = ticket.game_name || ticket.gameName;
        
        // Try different naming formats
        const nameFormats = [
            formatGameNameWithUnderscores(gameName),  // cash_word
            formatGameNameCamelCase(gameName),         // cashWord
            formatGameNameForUrl(gameName)             // cashword
        ];
        
        // Build multiple possible URLs to try
        const possibleUrls = [];
        
        // Pattern 1: Direct JPG with underscores (like cashword_1649v2.jpg)
        nameFormats.forEach(formattedName => {
            possibleUrls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${formattedName}_${gameNumber}.jpg`);
            possibleUrls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${formattedName}_${gameNumber}v2.jpg`);
            possibleUrls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${formattedName}_${gameNumber}_1.jpg`);
        });
        
        // Pattern 2: Styled/cropped WebP version
        nameFormats.forEach(formattedName => {
            possibleUrls.push(`https://edit.nylottery.ny.gov/sites/default/files/styles/scratch_games_logo_380px/public/${dateFolder}/${formattedName}_${gameNumber}_cropped.jpg.webp`);
        });
        
        // For now, return the most likely URL (we'll implement image fallback in the component)
        // Start with underscore format as it seems most common
        return possibleUrls[0];
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
                        // Keep raw fields for image generation
                        launch_date: ticket.launch_date,
                        game_name: ticket.game_name,
                        game_number: ticket.game_number,
                        price: ticket.price,
                        imageUrl: getTicketImageUrl(ticket),
                        pdfUrl: getTicketPdfUrl(ticket),
                        rawData: ticket // Keep raw data for debugging
                    }));
                    
                    allTickets.push(...transformedData);
                    
                    if (response.data.length < limit) break;
                    offset += limit;
                }
                
                // Consolidate duplicate game numbers - keep the most recent one
                const gameMap = new Map();
                
                allTickets.forEach(ticket => {
                    const gameNumber = ticket.gameNumber;
                    const existingTicket = gameMap.get(gameNumber);
                    
                    if (!existingTicket) {
                        gameMap.set(gameNumber, ticket);
                    } else {
                        // Compare launch dates and keep the most recent
                        const existingDate = new Date(existingTicket.launchDate || existingTicket.launch_date);
                        const newDate = new Date(ticket.launchDate || ticket.launch_date);
                        
                        if (newDate > existingDate) {
                            gameMap.set(gameNumber, ticket);
                        }
                    }
                });
                
                // Convert map back to array
                const uniqueTickets = Array.from(gameMap.values());
                
                return uniqueTickets;
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