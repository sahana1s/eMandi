from pymongo import MongoClient # type: ignore
import os
from dotenv import load_dotenv # type: ignore

# Load environment variables
load_dotenv()

try:
    # Connect to MongoDB
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.eMandi  # Connect to 'eMandi' database
    print("MongoDB connected successfully!")

    # Collections
    farmers = db.farmers
    buyers = db.buyers
    logistics = db.logistics
    produce = db.produce
    bids = db.bids
    tasks = db.tasks

    # Optional: Indexing for faster queries (if applicable)
    produce.create_index("produce_id", unique=True)
    bids.create_index("bid_id", unique=True)

except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
