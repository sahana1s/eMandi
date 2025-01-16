from flask import Blueprint, request, jsonify # type: ignore
from models.db_model import tasks, bids, produce  # Assuming you have a tasks, bids, and produce collections

logistics_routes = Blueprint('logistics_routes', __name__)

# Add a new task with the highest bid for the corresponding produce
@logistics_routes.route('/tasks', methods=['POST'])
def add_task():
    """Add a new task with the highest bid for the corresponding produce."""
    data = request.json
    task_id = str(data.get('task_id'))  # Ensure task_id is a string
    title = data.get('title')
    produce_id = data.get('produce_id')  # Get the produce_id from the task data
    
    if not title or not produce_id:
        return jsonify({'error': 'Title and Produce ID are required'}), 400

    # Find the highest bid for the given produce_id
    highest_bid = bids.find({'produce_id': produce_id}).sort('bid_amount', -1).limit(1)  # Sort by bid_amount descending
    
    if not highest_bid:
        return jsonify({'error': 'No bids found for the specified produce'}), 404
    
    highest_bid_amount = highest_bid[0]['bid_amount']

    # Create the task with the highest bid amount
    new_task = {
        'task_id': task_id,
        'title': title,
        'produce_id': produce_id,
        'highest_bid': highest_bid_amount,
        'status': 'pending'
    }
    
    tasks.insert_one(new_task)
    return jsonify({'message': 'Task added successfully with highest bid'}), 201

# Fetch all tasks
@logistics_routes.route('/tasks', methods=['GET'])
def get_tasks():
    """Fetch all tasks."""
    try:
        task_list = list(tasks.find())  # Fetch all tasks from MongoDB
        if not task_list:
            return jsonify({'message': 'No tasks found'}), 404

        # Convert MongoDB ObjectId to string for serialization
        for task in task_list:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string

        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Fetch the highest bid for a specific produce ID
@logistics_routes.route('/tasks/highest-bid/<produce_id>', methods=['GET'])
def get_highest_bid(produce_id):
    """Fetch the highest bid for a specific produce."""
    try:
        highest_bid = bids.find({'produce_id': produce_id}).sort('bid_amount', -1).limit(1)
        
        if not highest_bid:
            return jsonify({'error': 'No bids found for the specified produce'}), 404
        
        # Get the highest bid amount from the fetched data
        highest_bid_amount = highest_bid[0]['bid_amount']
        return jsonify({'highest_bid': highest_bid_amount}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update task status
@logistics_routes.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update the status of a task."""
    data = request.json
    status = data.get('status')

    if not status:
        return jsonify({'error': 'Status is required'}), 400

    try:
        result = tasks.update_one({'task_id': task_id}, {'$set': {'status': status}})
        if result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
