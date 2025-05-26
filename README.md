# Scratchers Info App

A full-stack application that helps users make informed decisions about lottery scratch-off tickets by providing detailed information about odds, remaining prizes, and ticket values. Currently supporting New York state lottery data with architecture designed for multi-state expansion.

## Project Structure

```
scratchers-info-app/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java source files
│   │   │   └── resources/  # Application properties
│   │   └── test/           # Test files
│   └── pom.xml             # Maven dependencies
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API integration
│   │   └── utils/        # Helper functions
│   ├── public/           # Static assets
│   └── package.json      # NPM dependencies
│
└── README.md             # Project documentation
```

## Features

- **Multi-State Support**: Initially focused on New York lottery data
- **Responsive Design**: Mobile-first approach, works on all devices
- **Real-Time Data**: Integration with official state lottery APIs
- **Smart Filtering**: Sort by odds, price, and remaining prizes
- **Detailed Analysis**: In-depth view of each scratch-off game

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Java Spring Boot
- **Data Source**: NY Government Open Data API

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory
2. Build the project using Maven
3. Run the Spring Boot application

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Documentation

### NY Lottery Data Source
- Endpoint: `https://data.ny.gov/resource/nzqa-7unk.json`
- Format: JSON
- Update Frequency: Daily

### Backend API Endpoints

- `GET /api/v1/states` - List available states
- `GET /api/v1/states/{state}/tickets` - List all tickets for a state
- `GET /api/v1/states/{state}/tickets/{id}` - Get detailed ticket information

## Contributing

This is a portfolio project demonstrating full-stack development capabilities. Feel free to fork and adapt for your own use.

## License

MIT License - See LICENSE file for details 