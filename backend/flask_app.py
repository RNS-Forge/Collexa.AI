from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import PyPDF2
from docx import Document
import google.generativeai as genai
from bson import ObjectId
import io
import re

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# MongoDB setup
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DATABASE]
collection = db.F1  # Use the F1 collection explicitly

# Gemini setup
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Helper function to validate ObjectId
def is_valid_objectid(oid):
    return bool(re.match(r'^[0-9a-fA-F]{24}$', oid))

# Helper function to extract text from PDF
def extract_pdf_text(file):
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return str(e)

# Helper function to extract text from DOCX
def extract_docx_text(file):
    try:
        doc = Document(file)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        return str(e)

# Create a collection
@app.route('/api/collections', methods=['POST'])
def create_collection():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({"error": "Collection name is required"}), 400
    collection_doc = {"name": name, "subjects": []}
    result = collection.insert_one(collection_doc)
    return jsonify({"id": str(result.inserted_id), "name": name}), 201

# Get all collections
@app.route('/api/collections', methods=['GET'])
def get_collections():
    collections = list(collection.find())
    for coll in collections:
        coll['_id'] = str(coll['_id'])
    return jsonify(collections), 200

# Add a subject to a collection
@app.route('/api/collections/<collection_id>/subjects', methods=['POST'])
def add_subject(collection_id):
    # Validate collection_id
    if not collection_id or collection_id == 'undefined' or not is_valid_objectid(collection_id):
        return jsonify({"error": "Invalid or missing collection_id"}), 400

    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({"error": "Subject name is required"}), 400
    
    try:
        subject = {"name": name, "documents": []}
        collection.update_one(
            {"_id": ObjectId(collection_id)},
            {"$push": {"subjects": subject}}
        )
        return jsonify({"message": "Subject added", "name": name}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to add subject: {str(e)}"}), 500

# Upload document to a subject
@app.route('/api/collections/<collection_id>/subjects/<subject_index>/documents', methods=['POST'])
def upload_document(collection_id, subject_index):
    # Validate collection_id
    if not collection_id or collection_id == 'undefined' or not is_valid_objectid(collection_id):
        return jsonify({"error": "Invalid or missing collection_id"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    filename = file.filename
    if not (filename.endswith('.pdf') or filename.endswith('.docx')):
        return jsonify({"error": "Only PDF or DOCX files are allowed"}), 400

    # Extract text
    text = ""
    if filename.endswith('.pdf'):
        text = extract_pdf_text(file)
    elif filename.endswith('.docx'):
        file.seek(0)
        text = extract_docx_text(file)

    # Store document metadata and extracted text
    try:
        document = {"filename": filename, "content": text}
        collection.update_one(
            {"_id": ObjectId(collection_id)},
            {"$push": {f"subjects.{subject_index}.documents": document}}
        )
        return jsonify({"message": "Document uploaded", "filename": filename}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to upload document: {str(e)}"}), 500

# Chatbot endpoint with RAG
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    query = data.get('query')
    collection_id = data.get('collection_id')
    
    if not query or not collection_id:
        return jsonify({"error": "Query and collection_id are required"}), 400
    
    # Validate collection_id
    if collection_id == 'undefined' or not is_valid_objectid(collection_id):
        return jsonify({"error": "Invalid collection_id"}), 400

    # Retrieve relevant documents
    try:
        coll = collection.find_one({"_id": ObjectId(collection_id)})
        if not coll:
            return jsonify({"error": "Collection not found"}), 404

        # Aggregate all document content for context
        context = ""
        for subject in coll.get('subjects', []):
            for doc in subject.get('documents', []):
                context += doc.get('content', '') + "\n"

        # Query Gemini with RAG context
        prompt = f"Context: {context}\n\nUser Query: {query}\nAnswer based on the provided context."
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text, "source": "Documents in collection"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to process chat request: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
