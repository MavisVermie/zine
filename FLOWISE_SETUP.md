# Flowise AI Integration Setup

This document explains how to set up the Flowise AI integration for your CPU product store.

## Prerequisites

1. A Flowise AI account at [cloud.flowiseai.com](https://cloud.flowiseai.com)
2. Your CPU product data (already configured in `src/data/products.json`)

## Setup Steps

### 1. Create a Flowise Flow

1. Go to [cloud.flowiseai.com](https://cloud.flowiseai.com)
2. Sign up or log in to your account
3. Create a new flow or use an existing one
4. Copy the flow ID from the URL (it looks like: `abc123def456`)

### 2. Configure Your Flowise Flow

Your flow should be configured to:
- Accept the `overrideConfig` parameter with product context variables
- Use the product context to provide relevant answers about specific CPUs

**Required Variables:**
- `product_id`: The CPU product ID (e.g., "CPU-001")
- `product_name`: The CPU name (e.g., "AMD Ryzen 9 9950X3D")
- `product_description`: The CPU description
- `product_specs`: The CPU specifications (cores, clock speeds, etc.)
- `product_price`: The CPU price

### 3. Update Configuration

1. Open `src/config/flowise.js`
2. Replace `YOUR_FLOW_ID` with your actual Flowise flow ID:

```javascript
export const FLOWISE_CONFIG = {
  FLOW_ID: 'your-actual-flow-id-here',
  // ... rest of config
};
```

### 4. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to a CPU product page (e.g., `/CPU-001`)
3. Click the floating AI assistant button
4. Ask questions like:
   - "What is the warranty on this product?"
   - "What are the specifications of this CPU?"
   - "How many cores does this processor have?"
   - "What is the TDP of this CPU?"

## How It Works

1. **Product Context Detection**: When a user visits a CPU product page (e.g., `/CPU-001`), the app automatically detects the current product
2. **AI Assistant Button**: A floating button appears on product pages, allowing users to ask questions
3. **Context-Aware Responses**: When users ask questions, the product context (ID, name, specs, price) is sent to Flowise along with their question
4. **Smart Responses**: Flowise uses the product context to provide accurate, product-specific answers

## Example API Request

When a user asks "What is the warranty on this product?" while viewing CPU-001, the app sends:

```json
{
  "question": "What is the warranty on this product?",
  "overrideConfig": {
    "vars": {
      "product_id": "CPU-001",
      "product_name": "AMD Ryzen 9 9950X3D",
      "product_description": "16 cores, 4.3–5.7 GHz, Zen 5, 170W TDP, iGPU: Radeon",
      "product_specs": {
        "Cores": "16",
        "Base Clock": "4.3 GHz",
        "Boost Clock": "5.7 GHz",
        "Microarchitecture": "Zen 5",
        "TDP": "170W",
        "iGPU": "Radeon",
        "Socket": "AM5"
      },
      "product_price": 663.95
    }
  }
}
```

## Troubleshooting

- **Flow ID not working**: Double-check that you've copied the correct flow ID from your Flowise dashboard
- **API errors**: Ensure your Flowise flow is published and accessible
- **No product context**: Verify that the product ID format matches (CPU-001, CPU-002, etc.)
- **CORS issues**: Make sure your Flowise instance allows requests from your domain

## Features

- ✅ Automatic product context detection
- ✅ Floating AI assistant button on product pages
- ✅ Context-aware responses using product data
- ✅ Real-time chat interface
- ✅ Error handling and loading states
- ✅ Responsive design
