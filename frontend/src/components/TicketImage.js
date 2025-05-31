import React, { useState, useEffect } from 'react';

// Get the API host for proxy requests
const isAndroidEmulator = window.location.hostname === '10.0.2.2';
const API_HOST = isAndroidEmulator ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

// Helper function to create proxy URL
function createProxyUrl(originalUrl) {
    // Don't proxy townsquare.media URLs - they might not have CORS restrictions
    if (originalUrl.includes('townsquare.media')) {
        console.log('Using direct URL for townsquare.media');
        return originalUrl;
    }
    
    // TODO: Switch to backend proxy once it's running (http://localhost:8080/api/v1/proxy/image?url=...)
    // For now, use public CORS proxy
    return `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
}

// Helper function to format game name in camelCase
function formatGameNameCamelCase(gameName) {
    // Remove dollar signs and trim
    let cleaned = gameName.trim()
        .replace(/\$/g, '')
        .replace(/'/g, '');
    
    // Special replacements based on common patterns
    const replacements = {
        'Win for Life': 'winForLife',
        'WIN FOR LIFE': 'winForLife',
        'Double Triple Cashword': 'doubleTripleCashword',
        'DOUBLE TRIPLE CASHWORD': 'doubleTripleCashword',
        '$1,000,000 Cashword Bonus': '1milCashwordBonus',
        '1,000,000 Cashword Bonus': '1milCashwordBonus',
        '$1,000,000 CASHWORD BONUS': '1milCashwordBonus',
        '1,000,000 CASHWORD BONUS': '1milCashwordBonus',
        'Win $100 or $200': 'win100or200',
        'WIN $100 OR $200': 'win100or200',
        'Win 100 or 200': 'win100or200',
        '25X the Gold': '25XtheGold',
        '25X THE GOLD': '25XtheGold',
        '50 or 100': '50or100',
        '50 OR 100': '50or100',
        'Money Match': 'moneyMatch',
        'MONEY MATCH': 'moneyMatch',
        'Cash Word': 'cashword',
        'CASH WORD': 'cashword',
        'Cashword': 'cashword',
        'CASHWORD': 'cashword',
        'Instant Take 5': 'instantTake5',
        'INSTANT TAKE 5': 'instantTake5',
        'Blackjack Doubler': 'blackjackDoubler',
        'BLACKJACK DOUBLER': 'blackjackDoubler'
    };
    
    // Check if we have a direct replacement
    for (const [pattern, replacement] of Object.entries(replacements)) {
        if (cleaned.toLowerCase() === pattern.toLowerCase()) {
            return replacement;
        }
    }
    
    // Handle other patterns with numbers
    if (/^\d/.test(cleaned)) {
        cleaned = cleaned
            .replace(/,/g, '')
            .replace(/\s+or\s+/gi, 'or')
            .replace(/\s+X\s+/gi, 'X')
            .replace(/\s+/g, '');
        return cleaned;
    }
    
    // Default camelCase formatting
    const words = cleaned.split(/\s+/);
    return words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join('');
}

// Generate all possible URLs for a ticket
function generateImageUrls(ticket) {
    const launchDate = ticket.launch_date || ticket.launchDate;
    if (!launchDate) return [];
    
    const date = new Date(launchDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateFolder = `${year}-${month}`;
    
    const gameNumber = ticket.game_number || ticket.gameNumber;
    const gameName = ticket.game_name || ticket.gameName;
    
    // Special check for game 1633
    if (gameNumber === '1633') {
        console.log('Debug - Game 1633 raw game name:', gameName);
        console.log('Debug - Game 1633 formatted name:', formatGameNameCamelCase(gameName));
    }
    
    // Get the formatted name using our camelCase formatter
    const camelCaseName = formatGameNameCamelCase(gameName);
    
    const urls = [];
    
    // Based on the examples, the most common pattern is: camelCase_gameNumber.jpg
    urls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${camelCaseName}_${gameNumber}.jpg`);
    
    // Some have version numbers
    urls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${camelCaseName}_${gameNumber}v2.jpg`);
    
    // Some have _1 suffix (like game 1633)
    urls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${camelCaseName}_${gameNumber}_1.jpg`);
    
    // For game 1633, add the exact URLs we know work
    if (gameNumber === '1633') {
        // Add the townsquare.media URL first
        urls.unshift(`https://townsquare.media/site/81/files/2024/09/attachment-1milcashwordbonus_1633_1.jpg?w=780&q=75`);
        urls.push(`https://edit.nylottery.ny.gov/sites/default/files/2024-07/1milCashwordBonus_1633_1.jpg`);
        console.log('Game 1633 - Using known working URLs first');
    }
    
    // Try the styled/cropped WebP version as fallback
    urls.push(`https://edit.nylottery.ny.gov/sites/default/files/styles/scratch_games_logo_380px/public/${dateFolder}/${camelCaseName}_${gameNumber}_cropped.jpg.webp`);
    
    // Try without underscore (less common but possible)
    urls.push(`https://edit.nylottery.ny.gov/sites/default/files/${dateFolder}/${camelCaseName}${gameNumber}.jpg`);
    
    // Log all URLs for game 1633
    if (gameNumber === '1633') {
        console.log('Game 1633 - All URLs to try:', urls);
    }
    
    return urls;
}

