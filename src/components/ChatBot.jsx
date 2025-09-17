import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import flowiseApi from '../services/flowiseApi';

const ChatBot = ({ productId, productName, productCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Get current product context from props or URL
  const getCurrentProductContext = () => {
    // If props are provided, use them
    if (productId) {
      return {
        productId,
        productName,
        productCategory
      };
    }
    
    // Fallback to URL parsing for other pages
    const path = location.pathname;
    const productMatch = path.match(/\/product\/(.+)/);
    if (productMatch) {
      return {
        productId: productMatch[1],
        productName: null,
        productCategory: null
      };
    }
    return null;
  };

  // Load chat history on component mount
  useEffect(() => {
    try {
      const history = flowiseApi.getDisplayHistory();
      if (Array.isArray(history)) {
        setMessages(history);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    }
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Get current product context
      const productContext = getCurrentProductContext();
      
      // Send message to Flowise API (this will handle adding user message to history)
      const response = await flowiseApi.sendMessage(
        userMessage,
        productContext?.productId,
        productContext?.productName,
        productContext?.productCategory
      );

      // Reload messages from localStorage to get the complete conversation
      const updatedHistory = flowiseApi.getDisplayHistory();
      setMessages(updatedHistory);

    } catch (err) {
      setError(err.message);
      // Reload messages from localStorage to get the complete conversation
      const updatedHistory = flowiseApi.getDisplayHistory();
      setMessages(updatedHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    flowiseApi.clearHistory();
    setMessages([]);
    setError('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Function to render message content with proper table formatting
  const renderMessageContent = (content) => {
    // Handle undefined or null content
    if (!content || typeof content !== 'string') {
      return <p className="text-gray-500 italic">No content</p>;
    }
    
    // Check if content contains table-like structure
    if (content.includes('|') && content.includes('-')) {
      const lines = content.split('\n');
      const tableLines = lines.filter(line => line.includes('|'));
      
      if (tableLines.length > 0) {
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <tbody>
                {tableLines.map((line, index) => {
                  // Skip separator lines (lines with only |, -, and spaces)
                  if (line.match(/^[\s\|\-]+$/)) return null;
                  
                  const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                  
                  return (
                    <tr key={index} className={index === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                      {cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-left">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }
    
    // Regular text content
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6.5 12C5.7 12 5 12.7 5 13.5V16.5C5 17.3 5.7 18 6.5 18H7.5V20H9V18H15V20H16.5V18H17.5C18.3 18 19 17.3 19 16.5V13.5C19 12.7 18.3 12 17.5 12H6.5ZM7 14H17V16H7V14Z"/>
          </svg>
          <span className="hidden sm:block font-semibold">TechBuddy</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 sm:w-[28rem] bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col h-[32rem] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6.5 12C5.7 12 5 12.7 5 13.5V16.5C5 17.3 5.7 18 6.5 18H7.5V20H9V18H15V20H16.5V18H17.5C18.3 18 19 17.3 19 16.5V13.5C19 12.7 18.3 12 17.5 12H6.5ZM7 14H17V16H7V14Z"/>
            </svg>
          </div>
          <span className="font-semibold">TechBuddy</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="text-white hover:text-purple-200 transition-colors p-1 rounded hover:bg-white/20"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-purple-200 transition-colors p-1 rounded hover:bg-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-indigo-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6.5 12C5.7 12 5 12.7 5 13.5V16.5C5 17.3 5.7 18 6.5 18H7.5V20H9V18H15V20H16.5V18H17.5C18.3 18 19 17.3 19 16.5V13.5C19 12.7 18.3 12 17.5 12H6.5ZM7 14H17V16H7V14Z"/>
              </svg>
            </div>
            <p className="text-sm font-medium">Hi! I'm TechBuddy, your AI assistant!</p>
            <p className="text-xs text-gray-500 mt-1">I can help with product specifications, compatibility, and recommendations</p>
            {!flowiseApi.isConfigured() && (
              <p className="text-xs text-red-500 mt-2">⚠️ API not configured</p>
            )}
          </div>
        ) : (
          messages.map((message, index) => {
            // Safety check for message object
            if (!message || typeof message !== 'object') {
              return null;
            }
            
            return (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-purple-100'
                  }`}
                >
                  <div className="space-y-2">
                    {renderMessageContent(message.message || '')}
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp ? formatTime(message.timestamp) : 'Just now'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl text-sm shadow-sm border border-purple-100">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 px-4 py-3 rounded-2xl text-sm border border-red-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about our products..."
            className="flex-1 border border-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
