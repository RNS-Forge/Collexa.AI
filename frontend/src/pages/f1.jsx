import React, { useState, useEffect } from 'react';
import axios from 'axios';

const F1 = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [file, setFile] = useState(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Fetch collections on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/collections')
      .then((response) => setCollections(response.data))
      .catch((error) => console.error('Error fetching collections:', error));
  }, []);

  // Create a new collection
  const handleCreateCollection = () => {
    if (!collectionName) return;
    axios.post('http://localhost:5000/api/collections', { name: collectionName })
      .then((response) => {
        setCollections([...collections, response.data]);
        setCollectionName('');
      })
      .catch((error) => console.error('Error creating collection:', error));
  };

  // Add a subject to a collection
  const handleAddSubject = (collectionId) => {
    if (!subjectName) return;
    axios.post(`http://localhost:5000/api/collections/${collectionId}/subjects`, { name: subjectName })
      .then(() => {
        setSubjectName('');
        axios.get('http://localhost:5000/api/collections')
          .then((response) => setCollections(response.data))
          .catch((error) => console.error('Error fetching collections:', error));
      })
      .catch((error) => console.error('Error adding subject:', error));
  };

  // Upload a document to a subject
  const handleUploadDocument = (collectionId, subjectIndex) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    axios.post(`http://localhost:5000/api/collections/${collectionId}/subjects/${subjectIndex}/documents`, formData)
      .then(() => {
        setFile(null);
        axios.get('http://localhost:5000/api/collections')
          .then((response) => setCollections(response.data))
          .catch((error) => console.error('Error fetching collections:', error));
      })
      .catch((error) => console.error('Error uploading document:', error));
  };

  // Handle chatbot query
  const handleChat = (collectionId) => {
    if (!chatQuery || !collectionId) return;
    axios.post('http://localhost:5000/api/chat', { query: chatQuery, collection_id: collectionId })
      .then((response) => {
        setChatResponse(response.data.answer);
        setChatQuery('');
      })
      .catch((error) => console.error('Error in chat:', error));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Task Management App</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? 'Hide Chatbot' : 'Show Chatbot'}
        </button>
      </header>

      {/* Chatbot Section */}
      {showChat && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Chatbot</h2>
          <select
            className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedCollection(e.target.value)}
            value={selectedCollection || ''}
          >
            <option value="">Select a Collection</option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection._id}>
                {collection.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
            onClick={() => handleChat(selectedCollection)}
            disabled={!selectedCollection || !chatQuery}
          >
            Send
          </button>
          {chatResponse && (
            <div className="mt-4 p-2 bg-gray-100 rounded-md">
              <strong className="text-gray-700">Response:</strong> {chatResponse}
            </div>
          )}
        </div>
      )}

      {/* Create Collection */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Create Collection</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Collection name"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={handleCreateCollection}
            disabled={!collectionName}
          >
            Create
          </button>
        </div>
      </div>

      {/* Collections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Collections</h2>
        {collections.length === 0 ? (
          <p className="text-gray-500">No collections found.</p>
        ) : (
          collections.map((collection) => (
            <div key={collection._id} className="p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">{collection.name}</h3>
              {/* Add Subject */}
              <div className="mt-2 flex space-x-2">
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Subject name"
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  onClick={() => handleAddSubject(collection._id)}
                  disabled={!subjectName}
                >
                  Add Subject
                </button>
              </div>
              {/* Subjects List */}
              <div className="mt-4 space-y-2">
                {collection.subjects && collection.subjects.length > 0 ? (
                  collection.subjects.map((subject, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded-md">
                      <h4 className="text-md font-medium text-gray-700">{subject.name}</h4>
                      {/* Upload Document */}
                      <div className="mt-2 flex space-x-2">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="flex-1 p-2 border rounded-md"
                        />
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => handleUploadDocument(collection._id, index)}
                          disabled={!file}
                        >
                          Upload
                        </button>
                      </div>
                      {/* Documents List */}
                      <div className="mt-2">
                        {subject.documents && subject.documents.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {subject.documents.map((doc, docIndex) => (
                              <li key={docIndex} className="text-gray-600">
                                {doc.filename}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No documents uploaded.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects found.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default F1;
