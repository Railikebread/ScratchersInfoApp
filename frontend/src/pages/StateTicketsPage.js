import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TicketCard = React.memo(({ ticket, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
  >
    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{ticket.gameName}</h2>
    <div className="space-y-2 text-gray-600 dark:text-gray-300">
      <p className="flex justify-between">
        <span>Price:</span>
        <span className="font-medium">${ticket.ticketPrice}</span>
      </p>
      <p className="flex justify-between">
        <span>Top Prize:</span>
        <span className="font-medium">${ticket.topPrize.toLocaleString()}</span>
      </p>
      <p className="flex justify-between">
        <span>Top Prizes Left:</span>
        <span className="font-medium">{ticket.topPrizesRemaining}</span>
      </p>
      <p className="flex justify-between">
        <span>Overall Odds:</span>
        <span className="font-medium">{ticket.overallOdds}</span>
      </p>
      <p className="flex justify-between">
        <span>Expected Value:</span>
        <span className={`font-medium ${ticket.expectedValue > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          ${ticket.expectedValue.toFixed(2)}
        </span>
      </p>
    </div>
  </div>
));

TicketCard.displayName = 'TicketCard';

// Loading skeleton component
const TicketSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse border border-gray-200 dark:border-gray-700">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);

function StateTicketsPage() {
  const { state } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('gameName');
  const [filterPrice, setFilterPrice] = useState('all');
  const [displayCount, setDisplayCount] = useState(30); // Pagination for performance

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
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

  const filteredAndSortedTickets = useMemo(() => {
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

  const displayedTickets = useMemo(() => {
    return filteredAndSortedTickets.slice(0, displayCount);
  }, [filteredAndSortedTickets, displayCount]);

  const handleTicketClick = useCallback((gameNumber) => {
    navigate(`/states/${state}/tickets/${gameNumber}`);
  }, [navigate, state]);

  const loadMore = () => {
    setDisplayCount(prev => prev + 30);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {state.toUpperCase()} Scratch-Off Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {loading ? 'Loading...' : `Found ${tickets.length} tickets available`}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="gameName">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="expectedValue">Sort by Expected Value</option>
              <option value="topPrize">Sort by Top Prize</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border-l border-gray-300 dark:border-gray-500 rounded-r-md">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Prices</option>
              <option value="1">$1 Tickets</option>
              <option value="2">$2 Tickets</option>
              <option value="5">$5 Tickets</option>
              <option value="10">$10 Tickets</option>
              <option value="20">$20 Tickets</option>
              <option value="30">$30 Tickets</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border-l border-gray-300 dark:border-gray-500 rounded-r-md">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show loading skeletons
            [...Array(6)].map((_, i) => <TicketSkeleton key={i} />)
          ) : (
            displayedTickets.map((ticket) => (
              <TicketCard
                key={ticket.gameNumber}
                ticket={ticket}
                onClick={() => handleTicketClick(ticket.gameNumber)}
              />
            ))
          )}
        </div>

        {!loading && displayedTickets.length < filteredAndSortedTickets.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Load More ({filteredAndSortedTickets.length - displayedTickets.length} remaining)
            </button>
          </div>
        )}

        {!loading && filteredAndSortedTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tickets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StateTicketsPage; 