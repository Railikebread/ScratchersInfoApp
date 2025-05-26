import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StateTicketsPage from './pages/StateTicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/states/:state" element={<StateTicketsPage />} />
            <Route path="/states/:state/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 