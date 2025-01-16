from flask import Blueprint, request, jsonify # type: ignore
from models.db_model import buyers, bids, produce

buyer_routes = Blueprint('buyer_routes', __name__)

@buyer_routes.route('/register', methods=['POST'])
def register_buyer():
    """Register a new buyer."""
    data = request.json
    buyers.insert_one(data)
    return jsonify({'message': 'Buyer registered successfully'}), 201

@buyer_routes.route('/produce', methods=['GET'])
def view_produce():
    """View all produce."""
    try:
        # Fetch all produce from the database
        produce_list = list(produce.find({}, {'_id': 0}))  # Exclude '_id' field
        return jsonify(produce_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@buyer_routes.route('/place-bid', methods=['POST'])
def place_bid():
    """Place a bid on produce."""
    data = request.json
    produce_id = data.get('produce_id')
    buyer_id = data.get('buyer_id')
    bid_amount = data.get('bid_amount')

    if not produce_id or not buyer_id or not bid_amount:
        return jsonify({'error': 'All fields are required'}), 400

    bid = {
        'produce_id': produce_id,
        'buyer_id': buyer_id,
        'bid_amount': bid_amount
    }
    bids.insert_one(bid)
    return jsonify({'message': 'Bid placed successfully'}), 201