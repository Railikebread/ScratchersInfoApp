import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Optimized ticket card with 50/50 layout
const TicketCard = React.memo(({ ticket, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Image Section - 50% */}
        <div className="sm:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative h-48 sm:h-auto">
          {ticket.imageUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded w-32 h-32"></div>
                </div>
              )}
              <img
                src={ticket.imageUrl}
                alt={ticket.gameName}
                className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">${ticket.ticketPrice} Ticket</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Info Section - 50% */}
        <div className="sm:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-100 line-clamp-2">
              {ticket.gameName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Game #{ticket.gameNumber}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Top Prize:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  ${ticket.topPrize.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Top Prizes Left:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {ticket.topPrizesRemaining}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Price:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  ${ticket.ticketPrice}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center">
              View Details
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TicketCard.displayName = 'TicketCard';

// Loading skeleton component
const TicketSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="flex flex-col sm:flex-row h-full">
      <div className="sm:w-1/2 bg-gray-200 dark:bg-gray-700 h-48 sm:h-64"></div>
      <div className="sm:w-1/2 p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
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
  const [displayCount, setDisplayCount] = useState(20); // Start with 20 for better performance

  // Cache key for localStorage
  const cacheKey = `tickets_${state}_${new Date().toDateString()}`;

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      
      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setTickets(parsed);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }
      
      try {
        const data = await api.getTicketsByState(state.toUpperCase());
        setTickets(data);
        
        // Cache the data
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          // Clean old cache entries
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('tickets_') && key !== cacheKey) {
              localStorage.removeItem(key);
            }
          });
        } catch (e) {
          console.error('Cache save error:', e);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [state, cacheKey]);

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
        case 'topPrizesRemaining':
          return b.topPrizesRemaining - a.topPrizesRemaining;
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
    setDisplayCount(prev => prev + 20);
  };

  // Get unique prices for filter
  const uniquePrices = useMemo(() => {
    const prices = [...new Set(tickets.map(t => t.ticketPrice))].sort((a, b) => a - b);
    return prices;
  }, [tickets]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {state.toUpperCase()} Scratch-Off Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {loading ? 'Loading...' : `Found ${filteredAndSortedTickets.length} tickets available`}
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="gameName">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="expectedValue">Sort by Expected Value</option>
              <option value="topPrize">Sort by Top Prize</option>
              <option value="topPrizesRemaining">Sort by Top Prizes Left</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border-l border-gray-300 dark:border-gray-500 rounded-r-md">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="appearance-none pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Prices</option>
              {uniquePrices.map(price => (
                <option key={price} value={price}>${price} Tickets</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border-l border-gray-300 dark:border-gray-500 rounded-r-md">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-4">
          {loading ? (
            // Show loading skeletons
            [...Array(4)].map((_, i) => <TicketSkeleton key={i} />)
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
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