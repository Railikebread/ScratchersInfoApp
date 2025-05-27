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

// State flags from public CDN - using Wikipedia SVG flags
const stateFlags = {
  AL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Alabama.svg/150px-Flag_of_Alabama.svg.png',
  AK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Alaska.svg/143px-Flag_of_Alaska.svg.png',
  AZ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arizona.svg/150px-Flag_of_Arizona.svg.png',
  AR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Arkansas.svg/150px-Flag_of_Arkansas.svg.png',
  CA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/150px-Flag_of_California.svg.png',
  CO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Flag_of_Colorado.svg/150px-Flag_of_Colorado.svg.png',
  CT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Flag_of_Connecticut.svg/130px-Flag_of_Connecticut.svg.png',
  DE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Flag_of_Delaware.svg/150px-Flag_of_Delaware.svg.png',
  FL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Florida.svg/150px-Flag_of_Florida.svg.png',
  GA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Georgia_%28U.S._state%29.svg/150px-Flag_of_Georgia_%28U.S._state%29.svg.png',
  HI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Hawaii.svg/200px-Flag_of_Hawaii.svg.png',
  ID: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_Idaho.svg/152px-Flag_of_Idaho.svg.png',
  IL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Illinois.svg/150px-Flag_of_Illinois.svg.png',
  IN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Indiana.svg/150px-Flag_of_Indiana.svg.png',
  IA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Iowa.svg/150px-Flag_of_Iowa.svg.png',
  KS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Kansas.svg/150px-Flag_of_Kansas.svg.png',
  KY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Kentucky.svg/150px-Flag_of_Kentucky.svg.png',
  LA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Flag_of_Louisiana.svg/150px-Flag_of_Louisiana.svg.png',
  ME: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_Maine.svg/152px-Flag_of_Maine.svg.png',
  MD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Maryland.svg/150px-Flag_of_Maryland.svg.png',
  MA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Massachusetts.svg/150px-Flag_of_Massachusetts.svg.png',
  MI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Flag_of_Michigan.svg/150px-Flag_of_Michigan.svg.png',
  MN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Minnesota.svg/158px-Flag_of_Minnesota.svg.png',
  MS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_Mississippi.svg/150px-Flag_of_Mississippi.svg.png',
  MO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Flag_of_Missouri.svg/150px-Flag_of_Missouri.svg.png',
  MT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_Montana.svg/150px-Flag_of_Montana.svg.png',
  NE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Nebraska.svg/150px-Flag_of_Nebraska.svg.png',
  NV: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Flag_of_Nevada.svg/150px-Flag_of_Nevada.svg.png',
  NH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_New_Hampshire.svg/150px-Flag_of_New_Hampshire.svg.png',
  NJ: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_New_Jersey.svg/150px-Flag_of_New_Jersey.svg.png',
  NM: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_New_Mexico.svg/150px-Flag_of_New_Mexico.svg.png',
  NY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_New_York.svg/150px-Flag_of_New_York.svg.png',
  NC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Flag_of_North_Carolina.svg/150px-Flag_of_North_Carolina.svg.png',
  ND: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Flag_of_North_Dakota.svg/152px-Flag_of_North_Dakota.svg.png',
  OH: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Ohio.svg/163px-Flag_of_Ohio.svg.png',
  OK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Flag_of_Oklahoma.svg/150px-Flag_of_Oklahoma.svg.png',
  OR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/150px-Flag_of_Oregon.svg.png',
  PA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Pennsylvania.svg/150px-Flag_of_Pennsylvania.svg.png',
  RI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Rhode_Island.svg/125px-Flag_of_Rhode_Island.svg.png',
  SC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Flag_of_South_Carolina.svg/150px-Flag_of_South_Carolina.svg.png',
  SD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_South_Dakota.svg/160px-Flag_of_South_Dakota.svg.png',
  TN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Tennessee.svg/150px-Flag_of_Tennessee.svg.png',
  TX: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Flag_of_Texas.svg/150px-Flag_of_Texas.svg.png',
  UT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Utah.svg/150px-Flag_of_Utah.svg.png',
  VT: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Vermont.svg/150px-Flag_of_Vermont.svg.png',
  VA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Virginia.svg/150px-Flag_of_Virginia.svg.png',
  WA: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Washington.svg/150px-Flag_of_Washington.svg.png',
  WV: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_West_Virginia.svg/150px-Flag_of_West_Virginia.svg.png',
  WI: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flag_of_Wisconsin.svg/150px-Flag_of_Wisconsin.svg.png',
  WY: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Wyoming.svg/150px-Flag_of_Wyoming.svg.png'
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
  const isStateAvailable = (stateCode) => {
    return stateCode === 'NY';
  };

  // Sort states: available first, then alphabetically
  const sortedStates = useMemo(() => {
    return [...statesList].sort((a, b) => {
      const aAvailable = isStateAvailable(a.code);
      const bAvailable = isStateAvailable(b.code);
      
      if (aAvailable && !bAvailable) return -1;
      if (!aAvailable && bAvailable) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, []); // No dependencies needed as statesList is constant and isStateAvailable is defined in component

  const handleStateSelect = (stateCode) => {
    if (stateCode === 'NY') {
      navigate(`/states/${stateCode.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 pt-16 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-32">
            <main className="mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                  <span className="block">Find Your Lucky</span>
                  <span className="block text-blue-200">Scratch-Off Ticket</span>
                </h1>
                <p className="mx-auto mt-3 max-w-md text-base text-blue-100 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                  Explore scratch-off lottery tickets across the United States. Check odds, prizes, and make informed decisions.
                </p>
              </div>
            </main>
          </div>
        </div>
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute bottom-0 left-0 transform translate-x-1/2" width="1440" height="320" fill="none" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,117.3C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* States Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
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