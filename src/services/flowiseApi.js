// Flowise API service for chat integration
const FLOWISE_API_URL = import.meta.env.VITE_FLOWISE_API_URL || 'https://cloud.flowiseai.com';
const FLOWISE_API_KEY = import.meta.env.VITE_FLOWISE_API_KEY || 'uQZ5hwTBiAQbpl_Il1K3UBypIRbgxBZ25vGsIHsYxDg';
const CHATFLOW_ID = '30c97938-1c04-4822-998d-e00b368a8833';

class FlowiseApiService {
  constructor() {
    this.apiUrl = FLOWISE_API_URL;
    this.apiKey = FLOWISE_API_KEY;
  }

  /**
   * Send a chat message to Flowise API
   * @param {string} message - The user's message
   * @param {string} productId - Optional product ID for context
   * @param {string} productName - Optional product name for context
   * @param {string} productCategory - Optional product category for context
   * @returns {Promise<Object>} - The API response
   */
  async sendMessage(message, productId = null, productName = null, productCategory = null) {
    try {
      // Add user message to history before making API call
      this.addUserMessageToHistory(message);

      const history = this.getChatHistory();

      // Add product context to the message if provided
      let contextualMessage = message;
      if (productId) {
        contextualMessage = `The user is viewing product ${productId}${productName ? ` (${productName})` : ''}${productCategory ? ` in the ${productCategory} category` : ''}. ${message}`;
      }

      // Add conversation history context to the message since Flowise doesn't use the history parameter properly
      if (history.length > 0) {
        const historyContext = history.map(msg => `${msg.role === 'userMessage' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
        contextualMessage = `Previous conversation:\n${historyContext}\n\nCurrent question: ${contextualMessage}`;
      }
      console.log('Sending history to API:', history);
      console.log('History length:', history.length);
      console.log('Contextual message:', contextualMessage);
      console.log('Full request body:', JSON.stringify({
        question: contextualMessage,
        history: history,
      }, null, 2));
      
      const response = await fetch(`${this.apiUrl}/api/v1/prediction/${CHATFLOW_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          question: contextualMessage,
          history: history,
        }),
      });

      let responseText;
      let data;
      
      try {
        responseText = await response.text();
        console.log('Raw API Response:', responseText);
        
        if (!response.ok) {
          console.error('API Error Response:', responseText);
          throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);
        }
        
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('JSON Parse Error:', jsonError);
          console.error('Response Text:', responseText);
          throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 200)}...`);
        }
      } catch (error) {
        console.error('Error processing response:', error);
        throw error;
      }
      
      // Save the AI response to history
      this.saveResponseToHistory(data.answer || data.text || data.response);
      
      return data;
    } catch (error) {
      console.error('Error sending message to Flowise:', error);
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  }

  /**
   * Get chat history from localStorage for API calls
   * @returns {Array} - Array of chat messages in Flowise format
   */
  getChatHistory() {
    try {
      const history = localStorage.getItem('chatHistory');
      if (!history) return [];
      
      const parsedHistory = JSON.parse(history);
      // Convert to Flowise format: { role: "userMessage" | "apiMessage", content: string }
      return parsedHistory.map(msg => ({
        role: msg.type === 'user' ? 'userMessage' : 'apiMessage',
        content: msg.message
      }));
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  /**
   * Get chat history from localStorage for display
   * @returns {Array} - Array of chat messages in internal format
   */
  getDisplayHistory() {
    try {
      const history = localStorage.getItem('chatHistory');
      if (!history) return [];
      
      const parsedHistory = JSON.parse(history);
      return parsedHistory;
    } catch (error) {
      console.error('Error loading display history:', error);
      return [];
    }
  }

  /**
   * Add user message to history before API call
   * @param {string} message - User message
   */
  addUserMessageToHistory(message) {
    try {
      const rawHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      console.log('Before adding user message, history length:', rawHistory.length);
      
      // Add user message to history
      rawHistory.push({
        type: 'user',
        message: message,
        timestamp: new Date().toISOString()
      });

      console.log('After adding user message, history length:', rawHistory.length);
      localStorage.setItem('chatHistory', JSON.stringify(rawHistory));
    } catch (error) {
      console.error('Error adding user message to history:', error);
    }
  }

  /**
   * Save AI response to chat history
   * @param {string} response - AI response
   */
  saveResponseToHistory(response) {
    try {
      // Get the raw history from localStorage (not the converted format)
      const rawHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      
      // Add only the AI response (user message already added in addUserMessageToHistory)
      rawHistory.push({
        type: 'assistant',
        message: response,
        timestamp: new Date().toISOString()
      });

      // Keep only last 20 messages (10 exchanges) to avoid localStorage bloat
      if (rawHistory.length > 20) {
        rawHistory.splice(0, rawHistory.length - 20);
      }

      localStorage.setItem('chatHistory', JSON.stringify(rawHistory));
    } catch (error) {
      console.error('Error saving response to chat history:', error);
    }
  }

  /**
   * Clear chat history
   */
  clearHistory() {
    try {
      localStorage.removeItem('chatHistory');
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }

  /**
   * Check if API is properly configured
   * @returns {boolean} - True if API is configured
   */
  isConfigured() {
    return !!(this.apiUrl && this.apiKey && this.apiUrl !== 'https://your-flowise-instance.com/api/v1');
  }
}

// Create and export a singleton instance
const flowiseApi = new FlowiseApiService();
export default flowiseApi;