const TicketImage = ({ ticket, className = "", alt = "" }) => {
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [allUrlsFailed, setAllUrlsFailed] = useState(false);
    const [urls, setUrls] = useState([]);
    
    useEffect(() => {
        const generatedUrls = generateImageUrls(ticket);
        setUrls(generatedUrls);
        setCurrentUrlIndex(0);
        setImageLoaded(false);
        setAllUrlsFailed(generatedUrls.length === 0);
        
        // Log the first URL being tried for game 1633
        if ((ticket.gameNumber === '1633' || ticket.game_number === '1633') && generatedUrls.length > 0) {
            console.log('Game 1633 - First URL attempt:', generatedUrls[0]);
            console.log('Game 1633 - Proxy URL:', createProxyUrl(generatedUrls[0]));
        }
    }, [ticket]);
    
    const handleImageError = (e) => {
        const failedUrl = urls[currentUrlIndex];
        const proxyUrl = createProxyUrl(failedUrl);
        console.log(`TicketImage Debug - Failed URL #${currentUrlIndex + 1}:`);
        console.log('  Original URL:', failedUrl);
        console.log('  Proxy URL:', proxyUrl);
        console.log('  Error:', e.type);
        
        if (currentUrlIndex < urls.length - 1) {
            // Try next URL
            setCurrentUrlIndex(prev => prev + 1);
            setImageLoaded(false);
        } else {
            // All URLs failed
            console.log('TicketImage Debug - All URLs failed for ticket:', ticket.gameName || ticket.game_name);
            setAllUrlsFailed(true);
        }
    };
    
    const handleImageLoad = () => {
        setImageLoaded(true);
        console.log(`Image loaded successfully from: ${urls[currentUrlIndex]}`);
        
        // Log success for game 1633
        if (ticket.gameNumber === '1633' || ticket.game_number === '1633') {
            console.log('Success! Game 1633 image loaded from:', urls[currentUrlIndex]);
        }
    };
    
    if (allUrlsFailed || urls.length === 0) {
        // Fallback UI when no image is available
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${className}`}>
                <div className="text-center p-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 dark:text-gray-400">${ticket.ticketPrice || ticket.price} Ticket</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`relative ${className}`}>
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 rounded w-32 h-32"></div>
                </div>
            )}
            <img
                src={createProxyUrl(urls[currentUrlIndex])}
                alt={alt || ticket.gameName || ticket.game_name}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
            />
        </div>
    );
};

export default TicketImage;