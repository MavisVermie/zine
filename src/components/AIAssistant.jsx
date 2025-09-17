import { useState, useRef, useEffect } from 'react';
import { useProductContext } from '../contexts/ProductContext';

const AIAssistant = () => {
  const { 
    currentProduct, 
    isAIAssistantOpen, 
    closeAIAssistant, 
    sendToFlowise 
  } = useProductContext();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What are the specifications?",
    "What is the warranty?",
    "Is this compatible with my motherboard?",
    "How does this compare to other CPUs?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAIAssistantOpen && messages.length === 0) {
      // Add welcome message when assistant opens
      const welcomeMessage = currentProduct 
        ? `Hello! I can help you with questions about the ${currentProduct.name}. Try asking about specifications, warranty, compatibility, or performance!`
        : "Hello! I can help you with questions about our products. What would you like to know?";
      
      setMessages([{
        id: Date.now(),
        type: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isAIAssistantOpen, currentProduct]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
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
      const response = await sendToFlowise(inputMessage);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.text || response.message || 'I apologize, but I could not process your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isAIAssistantOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-red-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm" style={{fontFamily: 'Ubuntu, sans-serif'}}>AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-white" style={{fontFamily: 'Ubuntu, sans-serif'}}>AI Assistant</h3>
              {currentProduct && (
                <p className="text-sm text-gray-300">
                  Helping with: {currentProduct.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={closeAIAssistant}
            className="text-white hover:text-red-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-red-50">
          {messages.length === 1 && currentProduct && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-3 py-1 rounded-full transition-colors"
                    style={{fontFamily: 'Ubuntu, sans-serif'}}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-gray-800 to-red-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
                style={{fontFamily: 'Ubuntu, sans-serif'}}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                  <span className="text-sm" style={{fontFamily: 'Ubuntu, sans-serif'}}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about this product..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              style={{fontFamily: 'Ubuntu, sans-serif'}}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              style={{fontFamily: 'Ubuntu, sans-serif'}}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
