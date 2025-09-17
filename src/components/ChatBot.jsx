import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import flowiseApi from '../services/flowiseApi';
import PurchaseHandler from './PurchaseHandler';

const ChatBot = ({ productId, productName, productCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseData, setPurchaseData] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [fullScreenTable, setFullScreenTable] = useState(null);
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

  // Open full-screen table
  const openFullScreenTable = (tableData) => {
    setFullScreenTable(tableData);
  };

  // Close full-screen table
  const closeFullScreenTable = () => {
    setFullScreenTable(null);
  };

  // Function to render message content with proper table formatting
  const renderMessageContent = (content) => {
    // Handle undefined or null content
    if (!content || typeof content !== 'string') {
      return <p className="text-gray-500 italic">No content</p>;
    }
    
    // Check if content contains purchase form
    if (content.includes('purchase-form-container')) {
      return (
        <div 
          className="purchase-form-wrapper"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Check if AI wants to show purchase form (detect keywords)
    if (content.toLowerCase().includes('proceed with the purchase') || 
        content.toLowerCase().includes('complete your order') ||
        content.toLowerCase().includes('purchase form') ||
        content.toLowerCase().includes('payment form')) {
      return (
        <div className="space-y-4">
          <p className="whitespace-pre-wrap">{content}</p>
          <div className="mt-4">
            <button
              onClick={handleShowPurchaseForm}
              className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              style={{fontFamily: 'Ubuntu, sans-serif'}}
            >
              Show Payment Form
            </button>
          </div>
        </div>
      );
    }
    
    // Check if content contains table-like structure
    if (content.includes('|') && content.includes('-')) {
      const lines = content.split('\n');
      const tableLines = lines.filter(line => line.includes('|'));
      
      if (tableLines.length > 0) {
        const tableId = `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return (
          <div className="space-y-2">
            <div className="overflow-x-auto relative">
              <table className="min-w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <tbody>
                  {tableLines.map((line, index) => {
                    // Skip separator lines (lines with only |, -, and spaces)
                    if (line.match(/^[\s\|\-]+$/)) return null;
                    
                    const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                    
                    return (
                      <tr key={index} className={index === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                        {cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-left">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Scroll indicator for wide tables */}
              <div className="absolute bottom-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full opacity-75">
                ← Scroll →
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => openFullScreenTable({ id: tableId, lines: tableLines })}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200"
                style={{fontFamily: 'Ubuntu, sans-serif'}}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>View Full Table</span>
              </button>
            </div>
          </div>
        );
      }
    }
    
    // Regular text content
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  // Handle purchase completion
  const handlePurchaseComplete = (purchaseResult) => {
    console.log('Purchase completed:', purchaseResult);
    setPurchaseData(purchaseResult);
  };

  // Handle purchase error
  const handlePurchaseError = (error) => {
    console.error('Purchase error:', error);
    setError(`Purchase failed: ${error}`);
  };

  // Show purchase form
  const handleShowPurchaseForm = () => {
    // Get current product context
    const productContext = getCurrentProductContext();
    
    // Try to extract product info from the conversation context
    let productInfo = null;
    
    // Look for product info in the last few messages
    const recentMessages = messages.slice(-5); // Check last 5 messages
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const message = recentMessages[i];
      if (message.type === 'assistant' && message.message) {
        // Look for total price patterns first (for PC builds)
        const totalPriceMatch = message.message.match(/Total[^:]*:?\s*(\d+\.?\d*)\s*(JOD|JD|\$|USD)/i);
        if (totalPriceMatch) {
          const totalPrice = parseFloat(totalPriceMatch[1]);
          
          // Check if this is a PC build (multiple components listed with different names)
          const bulletPoints = message.message.split('\n').filter(line => line.includes('•'));
          const hasMultipleDifferentComponents = bulletPoints.length > 1 && 
            bulletPoints.some(line => line.includes('CPU')) && 
            bulletPoints.some(line => line.includes('GPU'));
          
          if (hasMultipleDifferentComponents) {
            // This is a PC build
            productInfo = {
              id: productContext?.productId || `PC-BUILD-${Date.now()}`,
              name: 'PC Build',
              price: totalPrice,
              quantity: 1,
              category: 'PC Build',
              isPCBuild: true
            };
          } else {
            // Single product - look for the product name before the total
            const singleProductMatch = message.message.match(/([^•\n]+?):\s*(\d+\.?\d*)\s*(JOD|JD|\$|USD)/i);
            if (singleProductMatch) {
              productInfo = {
                id: productContext?.productId || `PROD-${Date.now()}`,
                name: singleProductMatch[1].trim(),
                price: totalPrice,
                quantity: 1,
                category: productContext?.productCategory || 'Hardware'
              };
            } else {
              // Fallback: extract from the line before "Total"
              const lines = message.message.split('\n');
              const totalLineIndex = lines.findIndex(line => line.includes('Total'));
              if (totalLineIndex > 0) {
                const productLine = lines[totalLineIndex - 1].trim();
                if (productLine.includes('•')) {
                  const productName = productLine.replace('•', '').split(':')[0].trim();
                  productInfo = {
                    id: productContext?.productId || `PROD-${Date.now()}`,
                    name: productName,
                    price: totalPrice,
                    quantity: 1,
                    category: productContext?.productCategory || 'Hardware'
                  };
                }
              }
            }
          }
          break;
        }
        
        // Fallback: Look for single price patterns
        const priceMatch = message.message.match(/(\d+\.?\d*)\s*(JOD|JD|\$|USD)/i);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          
          // Look for product name patterns - improved extraction
          const productNameMatch = message.message.match(/([^•\n]+?):\s*(\d+\.?\d*)\s*(JOD|JD|\$|USD)/i);
          let productName = 'Product';
          
          if (productNameMatch) {
            productName = productNameMatch[1].trim();
          } else {
            // Look for product name before the price with better pattern
            const beforePrice = message.message.substring(0, message.message.indexOf(priceMatch[0]));
            const lines = beforePrice.split('\n');
            const lastLine = lines[lines.length - 1].trim();
            
            if (lastLine && !lastLine.includes('Total') && !lastLine.includes('•')) {
              productName = lastLine;
            } else {
              // Fallback: look for any product name before the price
              const words = beforePrice.split(/\s+/).slice(-3); // Get last 3 words before price
              if (words.length > 0) {
                productName = words.join(' ');
              }
            }
          }
          
          productInfo = {
            id: productContext?.productId || `PROD-${Date.now()}`,
            name: productName,
            price: price,
            quantity: 1,
            category: productContext?.productCategory || 'Hardware'
          };
          break;
        }
      }
    }
    
    // If no product info found in conversation, use context or defaults
    if (!productInfo) {
      productInfo = {
        id: productContext?.productId || `PROD-${Date.now()}`,
        name: productContext?.productName || 'Selected Product',
        price: 0, // Will be filled by user or default
        quantity: 1,
        category: productContext?.productCategory || 'Hardware'
      };
    }
    
            console.log('Extracted product info:', productInfo);
            setCurrentProduct(productInfo);
            setShowPurchaseForm(true);
  };

  // Handle purchase form submission
  const handlePurchaseFormSubmit = (formData) => {
    // Simulate payment processing
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Store order data
    const orderData = {
      orderId,
      status: 'confirmed',
      totalPrice: currentProduct.price,
      products: [currentProduct],
      paymentInfo: {
        cardType: formData.cardType,
        last4: formData.cardNumber.slice(-4)
      },
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
    
    // Close form and redirect
    setShowPurchaseForm(false);
    window.location.href = `/order-confirmation/${orderId}`;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle input changes for formatting
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    e.target.value = formatted;
  };

  // Fill form with saved data
  const fillSavedData = () => {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const cardholderNameInput = document.getElementById('cardholderName');
    const emailInput = document.getElementById('email');

    if (cardNumberInput) {
      cardNumberInput.value = '4258 9674 5748 9624'; // Your credit card number
      cardNumberInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (expiryDateInput) {
      expiryDateInput.value = '12/25'; // Future expiry date
      expiryDateInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (cvvInput) {
      cvvInput.value = '281'; // Your CVV
    }
    if (cardholderNameInput) {
      cardholderNameInput.value = 'Marah Yousef';
    }
    if (emailInput) {
      emailInput.value = 'marah@gmail.com';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white rounded-full p-3 sm:p-4 shadow-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
          style={{fontFamily: 'Ubuntu, sans-serif'}}
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
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50 w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] min-h-[20rem] sm:min-h-[24rem] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-red-600 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6.5 12C5.7 12 5 12.7 5 13.5V16.5C5 17.3 5.7 18 6.5 18H7.5V20H9V18H15V20H16.5V18H17.5C18.3 18 19 17.3 19 16.5V13.5C19 12.7 18.3 12 17.5 12H6.5ZM7 14H17V16H7V14Z"/>
            </svg>
          </div>
          <span className="font-semibold" style={{fontFamily: 'Ubuntu, sans-serif'}}>TechBuddy</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="text-white hover:text-red-200 transition-colors p-1 rounded hover:bg-white/20"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-red-200 transition-colors p-1 rounded hover:bg-white/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Purchase Handler */}
      <PurchaseHandler 
        onPurchaseComplete={handlePurchaseComplete}
        onPurchaseError={handlePurchaseError}
      />

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Complete Your Purchase</h3>
                <button
                  onClick={() => setShowPurchaseForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">{currentProduct?.name}</p>
                      <p className="text-xs text-gray-500">
                        {currentProduct?.isPCBuild ? 'Complete PC Build' : `Quantity: ${currentProduct?.quantity}`}
                      </p>
                      {currentProduct?.isPCBuild && (
                        <p className="text-xs text-blue-600 mt-1">✨ Includes all components with individual pricing</p>
                      )}
                    </div>
                    <div className="text-right">
                      {currentProduct?.price > 0 ? (
                        <div>
                          <p className="font-semibold text-purple-600 text-lg">{currentProduct?.price?.toFixed(2)} JOD</p>
                          {currentProduct?.isPCBuild && (
                            <p className="text-xs text-gray-500">Total Build Price</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              setCurrentProduct(prev => ({ ...prev, price: newPrice }));
                            }}
                          />
                          <span className="text-sm text-gray-600">JOD</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {currentProduct?.price === 0 && (
                    <p className="text-xs text-blue-600">Please enter the product price above</p>
                  )}
                </div>
              </div>

              {/* Payment Form */}
              <form 
                autoComplete="on"
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Validate price is entered
                  if (currentProduct?.price <= 0) {
                    alert('Please enter a valid product price before proceeding with payment.');
                    return;
                  }
                  
                  const formData = new FormData(e.target);
                  handlePurchaseFormSubmit({
                    cardNumber: formData.get('cardNumber'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv'),
                    cardholderName: formData.get('cardholderName'),
                    email: formData.get('email'),
                    cardType: formData.get('cardNumber')?.startsWith('4') ? 'Visa' : 'Mastercard'
                  });
                }}
              >
                {/* Quick Fill Button */}
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800 font-medium" style={{fontFamily: 'Ubuntu, sans-serif'}}>
                        💳 Your Saved Payment Info
                      </p>
                      <p className="text-xs text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>
                        Quickly fill your saved payment details
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fillSavedData}
                      className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
                      style={{fontFamily: 'Ubuntu, sans-serif'}}
                    >
                      FILL YOUR SAVED INFO
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1" style={{fontFamily: 'Ubuntu, sans-serif'}}>Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      pattern="[0-9\s]{13,19}"
                      maxLength="19"
                      onChange={handleCardNumberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      style={{fontFamily: 'Ubuntu, sans-serif'}}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1" style={{fontFamily: 'Ubuntu, sans-serif'}}>Expiry Date</label>
                      <input
                        id="expiryDate"
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                        maxLength="5"
                        onChange={handleExpiryDateChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                        style={{fontFamily: 'Ubuntu, sans-serif'}}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1" style={{fontFamily: 'Ubuntu, sans-serif'}}>CVV</label>
                      <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        placeholder="123"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        pattern="[0-9]{3,4}"
                        maxLength="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                        style={{fontFamily: 'Ubuntu, sans-serif'}}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1" style={{fontFamily: 'Ubuntu, sans-serif'}}>Cardholder Name</label>
                    <input
                      id="cardholderName"
                      type="text"
                      name="cardholderName"
                      placeholder="John Doe"
                      autoComplete="cc-name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      style={{fontFamily: 'Ubuntu, sans-serif'}}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" style={{fontFamily: 'Ubuntu, sans-serif'}}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      style={{fontFamily: 'Ubuntu, sans-serif'}}
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={currentProduct?.price <= 0}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      currentProduct?.price > 0
                        ? 'bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{fontFamily: 'Ubuntu, sans-serif'}}
                  >
                    {currentProduct?.price > 0 
                      ? `Complete Purchase - ${currentProduct?.price?.toFixed(2)} JOD`
                      : 'Enter Product Price First'
                    }
                  </button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    <strong>🔒 Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Table Modal */}
      {fullScreenTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Table View</h3>
              <button
                onClick={closeFullScreenTable}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                  <tbody>
                    {fullScreenTable.lines.map((line, index) => {
                      // Skip separator lines (lines with only |, -, and spaces)
                      if (line.match(/^[\s\|\-]+$/)) return null;
                      
                      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                      
                      return (
                        <tr key={index} className={index === 0 ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}>
                          {cells.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-left">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {fullScreenTable.lines.length} rows • Click and drag to scroll horizontally
                </span>
                <button
                  onClick={closeFullScreenTable}
                  className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  style={{fontFamily: 'Ubuntu, sans-serif'}}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-red-50 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-800 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V7.5C15 8.3 14.3 9 13.5 9H10.5C9.7 9 9 8.3 9 7.5V6.5L3 7V9L9 8.5V9.5C9 10.3 9.7 11 10.5 11H13.5C14.3 11 15 10.3 15 9.5V8.5L21 9ZM6.5 12C5.7 12 5 12.7 5 13.5V16.5C5 17.3 5.7 18 6.5 18H7.5V20H9V18H15V20H16.5V18H17.5C18.3 18 19 17.3 19 16.5V13.5C19 12.7 18.3 12 17.5 12H6.5ZM7 14H17V16H7V14Z"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{fontFamily: 'Ubuntu, sans-serif'}}>Hi! I'm TechBuddy, your AI assistant!</p>
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
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm break-words ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-gray-800 to-red-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                  style={{fontFamily: 'Ubuntu, sans-serif'}}
                >
                  <div className="space-y-2">
                    {renderMessageContent(message.message || '')}
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-gray-300' : 'text-gray-500'
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
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl text-sm shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 px-4 py-3 rounded-2xl text-sm border border-red-200">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{fontFamily: 'Ubuntu, sans-serif'}}>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about our products..."
            className="flex-1 border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200"
            style={{fontFamily: 'Ubuntu, sans-serif'}}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none flex-shrink-0"
            style={{fontFamily: 'Ubuntu, sans-serif'}}
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
