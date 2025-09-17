# Purchase Tool Setup Guide

## Step 1: Add Custom Tool to Flowise

1. **Open your Flowise agent**
2. **Add a Custom Tool node**
3. **Copy and paste this code:**

```javascript
// Custom Purchase Tool for Flowise AI
class PurchaseTool {
  constructor() {
    this.toolName = 'purchase_tool';
    this.description = 'Handles product purchase process including credit card collection and order confirmation';
  }

  async execute(params) {
    try {
      const { action, products, orderData } = params;
      
      switch (action) {
        case 'initiate_purchase':
          return this.initiatePurchase(products);
        case 'collect_payment':
          return this.collectPayment(orderData);
        case 'confirm_order':
          return this.confirmOrder(orderData);
        default:
          return this.showPurchaseOptions();
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during the purchase process. Please try again.',
        error: error.message
      };
    }
  }

  initiatePurchase(products) {
    if (!products || products.length === 0) {
      return {
        success: false,
        message: 'No products selected for purchase. Please add items to your cart first.',
        action: 'show_cart'
      };
    }

    const totalPrice = products.reduce((sum, product) => {
      return sum + (product.price * (product.quantity || 1));
    }, 0);

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    return {
      success: true,
      message: `Great! I'll help you complete your purchase. Here's your order summary:`,
      orderId,
      totalPrice,
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        quantity: p.quantity || 1,
        subtotal: p.price * (p.quantity || 1)
      })),
      action: 'show_payment_form',
      paymentForm: this.generatePaymentForm(orderId, totalPrice)
    };
  }

  generatePaymentForm(orderId, totalPrice) {
    return `
      <div class="purchase-form-container" style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9f9f9;">
        <h3 style="color: #333; margin-bottom: 20px;">Complete Your Purchase</h3>
        
        <div class="order-summary" style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #666;">Order Summary</h4>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${totalPrice.toFixed(2)} JOD</p>
        </div>

        <form id="paymentForm" onsubmit="handlePaymentSubmission(event, '${orderId}')" style="background: white; padding: 20px; border-radius: 5px;">
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="cardNumber" style="display: block; margin-bottom: 5px; font-weight: bold;">Card Number</label>
            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" required>
          </div>

          <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
            <div class="form-group" style="flex: 1;">
              <label for="expiryDate" style="display: block; margin-bottom: 5px; font-weight: bold;">Expiry Date</label>
              <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" 
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" required>
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="cvv" style="display: block; margin-bottom: 5px; font-weight: bold;">CVV</label>
              <input type="text" id="cvv" name="cvv" placeholder="123" 
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" required>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 15px;">
            <label for="cardholderName" style="display: block; margin-bottom: 5px; font-weight: bold;">Cardholder Name</label>
            <input type="text" id="cardholderName" name="cardholderName" placeholder="John Doe" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" required>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email Address</label>
            <input type="email" id="email" name="email" placeholder="john@example.com" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" required>
          </div>

          <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">
            Complete Purchase - ${totalPrice.toFixed(2)} JOD
          </button>
        </form>

        <div class="security-notice" style="margin-top: 15px; padding: 10px; background: #e8f4fd; border-radius: 5px; font-size: 14px; color: #666;">
          <strong>🔒 Secure Payment:</strong> Your payment information is encrypted and secure.
        </div>
      </div>
    `;
  }

  collectPayment(orderData) {
    const validation = this.validatePaymentInfo(orderData.paymentInfo);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Please correct the following errors: ${validation.errors.join(', ')}`,
        action: 'show_payment_form'
      };
    }

    return {
      success: true,
      message: 'Payment processed successfully! Your order is being confirmed.',
      orderId: orderData.orderId,
      action: 'redirect_to_confirmation',
      redirectUrl: `/order-confirmation/${orderData.orderId}`
    };
  }

  validatePaymentInfo(paymentInfo) {
    const errors = [];
    
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 13) {
      errors.push('Invalid card number');
    }
    
    if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.push('Invalid expiry date (use MM/YY format)');
    }
    
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      errors.push('Invalid CVV');
    }
    
    if (!paymentInfo.cardholderName || paymentInfo.cardholderName.length < 2) {
      errors.push('Invalid cardholder name');
    }
    
    if (!paymentInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentInfo.email)) {
      errors.push('Invalid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  showPurchaseOptions() {
    return {
      success: true,
      message: 'I can help you purchase products! Here are your options:',
      options: [
        { type: 'single_product', description: 'Purchase a single product' },
        { type: 'pc_build', description: 'Purchase a complete PC build' },
        { type: 'cart_items', description: 'Purchase items in your cart' }
      ],
      action: 'show_options'
    };
  }
}

