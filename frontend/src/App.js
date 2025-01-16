import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FarmerPage from './pages/FarmerPage';
import BuyerPage from './pages/BuyerPage';
import LogisticsPage from './pages/LogisticsPage';
import LandingPage from './pages/LandingPage';
import './styles.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} /> {/* Add LandingPage route */}
                <Route path="/farmer" element={<FarmerPage />} />
                <Route path="/buyer" element={<BuyerPage />} />
                <Route path="/logistics" element={<LogisticsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
