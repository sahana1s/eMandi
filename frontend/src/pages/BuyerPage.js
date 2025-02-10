import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuyerPage = () => {
    const [form, setForm] = useState({ name: '', address: '' });
    const [bid, setBid] = useState({ produce_id: '', buyer_id: '', bid_amount: '' });
    const [produceList, setProduceList] = useState([]);
    const [bidList, setBidList] = useState([]);  // State for storing placed bids
    const [error, setError] = useState(null);  // To hold validation error messages

    // Regular Expression to check if name contains only alphabets and spaces
    const nameValidationRegex = /^[A-Za-z\s]+$/;

    // Validation function for the form
    const validateForm = () => {
        if (typeof form.name !== 'string' || form.name.trim() === '' || !nameValidationRegex.test(form.name)) {
            return 'Name must be a non-empty string with no numbers.';
        }
        if (typeof form.address !== 'string' || form.address.trim() === '') {
            return 'Address must be a non-empty string.';
        }
        return null;
    };

    // Validation function for placing a bid
    const validateBid = () => {
        if (typeof bid.produce_id !== 'string' || bid.produce_id.trim() === '') {
            return 'Produce ID must be a non-empty string.';
        }
        if (typeof bid.buyer_id !== 'string' || bid.buyer_id.trim() === '') {
            return 'Buyer ID must be a non-empty string.';
        }
        if (isNaN(bid.bid_amount) || bid.bid_amount <= 0) {
            return 'Bid Amount must be a positive number.';
        }
        return null;
    };

    // Fetch the produce list from the backend
    const fetchProduce = () => {
        axios.get('http://localhost:5000/buyer/produce')
            .then(response => {
                setProduceList(response.data); // Update the produce list state
            })
            .catch(err => {
                console.error("Error fetching produce:", err);
                alert("Error fetching produce!");
            });
    };

    // Register the buyer
    const handleRegister = () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        axios.post('http://localhost:5000/buyer/register', form)
            .then(response => alert(response.data.message))
            .catch(err => console.error(err));
    };

    // Place a bid
    const handlePlaceBid = () => {
        const validationError = validateBid();
        if (validationError) {
            setError(validationError);
            return;
        }

        axios.post('http://localhost:5000/buyer/place-bid', bid)
            .then(response => {
                alert(response.data.message);
                setBidList([...bidList, bid]); // Add new bid to the bidList
            })
            .catch(err => console.error(err));
    };

    // Fetch produce when the component mounts
    useEffect(() => {
        fetchProduce();
    }, []);

    return (
        <div className="buyer-page">
            <h2>Buyer Dashboard</h2>

            {/* Display Validation Error */}
            {error && <div className="message error">{error}</div>}

            {/* Register Section */}
            <div className="form-section">
                <h3>Register</h3>
                <div className="form-input">
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                </div>
                <button className="btn primary" onClick={handleRegister}>Register</button>
            </div>

            {/* View Produce Section */}
            <div className="produce-section">
                <h3>View Produce</h3>
                <ul className="produce-list">
                    {produceList.length > 0 ? (
                        produceList.map((produce, index) => (
                            <li key={index} className="produce-item">
                                <p><strong>Produce ID:</strong> {produce.produce_id}</p>
                                <p><strong>Name:</strong> {produce.name}</p>
                                <p><strong>Quantity:</strong> {produce.quantity}</p>
                            </li>
                        ))
                    ) : (
                        <p>No produce available.</p>
                    )}
                </ul>
            </div>

            {/* Place Bid Section */}
            <div className="form-section">
                <h3>Place Bid</h3>
                <div className="form-input">
                    <input
                        placeholder="Produce ID"
                        value={bid.produce_id}
                        onChange={(e) => setBid({ ...bid, produce_id: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Buyer ID"
                        value={bid.buyer_id}
                        onChange={(e) => setBid({ ...bid, buyer_id: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Bid Amount"
                        value={bid.bid_amount}
                        onChange={(e) => setBid({ ...bid, bid_amount: e.target.value })}
                    />
                </div>
                <button className="btn secondary" onClick={handlePlaceBid}>Place Bid</button>
            </div>
        </div>
    );
};

export default BuyerPage;
