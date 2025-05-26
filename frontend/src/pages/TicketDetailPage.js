import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TicketDetailPage() {
  const { state, id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await api.getTicketById(state.toUpperCase(), id);
        setTicket(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setLoading(false);
      }
    };

    fetchTicket();
  }, [state, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Ticket not found</h2>
        <button
          onClick={() => navigate(`/states/${state}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/states/${state}`)}
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
      >
        ← Back to Tickets
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">{ticket.gameName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Game Details</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Game Number:</span>
                <span className="font-medium">{ticket.gameNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Ticket Price:</span>
                <span className="font-medium">${ticket.ticketPrice}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Overall Odds:</span>
                <span className="font-medium">{ticket.overallOdds}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Expected Value:</span>
                <span className="font-medium">${ticket.expectedValue.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prize Information</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Top Prize:</span>
                <span className="font-medium">${ticket.topPrize.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Top Prizes Remaining:</span>
                <span className="font-medium">{ticket.topPrizesRemaining}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Total Prizes Remaining:</span>
                <span className="font-medium">{ticket.totalPrizesRemaining.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Tickets Remaining:</span>
                <span className="font-medium">{ticket.ticketsRemaining.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Analysis</h3>
          <p className="text-blue-700">
            This ticket has an expected value of ${ticket.expectedValue.toFixed(2)} for every $1 spent.
            {ticket.expectedValue > 0.7 && (
              " This is a relatively good value compared to most scratch-off tickets."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage; 