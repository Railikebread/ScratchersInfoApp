import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TicketDetailPage() {
  const { state, id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        // For NY, we need to fetch all tickets and find the specific one
        if (state.toUpperCase() === 'NY') {
          const allTickets = await api.getTicketsByState(state.toUpperCase());
          const foundTicket = allTickets.find(t => t.gameNumber === id);
          setTicket(foundTicket);
        } else {
          const data = await api.getTicketById(state, id);
          setTicket(data);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [state, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ticket not found</h2>
        <button
          onClick={() => navigate(`/states/${state}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Back to {state.toUpperCase()} Tickets
        </button>
      </div>
    );
  }

  const getExpectedValueColor = (value) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(`/states/${state}`)}
          className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {state.toUpperCase()} Tickets
        </button>

        {/* Ticket Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {ticket.gameName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Game #{ticket.gameNumber}
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${ticket.ticketPrice}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">per ticket</p>
            </div>
          </div>

          {/* Ticket Image Placeholder */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center mb-6">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Ticket Image</p>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Prize</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${ticket.topPrize?.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Prizes Left</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {ticket.topPrizesRemaining}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Odds</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {ticket.overallOdds}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Value</p>
              <p className={`text-xl font-bold ${getExpectedValueColor(ticket.expectedValue)}`}>
                ${ticket.expectedValue?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Additional Information
          </h2>
          
          <div className="space-y-4">
            {ticket.prizesUnclaimed && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Total Prizes Unclaimed</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {ticket.prizesUnclaimed.toLocaleString()}
                </span>
              </div>
            )}
            
            {ticket.prizesUnclaimedValue && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Total Unclaimed Value</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${ticket.prizesUnclaimedValue.toLocaleString()}
                </span>
              </div>
            )}
            
            {ticket.launchDate && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Launch Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(ticket.launchDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {ticket.endSaleDate && (
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">End Sale Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(ticket.endSaleDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {ticket.claimDeadline && (
              <div className="flex justify-between py-3">
                <span className="text-gray-600 dark:text-gray-300">Claim Deadline</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(ticket.claimDeadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Recommendation
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              {ticket.expectedValue > 0 
                ? "This ticket has a positive expected value, which means on average, you might expect to win more than you spend."
                : "This ticket has a negative expected value, which means on average, you might expect to lose money over time."}
              {' '}Remember, all lottery games are games of chance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage; 