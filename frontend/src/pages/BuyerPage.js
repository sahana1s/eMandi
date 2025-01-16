import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuyerPage = () => {
    const [form, setForm] = useState({ name: '', address: '' });
    const [bid, setBid] = useState({ produce_id: '', buyer_id: '', bid_amount: '' });
    const [produceList, setProduceList] = useState([]);
    const [bidList, setBidList] = useState([]);  // State for storing placed bids

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
        axios.post('http://localhost:5000/buyer/register', form)
            .then(response => alert(response.data.message))
            .catch(err => console.error(err));
    };

    const handlePlaceBid = () => {
        axios.post('http://localhost:5000/buyer/place-bid', bid)
            .then(response => {
                alert(response.data.message);
                // Assuming the response contains the bid data, you can add it to the bid list
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
