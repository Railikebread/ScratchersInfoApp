import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TicketCard = React.memo(({ ticket, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
  >
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{ticket.gameName}</h2>
    <div className="space-y-2 text-gray-600">
      <p className="flex justify-between">
        <span>Price:</span>
        <span className="font-medium">${ticket.ticketPrice}</span>
      </p>
      <p className="flex justify-between">
        <span>Top Prize:</span>
        <span className="font-medium">${ticket.topPrize.toLocaleString()}</span>
      </p>
      <p className="flex justify-between">
        <span>Top Prizes Remaining:</span>
        <span className="font-medium">{ticket.topPrizesRemaining}</span>
      </p>
      <p className="flex justify-between">
        <span>Overall Odds:</span>
        <span className="font-medium">{ticket.overallOdds}</span>
      </p>
      <p className="flex justify-between">
        <span>Expected Value:</span>
        <span className="font-medium text-green-600">${ticket.expectedValue.toFixed(2)}</span>
      </p>
    </div>
  </div>
));

TicketCard.displayName = 'TicketCard';

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
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [state]);

  const displayedTickets = useMemo(() => {
    const filtered = filterPrice === 'all' 
      ? tickets 
      : tickets.filter(ticket => ticket.ticketPrice === parseFloat(filterPrice));

    return [...filtered].sort((a, b) => {
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
  }, [tickets, sortBy, filterPrice]);

  const handleTicketClick = (gameNumber) => {
    navigate(`/states/${state}/tickets/${gameNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {state.toUpperCase()} Scratch-Off Tickets
          </h1>
          <p className="text-gray-600 mt-2">
            Found {tickets.length} tickets available
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gameName">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="expectedValue">Sort by Expected Value</option>
            <option value="topPrize">Sort by Top Prize</option>
          </select>

          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <TicketCard
              key={ticket.gameNumber}
              ticket={ticket}
              onClick={() => handleTicketClick(ticket.gameNumber)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StateTicketsPage; 