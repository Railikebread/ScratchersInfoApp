import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StateTicketsPage() {
  const { state } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('gameName');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await api.getTicketsByState(state.toUpperCase());
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [state]);

  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.ticketPrice - b.ticketPrice;
        case 'expectedValue':
          return b.expectedValue - a.expectedValue;
        case 'topPrize':
          return b.topPrize - a.topPrize;
        default:
          return a.gameName.localeCompare(b.gameName);
      }
    });
  };

  const filterTickets = (tickets) => {
    if (filterPrice === 'all') return tickets;
    return tickets.filter(ticket => ticket.ticketPrice === parseFloat(filterPrice));
  };

  const displayedTickets = sortTickets(filterTickets(tickets));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {state.toUpperCase()} Scratch-Off Tickets
      </h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="gameName">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="expectedValue">Sort by Expected Value</option>
          <option value="topPrize">Sort by Top Prize</option>
        </select>

        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Prices</option>
          <option value="1">$1 Tickets</option>
          <option value="2">$2 Tickets</option>
          <option value="5">$5 Tickets</option>
          <option value="10">$10 Tickets</option>
          <option value="20">$20 Tickets</option>
          <option value="30">$30 Tickets</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTickets.map((ticket) => (
          <div
            key={ticket.gameNumber}
            onClick={() => navigate(`/states/${state}/tickets/${ticket.gameNumber}`)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{ticket.gameName}</h2>
            <div className="space-y-2 text-gray-600">
              <p>Price: ${ticket.ticketPrice}</p>
              <p>Top Prize: ${ticket.topPrize.toLocaleString()}</p>
              <p>Top Prizes Remaining: {ticket.topPrizesRemaining}</p>
              <p>Overall Odds: {ticket.overallOdds}</p>
              <p>Expected Value: ${ticket.expectedValue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StateTicketsPage; 