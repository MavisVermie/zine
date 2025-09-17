// Custom Purchase Tool for Flowise AI
// This tool handles the purchase process including credit card collection and order confirmation

class PurchaseTool {
  constructor() {
    this.toolName = 'purchase_tool';
    this.description = 'Handles product purchase process including credit card collection and order confirmation';
  }

  /**
   * Main function that Flowise will call
   * @param {Object} params - Parameters from Flowise
   * @returns {Object} - Response to send back to Flowise
   */
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
      console.error('Purchase tool error:', error);
      return {
        success: false,
        message: 'An error occurred during the purchase process. Please try again.',
        error: error.message
      };
    }
  }

  /**
   * Initiate purchase process
   * @param {Array} products - Array of products to purchase
   * @returns {Object} - Purchase initiation response
   */
  initiatePurchase(products) {
    if (!products || products.length === 0) {
      return {
        success: false,
        message: 'No products selected for purchase. Please add items to your cart first.',
        action: 'show_cart'
      };
    }

    // Calculate total price
    const totalPrice = products.reduce((sum, product) => {
      return sum + (product.price * (product.quantity || 1));
    }, 0);

    // Generate order ID
    const orderId = this.generateOrderId();

    // Store order data temporarily
    this.storeOrderData(orderId, {
      products,
      totalPrice,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    });

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

  /**
   * Collect payment information
   * @param {Object} orderData - Order data including payment info
   * @returns {Object} - Payment collection response
   */
  collectPayment(orderData) {
    const { orderId, paymentInfo } = orderData;
    
    // Validate payment information
    const validation = this.validatePaymentInfo(paymentInfo);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Please correct the following errors: ${validation.errors.join(', ')}`,
        action: 'show_payment_form',
        paymentForm: this.generatePaymentForm(orderId, orderData.totalPrice)
      };
    }

    // Process payment (in real implementation, this would call a payment processor)
    const paymentResult = this.processPayment(paymentInfo, orderData.totalPrice);
    
    if (paymentResult.success) {
      // Update order status
      this.updateOrderStatus(orderId, 'payment_completed', {
        paymentId: paymentResult.paymentId,
        paymentMethod: paymentInfo.cardType,
        last4: paymentInfo.cardNumber.slice(-4)
      });

      return {
        success: true,
        message: 'Payment processed successfully! Your order is being confirmed.',
        orderId,
        paymentId: paymentResult.paymentId,
        action: 'redirect_to_confirmation',
        redirectUrl: `/order-confirmation/${orderId}`
      };
    } else {
      return {
        success: false,
        message: `Payment failed: ${paymentResult.error}. Please try again with different payment information.`,
        action: 'show_payment_form',
        paymentForm: this.generatePaymentForm(orderId, orderData.totalPrice)
      };
    }
  }

  /**
   * Confirm order
   * @param {Object} orderData - Complete order data
   * @returns {Object} - Order confirmation response
   */
  confirmOrder(orderData) {
    const { orderId } = orderData;
    
    // Update order status to confirmed
    this.updateOrderStatus(orderId, 'confirmed', {
      confirmedAt: new Date().toISOString()
    });

    // Clear cart
    this.clearCart();

    return {
      success: true,
      message: 'Order confirmed successfully! Thank you for your purchase.',
      orderId,
      action: 'order_confirmed',
      redirectUrl: `/order-confirmation/${orderId}`
    };
  }

  /**
   * Show purchase options
   * @returns {Object} - Purchase options response
   */
  showPurchaseOptions() {
    return {
      success: true,
      message: 'I can help you purchase products! Here are your options:',
      options: [
        {
          type: 'single_product',
          description: 'Purchase a single product',
          action: 'select_product'
        },
        {
          type: 'pc_build',
          description: 'Purchase a complete PC build',
          action: 'select_pc_build'
        },
        {
          type: 'cart_items',
          description: 'Purchase items in your cart',
          action: 'purchase_cart'
        }
      ],
      action: 'show_options'
    };
  }

  /**
   * Generate payment form HTML
   * @param {string} orderId - Order ID
   * @param {number} totalPrice - Total price
   * @returns {string} - Payment form HTML
   */
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

          <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.3s ease;">
            Complete Purchase - ${totalPrice.toFixed(2)} JOD
          </button>
        </form>

        <div class="security-notice" style="margin-top: 15px; padding: 10px; background: #e8f4fd; border-radius: 5px; font-size: 14px; color: #666;">
          <strong>🔒 Secure Payment:</strong> Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
        </div>
      </div>

      <script>
        function handlePaymentSubmission(event, orderId) {
          event.preventDefault();
          
          const formData = new FormData(event.target);
          const paymentData = {
            orderId: orderId,
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            cardholderName: formData.get('cardholderName'),
            email: formData.get('email'),
            cardType: getCardType(formData.get('cardNumber'))
          };

          // Send payment data to Flowise
          sendPaymentToFlowise(paymentData);
        }

        function getCardType(cardNumber) {
          const number = cardNumber.replace(/\s/g, '');
          if (number.startsWith('4')) return 'Visa';
          if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
          if (number.startsWith('3')) return 'American Express';
          return 'Unknown';
        }

        function sendPaymentToFlowise(paymentData) {
          // This would be called by the chat interface
          if (window.flowisePurchaseCallback) {
            window.flowisePurchaseCallback(paymentData);
          }
        }
      </script>
    `;
  }

  /**
   * Validate payment information
   * @param {Object} paymentInfo - Payment information
   * @returns {Object} - Validation result
   */
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

  /**
   * Process payment (mock implementation)
   * @param {Object} paymentInfo - Payment information
   * @param {number} amount - Amount to charge
   * @returns {Object} - Payment result
   */
  processPayment(paymentInfo, amount) {
    // In a real implementation, this would call a payment processor like Stripe, PayPal, etc.
    // For now, we'll simulate a successful payment
    
    // Simulate processing delay
    const processingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() < 0.95) {
          resolve({
            success: true,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            transactionId: `txn_${Date.now()}`,
            amount: amount
          });
        } else {
          resolve({
            success: false,
            error: 'Payment declined by bank. Please try a different card.'
          });
        }
      }, processingTime);
    });
  }

  /**
   * Generate order ID
   * @returns {string} - Unique order ID
   */
  generateOrderId() {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  /**
   * Store order data temporarily
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Order data
   */
  storeOrderData(orderId, orderData) {
    // In a real implementation, this would store in a database
    // For now, we'll use localStorage
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '{}');
    orders[orderId] = orderData;
    localStorage.setItem('pendingOrders', JSON.stringify(orders));
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data to store
   */
  updateOrderStatus(orderId, status, additionalData = {}) {
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '{}');
    if (orders[orderId]) {
      orders[orderId].status = status;
      orders[orderId].updatedAt = new Date().toISOString();
      Object.assign(orders[orderId], additionalData);
      localStorage.setItem('pendingOrders', JSON.stringify(orders));
    }
  }

  /**
   * Clear cart
   */
  clearCart() {
    localStorage.removeItem('cart');
  }

  /**
   * Get order data
   * @param {string} orderId - Order ID
   * @returns {Object} - Order data
   */
  getOrderData(orderId) {
    const orders = JSON.parse(localStorage.getItem('pendingOrders') || '{}');
    return orders[orderId] || null;
  }
}

// Export for use in Flowise
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PurchaseTool;
} else if (typeof window !== 'undefined') {
  window.PurchaseTool = PurchaseTool;
}

// Create instance for Flowise
const purchaseTool = new PurchaseTool();

// Export the execute function for Flowise
if (typeof module !== 'undefined' && module.exports) {
  module.exports = purchaseTool.execute.bind(purchaseTool);
} else if (typeof window !== 'undefined') {
  window.purchaseToolExecute = purchaseTool.execute.bind(purchaseTool);
}
