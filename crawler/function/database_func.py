import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize MongoDB client
client = MongoClient(DATABASE_URL, server_api=ServerApi('1'))
db = client.data

def store_provider_collection(data):
    """
    Stores data in the providerCollection collection and prints all records.

    Args:
    - data (list of dict): List of documents to insert into the collection.
    """
    try:
        collection = db.providerCollection
        # Insert data into the collection
        collection.insert_many(data)
        # Fetch and print all records from the collection
        cursor = collection.find()
        # for record in cursor:
        #     print(record)
    except Exception as e:
        print(f"An error occurred while storing provider data: {e}")

def store_review_collection(data):
    """
    Stores data in the reviewCollection collection and prints all records.

    Args:
    - data (list of dict): List of documents to insert into the collection.
    """
    try:
        collection = db.reviewCollection
        # Insert data into the collection
        collection.insert_many(data)
        # Fetch and print all records from the collection
        cursor = collection.find()
        # for record in cursor:
        #     print(record)
    except Exception as e:
        print(f"An error occurred while storing review data: {e}")

def get_all_reviews():
    """
    Fetches all review documents from the reviewCollection collection.

    Returns:
    - cursor (pymongo.cursor.Cursor): Cursor object containing all review documents.
    """
    try:
        collection = db.reviewCollection
        # Fetch all review documents
        cursor = collection.find()
        return cursor
    except Exception as e:
        print(f"An error occurred while fetching review data: {e}")

def get_review_by_query(query):
    """
    Fetches a review document from the reviewCollection collection by its ID.

    Args:
    - id (str): ID of the review document to fetch.

    Returns:
    - record (dict): Review document with the specified ID.
    """
    try:
        collection = db.reviewCollection
        # Fetch the review document with the specified ID
        record = collection.find(
            filter=query
        )
        return record
    except Exception as e:
        print(f"An error occurred while fetching review data: {e}")

def update_review_by_id(id, data):
    """
    Updates a review document in the reviewCollection collection by its ID.

    Args:
    - id (str): ID of the review document to update.
    - data (dict): Document to update the review document with.
    """
    try:
        collection = db.reviewCollection
        # Update the review document with the specified ID
        collection.update_one({"_id": id}, {"$set": data})
        # Fetch and print the updated record
        # record = collection.find_one({"_id": id})
        # print(record)
    except Exception as e:
        print(f"An error occurred while updating review data: {e}")