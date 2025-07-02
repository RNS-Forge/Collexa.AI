import React, { useState, useEffect, useRef } from 'react';

const Feature2 = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4');
    const [messageCount, setMessageCount] = useState(0);
    const [exportFormat, setExportFormat] = useState('json');
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognition = useRef(null);
    const textareaRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognition.current = new window.webkitSpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';
            
            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(prev => prev + transcript);
                setIsRecording(false);
            };
            
            recognition.current.onerror = () => {
                setIsRecording(false);
            };
        }
    }, []);

    // Auto-resize textarea
    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResizeTextarea();
    }, [inputMessage]);

    // Filter files based on search
    useEffect(() => {
        const filtered = uploadedFiles.filter(file =>
            file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (file.content_preview && file.content_preview.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredFiles(filtered);
    }, [uploadedFiles, searchQuery]);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Load uploaded files on component mount
    useEffect(() => {
        loadUploadedFiles();
        loadChatHistory();
    }, []);

    const loadUploadedFiles = async () => {
        try {
            // Simulated file loading since we can't use localStorage
            const mockFiles = [
                {
                    _id: '1',
                    filename: 'sample-document.pdf',
                    file_size: 1024000,
                    uploaded_at: new Date().toISOString(),
                    content_preview: 'This is a sample document with important information...'
                },
                {
                    _id: '2',
                    filename: 'research-paper.docx',
                    file_size: 2048000,
                    uploaded_at: new Date().toISOString(),
                    content_preview: 'Research findings and analysis data...'
                }
            ];
            setUploadedFiles(mockFiles);
        } catch (error) {
            console.error('Failed to load files:', error);
        }
    };

    const loadChatHistory = () => {
        // Simulated chat history
        const mockHistory = [
            { id: '1', title: 'Document Analysis', date: new Date(), messageCount: 5 },
            { id: '2', title: 'Code Review', date: new Date(), messageCount: 12 }
        ];
        setChatHistory(mockHistory);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date(),
            model: selectedModel
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);
        setMessageCount(prev => prev + 1);

        // Simulate typing delay
        setTimeout(() => setIsTyping(false), 1000);

        try {
            // Simulated API response since we can't make real requests
            const responses = [
                "I understand your question about the uploaded documents. Based on the files you've shared, I can provide detailed insights.",
                "That's an excellent question! Let me analyze the information from your files and provide a comprehensive answer.",
                "I've processed your query using both my general knowledge and your uploaded documents. Here's what I found:",
                "Great question! I can see relevant information in your uploaded files that helps answer this."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: randomResponse,
                    sources: uploadedFiles.length > 0 ? [uploadedFiles[0].filename] : [],
                    videoLinks: [],
                    hasFileContext: uploadedFiles.length > 0,
                    timestamp: new Date(),
                    model: selectedModel
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            }, 2000);

        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Sorry, I encountered an error while processing your request. Please try again.',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVoiceRecord = () => {
        if (!recognition.current) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        if (isRecording) {
            recognition.current.stop();
            setIsRecording(false);
        } else {
            recognition.current.start();
            setIsRecording(true);
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

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Add file to uploaded files
                    const newFile = {
                        _id: Date.now().toString(),
                        filename: file.name,
                        file_size: file.size,
                        uploaded_at: new Date().toISOString(),
                        content_preview: 'File uploaded successfully and processed...'
                    };
                    setUploadedFiles(prev => [...prev, newFile]);
                    setTimeout(() => setUploadProgress(0), 1000);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleDeleteFile = async (fileId) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        setUploadedFiles(prev => prev.filter(file => file._id !== fileId));
    };

    const handleExportChat = () => {
        const chatData = {
            messages,
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            files: uploadedFiles.map(f => f.filename)
        };

        const dataStr = exportFormat === 'json' 
            ? JSON.stringify(chatData, null, 2)
            : messages.map(m => `[${m.type.toUpperCase()}] ${m.content}`).join('\n\n');
        
        const dataBlob = new Blob([dataStr], { type: exportFormat === 'json' ? 'application/json' : 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-export-${new Date().getTime()}.${exportFormat}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const clearChat = () => {
        if (confirm('Are you sure you want to clear the chat?')) {
            setMessages([]);
            setMessageCount(0);
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
            case 'pdf': return '📄';
            case 'doc':
            case 'docx': return '📝';
            case 'txt': return '📋';
            default: return '📁';
        }
    };

    const themeClass = darkMode ? 'dark' : '';

    return (
        <div className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex ${themeClass}`}>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col" style={{ width: sidebarCollapsed ? '90%' : '75%' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="text-3xl">🤖</div>
                            <div>
                                <h1 className="text-2xl font-bold">AI Assistant Pro</h1>
                                <p className="text-red-100 text-sm">
                                    Enhanced with {uploadedFiles.length} files • {messageCount} messages
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            {/* Model Selector */}
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="bg-red-500 text-white border border-red-400 rounded-lg px-3 py-1 text-sm"
                            >
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-3.5">GPT-3.5</option>
                                <option value="claude">Claude</option>
                            </select>
                            
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            
                            {/* Export Button */}
                            <button
                                onClick={handleExportChat}
                                className="p-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                                title="Export Chat"
                            >
                                📥
                            </button>
                            
                            {/* Clear Chat Button */}
                            <button
                                onClick={clearChat}
                                className="p-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                                title="Clear Chat"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-red-500 text-white px-4 py-2 text-sm flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Online
                        </span>
                        <span>Model: {selectedModel}</span>
                        {uploadedFiles.length > 0 && (
                            <span>📚 {uploadedFiles.length} files loaded</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Export as:</span>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="bg-red-400 text-white border-none rounded px-2 py-1 text-xs"
                        >
                            <option value="json">JSON</option>
                            <option value="txt">TXT</option>
                        </select>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-8xl mb-6 animate-bounce">🤖</div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">Welcome to AI Assistant Pro!</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
                                Experience the next generation of AI assistance with enhanced file processing, 
                                voice commands, and intelligent responses.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200">
                                    <div className="text-4xl mb-4">🧠</div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-2">Smart Analysis</h4>
                                    <p className="text-gray-600 text-sm">Advanced AI processing with context awareness</p>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200">
                                    <div className="text-4xl mb-4">📁</div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-2">File Intelligence</h4>
                                    <p className="text-gray-600 text-sm">Upload and analyze documents seamlessly</p>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-xl shadow-lg border border-red-200">
                                    <div className="text-4xl mb-4">🎤</div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-2">Voice Control</h4>
                                    <p className="text-gray-600 text-sm">Speak naturally with voice recognition</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        >
                            <div
                                className={`max-w-4xl rounded-2xl px-6 py-4 shadow-lg ${
                                    message.type === 'user'
                                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                                        : message.isError
                                        ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200'
                                        : 'bg-white text-gray-800 border-2 border-gray-100 shadow-xl'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`text-2xl ${message.type === 'user' ? '' : 'animate-pulse'}`}>
                                        {message.type === 'user' ? '👤' : '🤖'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                                            {message.content}
                                        </div>

                                        {message.type === 'bot' && message.sources && message.sources.length > 0 && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                                                <div className="text-sm text-red-800">
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
                                            <div className="mt-3 flex items-center text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit">
                                                <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                                                Enhanced with your files
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3 text-xs opacity-75">
                                            <span>{message.timestamp.toLocaleTimeString()}</span>
                                            {message.model && (
                                                <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                                                    {message.model}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(isLoading || isTyping) && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 shadow-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl animate-bounce">🤖</div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <span className="text-gray-600 ml-2">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="bg-white border-t-2 border-red-100 p-4 shadow-lg">
                    <div className="flex space-x-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message... (Shift + Enter for new line)"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200 min-h-[60px] max-h-[120px]"
                                disabled={isLoading}
                                style={{ height: 'auto' }}
                            />
                            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                                <span className="text-xs text-gray-400">
                                    {inputMessage.length}/2000
                                </span>
                            </div>
                        </div>
                        
                        {/* Voice Record Button */}
                        <button
                            onClick={handleVoiceRecord}
                            disabled={isLoading}
                            className={`p-3 rounded-xl transition-all duration-200 ${
                                isRecording 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600'
                            }`}
                            title="Voice input"
                        >
                            🎤
                        </button>
                        
                        {/* Send Button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg"
                        >
                            <span className="text-xl">🚀</span>
                            <span className="font-medium">Send</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Sidebar */}
            <div 
                className={`bg-white shadow-2xl border-l-4 border-red-500 flex flex-col transition-all duration-300 ${
                    sidebarCollapsed ? 'w-16' : 'w-1/4'
                }`}
            >
                {/* Sidebar Header */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-b-2 border-red-100">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                📁 File Manager Pro
                            </h2>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                            {sidebarCollapsed ? '→' : '←'}
                        </button>
                    </div>
                    {!sidebarCollapsed && (
                        <p className="text-xs text-gray-600 mt-1">Advanced file management & search</p>
                    )}
                </div>

                {!sidebarCollapsed && (
                    <>
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                                />
                                <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-4">
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                                    isDragOver
                                        ? 'border-red-500 bg-red-50 scale-105'
                                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="text-4xl mb-3 animate-bounce">📤</div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Drop files here</p>
                                <p className="text-xs text-gray-500 mb-2">or click to browse</p>
                                <div className="flex justify-center space-x-1 text-xs text-gray-400">
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
                                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Files List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 pt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Files ({filteredFiles.length})</h3>
                                    <button
                                        onClick={loadUploadedFiles}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        title="Refresh files"
                                    >
                                        🔄
                                    </button>
                                </div>

                                {filteredFiles.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-5xl mb-3">📚</div>
                                        <p className="text-sm text-gray-500 font-medium">
                                            {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {searchQuery ? 'Try a different search term' : 'Upload files to get started'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredFiles.map((file) => (
                                            <div
                                                key={file._id}
                                                className="bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center mb-2">
                                                            <span className="text-2xl mr-3">{getFileIcon(file.filename)}</span>
                                                            <div className="flex-1">
                                                                <span className="text-sm font-bold text-gray-800 block truncate">
                                                                    {file.filename}
                                                                </span>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                                                        {formatFileSize(file.file_size)}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(file.uploaded_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {file.content_preview && (
                                                            <div className="bg-white p-2 rounded-lg border border-gray-200 mt-2">
                                                                <p className="text-xs text-gray-700 line-clamp-2">
                                                                    {file.content_preview}
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                                                    title="View details"
                                                                >
                                                                    👁️ View
                                                                </button>
                                                                <button
                                                                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                                                    title="Download"
                                                                >
                                                                    📥 Download
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteFile(file._id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors"
                                                                title="Delete file"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Stats & Controls */}
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-t-2 border-red-100 p-4">
                            <div className="space-y-4">
                                {/* File Statistics */}
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                                    <h4 className="font-bold text-gray-800 mb-2 text-sm">📊 Statistics</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-red-50 p-2 rounded">
                                            <div className="text-red-600 font-bold">
                                                {uploadedFiles.length}
                                            </div>
                                            <div className="text-red-500">Total Files</div>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded">
                                            <div className="text-red-600 font-bold">
                                                {formatFileSize(uploadedFiles.reduce((sum, file) => sum + (file.file_size || 0), 0))}
                                            </div>
                                            <div className="text-red-500">Total Size</div>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded">
                                            <div className="text-red-600 font-bold">
                                                {messageCount}
                                            </div>
                                            <div className="text-red-500">Messages</div>
                                        </div>
                                        <div className="bg-red-50 p-2 rounded">
                                            <div className="text-red-600 font-bold">
                                                {selectedModel}
                                            </div>
                                            <div className="text-red-500">AI Model</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                                    <h4 className="font-bold text-gray-800 mb-2 text-sm">⚡ Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full text-xs bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                        >
                                            ➕ Add Files
                                        </button>
                                        <button
                                            onClick={handleExportChat}
                                            className="w-full text-xs bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            📤 Export Chat
                                        </button>
                                        <button
                                            onClick={clearChat}
                                            className="w-full text-xs bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                        >
                                            🗑️ Clear Chat
                                        </button>
                                    </div>
                                </div>

                                {/* Chat History */}
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                                    <h4 className="font-bold text-gray-800 mb-2 text-sm">💬 Recent Chats</h4>
                                    {chatHistory.length > 0 ? (
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {chatHistory.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="bg-gray-50 p-2 rounded cursor-pointer hover:bg-red-50 transition-colors"
                                                    onClick={() => setCurrentChatId(chat.id)}
                                                >
                                                    <div className="text-xs font-medium text-gray-700 truncate">
                                                        {chat.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex justify-between">
                                                        <span>{chat.messageCount} msgs</span>
                                                        <span>{chat.date.toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500 text-center py-2">
                                            No chat history yet
                                        </div>
                                    )}
                                </div>

                                {/* Settings Panel */}
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                                    <h4 className="font-bold text-gray-800 mb-2 text-sm">⚙️ Settings</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between text-xs">
                                            <span className="text-gray-700">Voice Input</span>
                                            <input
                                                type="checkbox"
                                                checked={voiceEnabled}
                                                onChange={(e) => setVoiceEnabled(e.target.checked)}
                                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between text-xs">
                                            <span className="text-gray-700">Dark Mode</span>
                                            <input
                                                type="checkbox"
                                                checked={darkMode}
                                                onChange={(e) => setDarkMode(e.target.checked)}
                                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                            />
                                        </label>
                                        <div className="text-xs">
                                            <label className="text-gray-700 block mb-1">Export Format:</label>
                                            <select
                                                value={exportFormat}
                                                onChange={(e) => setExportFormat(e.target.value)}
                                                className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="json">JSON</option>
                                                <option value="txt">Text</option>
                                                <option value="csv">CSV</option>
                                                <option value="pdf">PDF</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200">
                                    <h4 className="font-bold text-gray-800 mb-2 text-sm">🔌 System Status</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">API Status</span>
                                            <span className="flex items-center text-green-600">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                                Online
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">Voice Recognition</span>
                                            <span className="flex items-center text-green-600">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                {recognition.current ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">File Upload</span>
                                            <span className="flex items-center text-green-600">
                                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                Ready
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700">Memory Usage</span>
                                            <span className="text-blue-600">
                                                {Math.round((uploadedFiles.length * 100) / 10)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Custom Styles */}
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
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #dc2626;
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #b91c1c;
                }
                
                /* Dark mode styles */
                .dark {
                    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                }
                
                .dark .bg-white {
                    background-color: #374151;
                    color: white;
                }
                
                .dark .text-gray-800 {
                    color: #f3f4f6;
                }
                
                .dark .text-gray-600 {
                    color: #d1d5db;
                }
                
                .dark .border-gray-200 {
                    border-color: #4b5563;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .min-h-screen {
                        flex-direction: column;
                    }
                    
                    .w-1\/4, .w-1\/5 {
                        width: 100%;
                        height: 40vh;
                    }
                    
                    .flex-1 {
                        width: 100%;
                        height: 60vh;
                    }
                }
                
                /* Animation for recording */
                @keyframes pulse-red {
                    0%, 100% { background-color: #dc2626; }
                    50% { background-color: #ef4444; }
                }
                
                .animate-pulse-red {
                    animation: pulse-red 1s infinite;
                }
            `}</style>
        </div>
    );
};

export default Feature2;