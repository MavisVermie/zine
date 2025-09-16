// Flowise AI Configuration
export const FLOWISE_CONFIG = {
  // Replace with your actual Flowise flow ID
  FLOW_ID: '30c97938-1c04-4822-998d-e00b368a8833',
  
  // Flowise API endpoint
  API_URL: 'https://cloud.flowiseai.com/api/v1/prediction',
  
  // Get the full API URL
  getApiUrl: function() {
    return `${this.API_URL}/${this.FLOW_ID}`;
  }
};

// Instructions for setting up Flowise:
// 1. Go to https://cloud.flowiseai.com
// 2. Create a new flow or use an existing one
// 3. Copy the flow ID from the URL or flow settings
// 4. Replace 'YOUR_FLOW_ID' above with your actual flow ID
// 5. Make sure your flow is configured to accept the product context variables:
//    - product_id
//    - product_name
//    - product_description
//    - product_specs
//    - product_price
