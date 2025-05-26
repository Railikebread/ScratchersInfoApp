import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// State abbreviations and names mapping
const statesList = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

// Memoized component to prevent unnecessary re-renders
const StateCard = React.memo(({ state, isAvailable, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Preload placeholder image
  const placeholderUrl = useMemo(() => 
    `https://via.placeholder.com/150/e2e8f0/64748b?text=${state.code}`, 
    [state.code]
  );

  return (
    <button
      onClick={() => isAvailable && onSelect(state.code)}
      disabled={!isAvailable}
      className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-xl transform hover:scale-105 cursor-pointer'
          : 'opacity-40 cursor-default'
      }`}
    >
      <div className="aspect-w-1 aspect-h-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {(!imageLoaded || imageError) && (
            <span className="text-2xl font-bold text-gray-400">{state.code}</span>
          )}
        </div>
        {!imageError && (
          <img
            src={`https://raw.githubusercontent.com/Railikebread/ScratchersInfoApp/main/frontend/public/state-images/${state.code.toLowerCase()}.png`}
            alt={state.name}
            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-3 bg-white border-t border-gray-200">
        <h2 className="text-sm font-semibold text-center text-gray-800">{state.name}</h2>
        <p className="text-xs text-center mt-1">
          {isAvailable ? (
            <span className="text-blue-600 font-medium">View tickets</span>
          ) : (
            <span className="text-gray-400">Coming soon</span>
          )}
        </p>
      </div>
    </button>
  );
});

StateCard.displayName = 'StateCard';

function LandingPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Only NYC is available for now
  const isStateAvailable = useMemo(() => (stateCode) => {
    return stateCode === 'NY';
  }, []);

  const handleStateSelect = (stateCode) => {
    if (stateCode === 'NY') {
      navigate(`/states/${stateCode.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 tracking-tight">
            Welcome to Scratchers Info
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a state to view available scratch-off tickets and their odds
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Currently available: New York
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {statesList.map((state) => (
            <StateCard
              key={state.code}
              state={state}
              isAvailable={isStateAvailable(state.code)}
              onSelect={handleStateSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 