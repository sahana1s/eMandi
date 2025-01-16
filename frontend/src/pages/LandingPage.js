import React from 'react';
import Card from '../components/Card';
import Hero from '../components/Hero';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LandingPage = () => {
    const notify = () => toast("Welcome to our platform!");

    React.useEffect(() => {
        notify(); 
    }, []);

    return (
        <div>
            <Hero />
            <div className="cards">
                <Card 
                    title="Real-Time Bidding" 
                    description="Farmers and buyers can engage in transparent bidding for produce, ensuring competitive pricing and enabling fair transactions for both parties." 
                    imageUrl="real-time-bidding.png" 
                />
                <Card 
                    title="Demand Forecasting and Market Insights" 
                    description="Advanced analytics provide accurate demand forecasts and market trends, helping farmers optimize production and buyers make informed purchasing decisions." 
                    imageUrl="demand-forecasting-feature-image.webp" 
                />
                <Card 
                    title="Integrated Logistics Solutions" 
                    description="eMandi connects logistics providers with farmers and buyers, ensuring cost-effective and timely delivery while minimizing transportation delays and costs." 
                    imageUrl="logistics.jpg" 
                />
            </div>
            <ToastContainer />
            <footer className="footer">
                <p><strong>Currently under development.</strong> Thank you for your patience!</p>
            </footer>
        </div>
    );
};

export default LandingPage;
