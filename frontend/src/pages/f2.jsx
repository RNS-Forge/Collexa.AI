import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import { User, Bot, Send, Mic, StopCircle, Trash2, FileText, File, UploadCloud, RefreshCw, X, Paperclip, AlertCircle, CheckCircle2 } from 'lucide-react';

const RNSReply = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Load uploaded files on component mount
  useEffect(() => {
    loadUploadedFiles();
    // Add welcome message
    setMessages([{
      id: 0,
      type: 'bot',
      content: "Hello! I'm RNS Reply, your intelligent assistant. I can help you with any questions and provide relevant YouTube videos when applicable. Upload files to enhance my knowledge about your specific topics!",
      timestamp: new Date(),
      isWelcome: true
    }]);

    // Initialize voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chatbot/files');
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files || []);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.answer,
          sources: data.sources || [],
          videoLinks: data.video_links || [],
          hasFileContext: data.has_file_context,
          chatbotName: data.chatbot_name || "RNS Reply",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, DOC, DOCX, and TXT files are supported.');
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 201) {
          loadUploadedFiles();
          setUploadProgress(0);
          alert('File uploaded successfully!');
        } else {
          const errorData = JSON.parse(xhr.responseText);
          alert(`Upload failed: ${errorData.error}`);
          setUploadProgress(0);
        }
      };

      xhr.onerror = () => {
        alert('Upload failed. Please try again.');
        setUploadProgress(0);
      };

      xhr.open('POST', 'http://localhost:5000/api/chatbot/upload');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chatbot/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadUploadedFiles();
        alert('File deleted successfully!');
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat?')) {
      setMessages([{
        id: 0,
        type: 'bot',
        content: "Chat cleared! I'm RNS Reply, ready to help you again. How can I assist you today?",
        timestamp: new Date(),
        isWelcome: true
      }]);
    }
  };

  const renderVideoLinks = (videoLinks) => {
    if (!videoLinks || videoLinks.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h6 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" /> Recommended Videos
        </h6>
        <div className="space-y-3">
          {videoLinks.map((link, index) => {
            let videoId = '';
            if (link.includes('youtube.com/watch?v=')) {
              videoId = link.split('watch?v=')[1].split('&')[0];
            } else if (link.includes('youtu.be/')) {
              videoId = link.split('youtu.be/')[1].split('?')[0];
            } else if (link.includes('youtube.com/embed/')) {
              videoId = link.split('embed/')[1].split('?')[0];
            }

            return (
              <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
                {videoId ? (
                  <div className="youtube-embed">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                      title={`Video ${index + 1}`}
                    ></iframe>
                  </div>
                ) : (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 underline break-all text-sm"
                  >
                    {link}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'doc':
      case 'docx': return <File className="w-5 h-5" />;
      case 'txt': return <FileText className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      <div className="pt-20">
        <div className="flex h-screen">
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'mr-80' : 'mr-0'}`}>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div className={`max-w-4xl rounded-2xl px-6 py-4 shadow-lg ${message.type === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : message.isError ? 'bg-red-50 text-red-800 border border-red-200' : message.isWelcome ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' : 'bg-white text-gray-800 border border-gray-200 shadow-xl'}`}>
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">
                        {message.type === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.content}
                        </div>
                        {message.type === 'bot' && message.sources && message.sources.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-sm text-blue-800">
                              <strong>📂 Sources from your files:</strong>
                              <ul className="mt-2 space-y-1">
                                {message.sources.map((source, index) => (
                                  <li key={index} className="text-xs bg-white px-2 py-1 rounded border">
                                    {source}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        {message.type === 'bot' && message.hasFileContext && (
                          <div className="mt-3 flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit">
                            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 animate-pulse"></span>
                            Enhanced with your files
                          </div>
                        )}
                        {message.type === 'bot' && renderVideoLinks(message.videoLinks)}
                        <div className="flex items-center justify-between mt-3 text-xs opacity-75">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.chatbotName && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {message.chatbotName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl animate-bounce">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-gray-600 ml-2">RNS Reply is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6 shadow-lg mb-16 rounded-lg">
              {isListening && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 font-medium flex items-center">
                    <Mic className="w-4 h-4 mr-1" /> Listening... Speak now
                  </span>
                  <button
                    onClick={toggleVoiceInput}
                    className="ml-auto text-red-600 hover:text-red-800 text-sm underline flex items-center"
                  >
                    <StopCircle className="w-4 h-4 mr-1" /> Stop
                  </button>
                </div>
              )}
              <div className="flex space-x-4 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask RNS Reply anything... (Shift + Enter for new line)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200"
                    rows="2"
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {inputMessage.length}/2000

                    <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAdditionalButtons(!showAdditionalButtons)}
                    className="px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                    title="More options"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  {showAdditionalButtons && (
                    <div className={`flex space-x-2 transition-all duration-300 ${showAdditionalButtons ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                      {voiceSupported && (
                        <button
                          onClick={toggleVoiceInput}
                          disabled={isLoading}
                          className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                          title={isListening ? 'Stop voice input' : 'Start voice input'}
                        >
                          {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                      )}
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                        <span className="font-medium">Send</span>
                      </button>
                    </div>
                  )}
                </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          {sidebarOpen && (
            <div className="fixed right-0 top-1 h-full w-80 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-40">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <File className="w-5 h-5 mr-1" /> File Manager
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">Upload files to enhance RNS Reply</p>
              </div>
              <div className="p-4 border-b border-gray-200">
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragOver ? 'border-purple-500 bg-purple-50 scale-105' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-4xl mb-3 flex justify-center">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Drop files here</p>
                  <p className="text-xs text-gray-500 mb-2">or click to browse</p>
                  <div className="flex justify-center space-x-2 text-xs text-gray-400">
                    <span>📄 PDF</span>
                    <span>📝 DOC</span>
                    <span>📋 TXT</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                {uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Uploaded Files ({uploadedFiles.length})</h3>
                    <button
                      onClick={loadUploadedFiles}
                      className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                      title="Refresh files"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {uploadedFiles.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-3 flex justify-center">
                        <File className="w-16 h-16" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No files uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Upload files to enhance RNS Reply</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file._id}
                          className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg p-3 border border-gray-200 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-2">
                                <span className="mr-2">{getFileIcon(file.filename)}</span>
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-gray-800 block truncate">
                                    {file.filename}
                                  </span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                      {formatFileSize(file.file_size)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(file.uploaded_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {file.content_preview && (
                                <div className="bg-white p-2 rounded border border-gray-200 mt-2">
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {file.content_preview}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteFile(file._id)}
                              className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors"
                              title="Delete file"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Files:</span>
                    <span className="font-medium">{uploadedFiles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Size:</span>
                    <span className="font-medium">
                      {formatFileSize(uploadedFiles.reduce((sum, file) => sum + (file.file_size || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .youtube-embed iframe {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default RNSReply;
