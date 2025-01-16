from flask import Blueprint, request, jsonify  # type: ignore
from bson.objectid import ObjectId  # type: ignore
from models.db_model import farmers, produce, bids

farmer_routes = Blueprint('farmer_routes', __name__)

# Register a farmer
@farmer_routes.route('/register', methods=['POST'])
def register_farmer():
    try:
        data = request.json
        farmer_id = farmers.insert_one(data).inserted_id
        return jsonify({"message": "Farmer registered successfully!", "farmer_id": str(farmer_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add produce
@farmer_routes.route('/produce', methods=['POST'])
def add_produce():
    try:
        data = request.json
        data['produce_id'] = str(ObjectId())  # Assign unique produce ID
        produce_id = produce.insert_one(data).inserted_id
        return jsonify({"message": "Produce added successfully!", "produce": {**data, "_id": str(produce_id)}})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all produce
@farmer_routes.route('/produce', methods=['GET'])
def get_produce():
    try:
        produce_list = list(produce.find())
        for item in produce_list:
            item['_id'] = str(item['_id'])
            item['produce_id'] = item.get('produce_id', str(ObjectId()))  # Ensure produce_id is a string
        return jsonify(produce_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch all bids
@farmer_routes.route('/bids', methods=['GET'])
def get_bids():
    try:
        bid_list = list(bids.find())
        for bid in bid_list:
            bid['_id'] = str(bid['_id'])
            bid['bid_id'] = bid.get('bid_id', str(ObjectId()))  # Ensure bid_id is a string
        return jsonify(bid_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Accept a bid
@farmer_routes.route('/accept-bid', methods=['POST'])
def accept_bid():
    try:
        data = request.json
        bid_id = data.get('bid_id')
        if not bid_id:
            return jsonify({"message": "Bid ID is required"}), 400

        bid = bids.find_one({"bid_id": bid_id})
        if not bid:
            return jsonify({"message": "Bid not found"}), 404

        bids.update_one({"bid_id": bid_id}, {"$set": {"status": "accepted"}})
        return jsonify({"message": "Bid accepted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500