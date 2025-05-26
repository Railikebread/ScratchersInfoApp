import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function LandingPage() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await api.getStates();
        setStates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching states:', error);
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateSelect = (state) => {
    navigate(`/states/${state.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Scratchers Info
      </h1>
      <p className="text-xl text-center mb-12 text-gray-600">
        Select a state to view available scratch-off tickets and their odds
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => handleStateSelect(state)}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-2xl font-semibold text-center">{state}</h2>
            <p className="text-center text-gray-600 mt-2">
              View available tickets
            </p>
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-center text-gray-600">
        <p>More states coming soon!</p>
      </div>
    </div>
  );
}

export default LandingPage; 