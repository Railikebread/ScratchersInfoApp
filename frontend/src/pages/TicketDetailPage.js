import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TicketImage from '../components/TicketImage';

function TicketDetailPage() {
  const { state, ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        // For NY, we need to fetch all tickets and find the specific one
        if (state.toUpperCase() === 'NY') {
          const allTickets = await api.getTicketsByState(state.toUpperCase());
          const foundTicket = allTickets.find(t => t.gameNumber === ticketId);
          setTicket(foundTicket);
        } else {
          const data = await api.getTicketById(state, ticketId);
          setTicket(data);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [state, ticketId]);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div>
            {/* Ticket Image */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden relative h-96">
                <TicketImage
                  ticket={ticket}
                  className="w-full h-full p-8"
                  alt={`${ticket.gameName} - Game #${ticket.gameNumber}`}
                />
              </div>
              
              {/* PDF Link */}
              {ticket.pdfUrl && (
                <div className="mt-4 text-center">
                  <a 
                    href={ticket.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Price and Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ${ticket.ticketPrice}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">per ticket</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Odds</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.overallOdds}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Value</p>
                  <p className={`text-lg font-semibold ${getExpectedValueColor(ticket.expectedValue)}`}>
                    ${ticket.expectedValue?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Info */}
          <div>
            {/* Title and Game Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {ticket.gameName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Game #{ticket.gameNumber}
              </p>
              
              {/* Prize Information */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Prize Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Top Prize</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${ticket.topPrize?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Top Prizes Remaining</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {ticket.topPrizesRemaining}
                  </span>
                </div>
                {ticket.prizesUnclaimed !== undefined && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Total Prizes Unclaimed</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {ticket.prizesUnclaimed.toLocaleString()}
                    </span>
                  </div>
                )}
                {ticket.prizesUnclaimedValue !== undefined && (
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-300">Total Unclaimed Value</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${ticket.prizesUnclaimedValue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Important Dates
              </h2>
              <div className="space-y-3">
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
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-lg">
                Recommendation
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                {ticket.expectedValue > 0 
                  ? `This ticket has a positive expected value of $${ticket.expectedValue.toFixed(2)}, which means on average, you might expect to win more than you spend. This is relatively rare among scratch-off tickets.`
                  : `This ticket has a negative expected value of $${Math.abs(ticket.expectedValue).toFixed(2)}, which means on average, you might expect to lose money over time. This is typical for lottery games.`}
              </p>
              <p className="text-blue-700 dark:text-blue-300 mt-2 text-sm">
                Remember, all lottery games are games of chance and should be played responsibly.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate(`/states/${state}`)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow hover:shadow-md"
          >
            View More {state.toUpperCase()} Tickets
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow hover:shadow-md"
          >
            Explore Other States
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage; 