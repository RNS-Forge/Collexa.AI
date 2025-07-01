import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import {
  BookOpen,
  Plus,
  Trash2,
  Upload,
  MessageCircle,
  Search,
  FileText,
  GraduationCap,
  ChevronDown,
  Send,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Calendar,
  Star,
  Eye,
  MoreVertical,
  FolderOpen
} from 'lucide-react';

const F1 = () => {
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [file, setFile] = useState(null);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showViewSubjectsModal, setShowViewSubjectsModal] = useState(false);
  const [currentSubjectsPage, setCurrentSubjectsPage] = useState(1);
  const [selectedCollectionForSubjects, setSelectedCollectionForSubjects] = useState(null);
  const subjectsPerPage = 6;
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortFilter, setSortFilter] = useState('recent');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCollectionForChat, setSelectedCollectionForChat] = useState(null);
  const collectionsPerPage = 8;

  const chatEndRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/collections')
      .then((response) => {
        setCollections(response.data.collections);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching collections:', error);
        setIsLoading(false);
      });
  }, []);
  const handleCreateCollection = async () => {
    if (!collectionName.trim()) {
      alert('Please enter a collection name.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/collections', {
        name: collectionName,
        description: collectionDescription || '',
        createdAt: new Date().toISOString()
      });
      setCollections([response.data, ...collections]);
      setCollectionName('');
      setCollectionDescription('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/collections/${collectionId}`);
      setCollections(collections.filter((c) => c._id !== collectionId));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
    setIsLoading(false);
  };
  const handleAddSubject = async (collectionId) => {
    if (!subjectName.trim()) {
      alert('Please enter a subject name.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/collections/${collectionId}/subjects`, {
        name: subjectName,
        description: subjectDescription || ''
      });
      setSubjectName('');
      setSubjectDescription('');

      // Refresh collections data
      const response = await axios.get('http://localhost:5000/api/collections');
      setCollections(response.data.collections);

      // Update the selected collection for subjects modal if it's open
      if (selectedCollectionForSubjects) {
        const updatedCollection = response.data.collections.find(c => c._id === selectedCollectionForSubjects._id);
        if (updatedCollection) {
          setSelectedCollectionForSubjects(updatedCollection);
        }
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
    setIsLoading(false);
  };
  const handleUploadDocument = async (collectionId, subjectIndex) => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const uploadId = `${collectionId}-${subjectIndex}`;
    setUploadProgress({ ...uploadProgress, [uploadId]: 0 });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:5000/api/collections/${collectionId}/subjects/${subjectIndex}/documents`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [uploadId]: percentCompleted }));
        }
      });

      setFile(null);

      // Refresh collections data
      const collectionsResponse = await axios.get('http://localhost:5000/api/collections');
      setCollections(collectionsResponse.data.collections);

      // Update the selected collection for subjects modal if it's open
      if (selectedCollectionForSubjects) {
        const updatedCollection = collectionsResponse.data.collections.find(c => c._id === selectedCollectionForSubjects._id);
        if (updatedCollection) {
          setSelectedCollectionForSubjects(updatedCollection);
        }
      }

      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadId];
          return newProgress;
        });
      }, 1000);
    } catch (error) {
      console.error('Error uploading document:', error);
      // Remove progress on error
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[uploadId];
        return newProgress;
      });
    }
  };
  const handleChat = async (collectionId) => {
    if (!chatQuery.trim()) {
      alert('Please enter a query.');
      return;
    }
    setIsChatLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        query: chatQuery,
        collection_id: collectionId || 'all'
      });

      const newMessage = {
        type: 'user',
        content: chatQuery,
        timestamp: new Date().toISOString()
      };

      const botMessage = {
        type: 'bot',
        content: response.data.answer,
        sources: response.data.sources || [],
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, newMessage, botMessage]);
      setChatQuery('');
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatHistory(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    }
    setIsChatLoading(false);
  };
  const filteredCollections = collections
    .filter(collection =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortFilter) {
        case 'recent':
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'subjects':
          return (b.subjects?.length || 0) - (a.subjects?.length || 0);
        default:
          return 0;
      }
    });

  const indexOfLastCollection = currentPage * collectionsPerPage;
  const indexOfFirstCollection = indexOfLastCollection - collectionsPerPage;
  const currentCollections = filteredCollections.slice(indexOfFirstCollection, indexOfLastCollection);

  const totalPages = Math.ceil(filteredCollections.length / collectionsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">          <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-4">
            Syllabus Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organize your academic content with AI-powered insights and intelligent document management
          </p>
        </div><div className="mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center space-x-2 bg-white hover:bg-red-50 text-gray-700 px-4 py-3 rounded-xl border-2 border-red-200 transition-all duration-300 shadow-sm"
                >
                  <Filter className="h-5 w-5" />
                  <span className="capitalize">{sortFilter}</span>
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>              {showFilterDropdown && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-red-200 rounded-xl shadow-xl z-10 min-w-[160px]">
                    {[
                      { value: 'recent', label: 'Most Recent', icon: Calendar },
                      { value: 'oldest', label: 'Oldest First', icon: Calendar },
                      { value: 'alphabetical', label: 'A-Z', icon: BookOpen },
                      { value: 'subjects', label: 'Most Subjects', icon: GraduationCap }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortFilter(option.value);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors ${sortFilter === option.value ? 'text-red-600 bg-red-50' : 'text-gray-700'
                          }`}
                      >
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg font-semibold"
              >
                <Plus className="h-5 w-5" />
                <span>Create Collection</span>
              </button>
            </div>
          </div>        <div className="space-y-6">
            <div className="flex items-center justify-between">            <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-red-600" />
              <span>Your Collections</span>
              <span className="text-lg text-gray-500 font-normal">({filteredCollections.length})</span>
            </h2>
            </div>

            {isLoading && collections.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              </div>
            ) : currentCollections.length === 0 ? (<div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                {searchTerm ? 'No collections match your search' : 'No collections found'}
              </p>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first collection to get started'}
              </p>
            </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentCollections.map((collection, index) => (<div
                    key={collection._id}
                    className="group bg-white rounded-2xl shadow-lg border border-red-100 hover:border-red-300 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-slideInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-xl group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
                            <FolderOpen className="h-6 w-6 text-white" />
                          </div>                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                              {collection.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {collection.subjects?.length || 0} subjects
                            </p>
                          </div>
                        </div>                        <div className="relative">
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                            onClick={() => handleDeleteCollection(collection._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>                      {collection.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {collection.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {collection.createdAt
                              ? new Date(collection.createdAt).toLocaleDateString()
                              : 'No date'
                            }
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>
                            {collection.subjects?.reduce((total, subject) =>
                              total + (subject.documents?.length || 0), 0) || 0} docs
                          </span>
                        </span>
                      </div>

                      <div className="space-y-3">                        <button
                        className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 p-3 rounded-xl transition-all duration-300 flex justify-between items-center group/btn border border-gray-200 hover:border-red-300"
                        onClick={() => {
                          setSelectedCollectionForSubjects(collection);
                          setShowViewSubjectsModal(true);
                        }}
                      >
                        <span className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>View Subjects</span>
                        </span>
                        <ChevronDown className="h-5 w-5" />
                      </button>                        <button
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                        onClick={() => {
                          setSelectedCollectionForChat(collection._id);
                          setShowChat(true);
                        }}
                      >
                          <MessageCircle className="h-4 w-4" />
                          <span>Ask AI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-red-200"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${currentPage === pageNum
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                              : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-red-200"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <button
          className="fixed bottom-8 right-8 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 z-50"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageCircle className="h-6 w-6" />
        </button>      {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md animate-slideInUp">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg">
                      <Plus className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Create New Collection</h2>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-red-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="Enter collection name"
                    className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={collectionDescription}
                    onChange={(e) => setCollectionDescription(e.target.value)}
                    placeholder="Brief description of this collection"
                    rows={3}
                    className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCollection}
                    disabled={!collectionName.trim() || isLoading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg font-semibold"
                  >
                    {isLoading ? 'Creating...' : 'Create Collection'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}      {showSubjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md animate-slideInUp">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg">
                      <BookOpen className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Add New Subject</h2>
                  </div>
                  <button
                    onClick={() => setShowSubjectModal(false)}
                    className="text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-red-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Enter subject name"
                    className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target.value)}
                    placeholder="Brief description of this subject"
                    rows={3}
                    className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSubjectModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>                <button
                    onClick={async () => {
                      await handleAddSubject(selectedCollection);
                      setShowSubjectModal(false);
                    }}
                    disabled={!subjectName.trim() || isLoading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg font-semibold"
                  >
                    {isLoading ? 'Adding...' : 'Add Subject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}{showViewSubjectsModal && selectedCollectionForSubjects && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-slideInUp">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl">
                      <BookOpen className="h-7 w-7 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedCollectionForSubjects.name}
                      </h2>
                      <p className="text-red-100 text-sm">
                        {selectedCollectionForSubjects.subjects?.length || 0} Subjects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedCollection(selectedCollectionForSubjects._id);
                        setShowSubjectModal(true);
                      }}
                      className="bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Subject</span>
                    </button>
                    <button
                      onClick={() => setShowViewSubjectsModal(false)}
                      className="text-white hover:text-red-100 transition-colors p-2 rounded-lg hover:bg-red-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-red-50 via-white to-red-50">
                {selectedCollectionForSubjects.subjects?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-red-100 p-6 rounded-full mb-6">
                      <BookOpen className="h-16 w-16 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Subjects Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Start organizing your collection by adding subjects. Each subject can contain multiple documents.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCollection(selectedCollectionForSubjects._id);
                        setShowSubjectModal(true);
                      }}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg"
                    >
                      <Plus className="h-6 w-6" />
                      <span>Add Your First Subject</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(selectedCollectionForSubjects.subjects || [])
                      .slice(
                        (currentSubjectsPage - 1) * subjectsPerPage,
                        currentSubjectsPage * subjectsPerPage
                      )
                      .map((subject, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-100 hover:border-red-300"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 rounded-xl">
                                  <FileText className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {subject.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {subject.documents?.length || 0} documents
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <button
                                onClick={() => setSelectedSubject(selectedSubject === index ? null : index)}
                                className="w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-red-200 font-medium"
                              >
                                <Upload className="h-4 w-4" />
                                <span>Upload Document</span>
                                <ChevronDown className={`h-4 w-4 transform transition-transform ${selectedSubject === index ? 'rotate-180' : ''}`} />
                              </button>

                              {selectedSubject === index && (
                                <div className="animate-slideInDown space-y-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                  <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept=".pdf,.docx,.doc,.txt"
                                    className="w-full p-3 bg-white border-2 border-red-200 rounded-xl text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition-all duration-300"
                                  />
                                  <button
                                    onClick={() => handleUploadDocument(selectedCollectionForSubjects._id, index)}
                                    disabled={!file}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md"
                                  >
                                    {uploadProgress[`${selectedCollectionForSubjects._id}-${index}`] !== undefined
                                      ? `Uploading... ${uploadProgress[`${selectedCollectionForSubjects._id}-${index}`]}%`
                                      : 'Confirm Upload'
                                    }
                                  </button>
                                </div>
                              )}

                              {uploadProgress[`${selectedCollectionForSubjects._id}-${index}`] !== undefined && (
                                <div className="space-y-2">
                                  <div className="bg-red-200 rounded-full h-2">
                                    <div
                                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress[`${selectedCollectionForSubjects._id}-${index}`]}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              {subject.documents && subject.documents.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <h4 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-red-600" />
                                    <span>Documents:</span>
                                  </h4>
                                  <div className="space-y-2">
                                    {subject.documents.map((doc, docIndex) => (
                                      <div
                                        key={docIndex}
                                        className="flex items-center bg-gradient-to-r from-red-50 to-white p-3 rounded-lg border border-red-100"
                                      >
                                        <FileText className="h-4 w-4 text-red-600 mr-3 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 truncate font-medium">
                                          {doc.filename}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Pagination for subjects */}
                {Math.ceil((selectedCollectionForSubjects.subjects?.length || 0) / subjectsPerPage) > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentSubjectsPage(Math.max(1, currentSubjectsPage - 1))}
                        disabled={currentSubjectsPage === 1}
                        className="p-3 rounded-xl bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-red-200 shadow-sm"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {Array.from(
                        { length: Math.min(5, Math.ceil((selectedCollectionForSubjects.subjects?.length || 0) / subjectsPerPage)) },
                        (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentSubjectsPage(i + 1)}
                            className={`px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${currentSubjectsPage === i + 1
                              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                              : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
                              }`}
                          >
                            {i + 1}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setCurrentSubjectsPage(Math.min(
                          Math.ceil((selectedCollectionForSubjects.subjects?.length || 0) / subjectsPerPage),
                          currentSubjectsPage + 1
                        ))}
                        disabled={currentSubjectsPage === Math.ceil((selectedCollectionForSubjects.subjects?.length || 0) / subjectsPerPage)}
                        className="p-3 rounded-xl bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-red-200 shadow-sm"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}      {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-4xl mx-4 h-[80vh] flex flex-col">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-lg">
                      <Bot className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        AI Syllabus Assistant
                        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse ml-2" />
                      </h2>
                      <p className="text-sm text-red-100">
                        {selectedCollectionForChat ? `Chatting about: ${collections.find(c => c._id === selectedCollectionForChat)?.name}` : 'General Assistant'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedCollectionForChat || ''}
                      onChange={(e) => setSelectedCollectionForChat(e.target.value || null)}
                      className="bg-white text-sm text-gray-900 border border-red-200 rounded-lg p-2 focus:outline-none focus:border-red-500"
                    >
                      <option value="">All Collections</option>
                      {collections.map(collection => (
                        <option key={collection._id} value={collection._id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowChat(false)}
                      className="text-white hover:text-red-200 transition-colors p-2 rounded-lg hover:bg-red-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-gradient-to-br from-red-50 via-white to-red-50">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-lg">No messages yet</p>
                    <p className="text-gray-500 text-sm">Start a conversation by typing below</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`animate-fadeIn ${message.type === 'user'
                        ? 'ml-auto bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 max-w-[80%] shadow-lg'
                        : message.type === 'error'
                          ? 'bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 max-w-[80%]'
                          : 'bg-white border border-red-100 rounded-xl p-4 border-l-4 border-l-red-500 max-w-[80%] shadow-sm'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.type === 'bot' && (
                          <Bot className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="space-y-2">
                          <div className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                            {message.content}
                          </div>
                          {message.type === 'bot' && message.sources && message.sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-red-200">
                              <p className="text-xs text-gray-500 mb-1">Sources:</p>
                              <div className="space-y-1">
                                {message.sources.map((source, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                                    <FileText className="h-3 w-3 text-red-500" />
                                    <span>{source}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-red-200 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    placeholder="Ask me anything about your syllabus..."
                    className="w-full p-4 pr-24 bg-white border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-900 placeholder-gray-500 transition-all duration-300 shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && handleChat(selectedCollectionForChat)}
                    disabled={isChatLoading}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {isChatLoading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent"></div>
                    )}
                    <button
                      className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      onClick={() => handleChat(selectedCollectionForChat)}
                      disabled={!chatQuery.trim() || isChatLoading}
                    >
                      <Send className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send your message
                </p>
              </div>
            </div>
          </div>
        )}<style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-slideInDown {
          animation: slideInDown 0.4s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }      `}</style>
      </div>
    </>
  );
};

export default F1;
