# Flowise AI Chat Assistant Setup

This project includes an AI chat assistant that integrates with Flowise AI to provide intelligent responses about your products.

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the root directory with your Flowise API credentials:

```env
VITE_FLOWISE_API_URL=https://your-flowise-instance.com/api/v1
VITE_FLOWISE_API_KEY=your-flowise-api-key-here
```

### 2. Flowise AI Setup

1. **Deploy Flowise AI**:
   - Deploy Flowise AI on your preferred platform (Vercel, Railway, or self-hosted)
   - Note down your API URL and API key

2. **Upload Product Data**:
   - The product data from your JSON/JSONL files has already been processed and is available in `src/data/products.json`
   - Upload this data to your Flowise document store or create a knowledge base

3. **Create a Chat Flow**:
   - In Flowise, create a new chat flow
   - Add a document store node with your product data
   - Connect it to a language model (OpenAI, Anthropic, etc.)
   - Configure the chat endpoint

### 3. Features

- **Context-Aware Chat**: When a user is viewing a specific product (e.g., `/product/CPU-001`), the chat automatically adds context like "The user is viewing product CPU-001 (AMD Ryzen 9 9950X3D) in the Processors category."

- **Persistent Chat History**: Chat history is stored in localStorage and persists across sessions

- **Real-time Responses**: The chat provides real-time responses from your Flowise AI instance

- **Product Integration**: The chat can answer questions about specific products, categories, and general hardware recommendations

### 4. Product Data Structure

The merged product data includes:
- **Processors**: 20 AMD and Intel CPUs
- **Graphics Cards**: 20 NVIDIA and AMD GPUs  
- **Memory**: 20 DDR4 and DDR5 RAM kits
- **Storage**: 20 SSDs and HDDs
- **Power Supplies**: 20 PSUs of various wattages
- **Motherboards**: 20 Intel and AMD motherboards
- **Cooling**: 20 CPU coolers and AIO liquid coolers
- **Cases**: 20 PC cases of various sizes

### 5. Testing the Chat

1. Start the development server: `npm run dev`
2. Navigate to any product page (e.g., `/product/CPU-001`)
3. Click the chat button in the bottom-right corner
4. Ask questions like:
   - "What are the specifications of this CPU?"
   - "Is this compatible with my motherboard?"
   - "What's the warranty on this product?"
   - "Can you recommend a cooler for this CPU?"

### 6. Customization

You can customize the chat behavior by modifying:
- `src/services/flowiseApi.js` - API integration logic
- `src/components/ChatBot.jsx` - UI and chat interface
- Context detection logic in the ChatBot component

### 7. Troubleshooting

- **API Not Configured**: Make sure your environment variables are set correctly
- **No Response**: Check your Flowise API URL and key
- **Context Not Working**: Ensure the product ID format matches between your routes and the context detection logic

## Support

For issues with the chat integration, check:
1. Browser console for error messages
2. Network tab for API request failures
3. Flowise AI logs for processing errors