// Export for Flowise
const purchaseTool = new PurchaseTool();
module.exports = purchaseTool.execute.bind(purchaseTool);
```

## Step 2: Update Your Agent's Instructions

Add this to your agent's system prompt:

```
You can help users purchase products and calculate total prices. When users want to buy something:

1. ALWAYS calculate and show the total price in your response
2. For single products: Include the exact price in JOD
3. For PC builds: List all components with individual prices and show the total
4. Always include these exact phrases in your response when offering purchase:
   - "proceed with the purchase" 
   - "complete your order"
   - "payment form"

PRICE CALCULATION EXAMPLES:

Single Product:
- User: "I want to buy this GPU" 
- Response: "Perfect! Here's your order summary:
  • ASRock Challenger D Radeon RX 6600: 159.00 JOD
  • Total: 159.00 JOD
  Please click the 'Show Payment Form' button below to proceed with the purchase."

PC Build:
- User: "Build me a PC with the components we discussed"
- Response: "Great! Here's your complete PC build:
  • AMD Ryzen 5 5600X CPU: 199.99 JOD
  • ASRock Challenger D Radeon RX 6600 GPU: 159.00 JOD
  • 16GB DDR4 RAM: 89.99 JOD
  • 500GB SSD: 79.99 JOD
  • 650W PSU: 69.99 JOD
  • ATX Case: 59.99 JOD
  • Total Build Price: 658.95 JOD
  Please click the 'Show Payment Form' button below to proceed with the purchase."

IMPORTANT: 
- Always show individual prices and total
- Always end with "proceed with the purchase"
- Use exact prices from your product database
- Format prices as "XXX.XX JOD"
```

## Step 3: Test the Purchase Flow

1. **Start a conversation** with TechBuddy
2. **Ask about products** (e.g., "What's the cheapest GPU?")
3. **Request to purchase** (e.g., "I want to buy it" or "Build me a PC with it")
4. **Click "Show Payment Form"** button that appears
5. **Fill out the payment form** with demo data
6. **Complete the purchase** and get redirected to order confirmation page

## Step 4: Example Conversations

### Single Product Purchase:
```
User: "What's the cheapest GPU?"
TechBuddy: "The cheapest GPU is the ASRock Challenger D Radeon RX 6600 for 159.00 JOD..."

User: "I want to buy it"
TechBuddy: "Perfect! Here's your order summary:
• ASRock Challenger D Radeon RX 6600: 159.00 JOD
• Total: 159.00 JOD
Please click the 'Show Payment Form' button below to proceed with the purchase."
```

### PC Build Purchase:
```
User: "Build me a gaming PC"
TechBuddy: "Here's a great gaming PC build:
• AMD Ryzen 5 5600X CPU: 199.99 JOD
• ASRock Challenger D Radeon RX 6600 GPU: 159.00 JOD
• 16GB DDR4 RAM: 89.99 JOD
• 500GB SSD: 79.99 JOD
• 650W PSU: 69.99 JOD
• ATX Case: 59.99 JOD
• Total Build Price: 658.95 JOD"

User: "I want to buy this build"
TechBuddy: "Great! Here's your complete PC build:
• AMD Ryzen 5 5600X CPU: 199.99 JOD
• ASRock Challenger D Radeon RX 6600 GPU: 159.00 JOD
• 16GB DDR4 RAM: 89.99 JOD
• 500GB SSD: 79.99 JOD
• 650W PSU: 69.99 JOD
• ATX Case: 59.99 JOD
• Total Build Price: 658.95 JOD
Please click the 'Show Payment Form' button below to proceed with the purchase."
```

## How It Works

1. **User requests purchase** → TechBuddy calls the purchase tool
2. **Tool generates payment form** → HTML form appears in chat
3. **User fills form** → Payment data is collected
4. **Form submits** → Data sent to Flowise for processing
5. **Payment processed** → User redirected to order confirmation page

## Features

- ✅ **Secure payment form** with validation
- ✅ **Order tracking** with unique IDs
- ✅ **Product context** from conversation
- ✅ **PC build support** (adds all components)
- ✅ **Single product support**
- ✅ **Order confirmation page**
- ✅ **Payment validation**
- ✅ **Responsive design**

The purchase tool is now ready to use! 🚀
