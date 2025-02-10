import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

// Set base URL for Axios
axios.defaults.baseURL = 'http://localhost:5000/farmer';

const FarmerPage = () => {
    const [form, setForm] = useState({ name: '', address: '' });
    const [produce, setProduce] = useState({ farmer_id: '', name: '', quantity: '' });
    const [bids, setBids] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Regular Expression to check if name contains only alphabets and spaces
    const nameValidationRegex = /^[A-Za-z\s]+$/;

    // Validation functions
    const validateForm = () => {
        if (typeof form.name !== 'string' || form.name.trim() === '' || !nameValidationRegex.test(form.name)) {
            return 'Name must be a non-empty string with no numbers.';
        }
        if (typeof form.address !== 'string' || form.address.trim() === '') {
            return 'Address must be a non-empty string.';
        }
        return null;
    };

    const validateProduceForm = () => {
        if (typeof produce.farmer_id !== 'string' || produce.farmer_id.trim() === '') {
            return 'Farmer ID must be a non-empty string.';
        }
        if (typeof produce.name !== 'string' || produce.name.trim() === '' || !nameValidationRegex.test(produce.name)) {
            return 'Produce Name must be a non-empty string with no numbers.';
        }
        if (isNaN(produce.quantity) || produce.quantity <= 0) {
            return 'Quantity must be a positive number.';
        }
        return null;
    };

    // Register Farmer
    const handleRegister = () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setSuccessMessage(null);
            return;
        }

        axios.post('http://localhost:5000/farmer/register', form)
            .then(response => alert(response.data.message))
            .catch(err => console.error(err.response?.data || err.message));
    };

    // Add Produce
    const handleAddProduce = () => {
        const validationError = validateProduceForm();
        if (validationError) {
            setError(validationError);
            setSuccessMessage(null);
            return;
        }

        axios.post('/produce', produce)
            .then(response => {
                setSuccessMessage(response.data.message);
                setError(null);  // Reset error message
            })
            .catch(err => {
                setError(err.response?.data || 'An error occurred while adding produce.');
                setSuccessMessage(null);  // Reset success message
            });
    };

    // Fetch Bids
    const fetchBids = () => {
        axios.get('/bids')
            .then(response => {
                setBids(response.data);
                setError(null);  // Reset error message
            })
            .catch(err => {
                setError(err.response?.data || 'An error occurred while fetching bids.');
                setBids([]);  // Clear bids if there's an error
            });
    };

    return (
        <div className="farmer-page">
            <h2>Farmer Dashboard</h2>
            
            {/* Success or Error Messages */}
            {successMessage && <div className="message success">{successMessage}</div>}
            {error && <div className="message error">{error}</div>}

            {/* Register Form */}
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

            {/* Add Produce Form */}
            <div className="form-section">
                <h3>List Produce</h3>
                <div className="form-input">
                    <input
                        placeholder="Farmer ID"
                        value={produce.farmer_id}
                        onChange={(e) => setProduce({ ...produce, farmer_id: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Produce Name"
                        value={produce.name}
                        onChange={(e) => setProduce({ ...produce, name: e.target.value })}
                    />
                </div>
                <div className="form-input">
                    <input
                        placeholder="Quantity"
                        value={produce.quantity}
                        onChange={(e) => setProduce({ ...produce, quantity: e.target.value })}
                    />
                </div>
                <button className="btn secondary" onClick={handleAddProduce}>Add Produce</button>
            </div>

            {/* View Bids Section */}
            <div className="bids-section">
                <h3>View Bids</h3>
                <button className="btn secondary" onClick={fetchBids}>Fetch Bids</button>
                <ul className="bids-list">
                    {bids.length > 0 ? (
                        bids.map((bid, index) => (
                            <li key={index}>
                                {`Bid ID: ${bid._id}, Produce: ${bid.produce_id}, Amount: ${bid.bid_amount}`}
                            </li>
                        ))
                    ) : (
                        <li>No bids available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FarmerPage;
