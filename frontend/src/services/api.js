import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = {
    getStates: async () => {
        const response = await axios.get(`${API_BASE_URL}/states`);
        return response.data;
    },

    getTicketsByState: async (state) => {
        const response = await axios.get(`${API_BASE_URL}/states/${state}/tickets`);
        return response.data;
    },

    getTicketById: async (state, ticketId) => {
        const response = await axios.get(`${API_BASE_URL}/states/${state}/tickets/${ticketId}`);
        return response.data;
    }
};

export default api; 