import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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

// State flags from public CDN
const stateFlags = {
  NY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/120px-Flag_of_New_York.svg.png'
};

// Memoized component to prevent unnecessary re-renders
const StateCard = React.memo(({ state, isAvailable, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const flagUrl = stateFlags[state.code];

  return (
    <button
      onClick={() => isAvailable && onSelect(state.code)}
      disabled={!isAvailable}
      className={`relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-xl transform hover:scale-105 cursor-pointer bg-white dark:bg-gray-800 border-2 border-blue-500'
          : 'opacity-40 cursor-default bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700'
      }`}
    >
      <div className="aspect-w-1 aspect-h-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          {flagUrl && !imageError ? (
            <img
              src={flagUrl}
              alt={`${state.name} flag`}
              className={`absolute inset-0 object-contain w-full h-full p-4 transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-3xl font-bold text-gray-400 dark:text-gray-600">{state.code}</span>
          )}
          {(!imageLoaded || imageError) && !flagUrl && (
            <span className="text-3xl font-bold text-gray-400 dark:text-gray-600">{state.code}</span>
          )}
        </div>
      </div>
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-center text-gray-800 dark:text-gray-200">{state.name}</h2>
        <p className="text-xs text-center mt-1">
          {isAvailable ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium">View tickets</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">Coming soon</span>
          )}
        </p>
      </div>
    </button>
  );
});

StateCard.displayName = 'StateCard';

function LandingPage() {
  const navigate = useNavigate();

  // Only NYC is available for now
  const isStateAvailable = useMemo(() => (stateCode) => {
    return stateCode === 'NY';
  }, []);

  // Sort states: available first, then alphabetically
  const sortedStates = useMemo(() => {
    return [...statesList].sort((a, b) => {
      const aAvailable = isStateAvailable(a.code);
      const bAvailable = isStateAvailable(b.code);
      
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, []);

  const handleStateSelect = (stateCode) => {
    if (stateCode === 'NY') {
      navigate(`/states/${stateCode.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
            Welcome to Scratchers Info
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a state to view available scratch-off tickets and their odds
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Currently available: New York
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {sortedStates.map((state) => (
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