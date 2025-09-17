import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PurchaseHandler = ({ onPurchaseComplete, onPurchaseError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up global callback for payment form submission
    window.flowisePurchaseCallback = handlePaymentSubmission;
    
    return () => {
      // Clean up global callback
      delete window.flowisePurchaseCallback;
    };
  }, []);

  const handlePaymentSubmission = async (paymentData) => {
    setIsProcessing(true);
    
    try {
      // Send payment data to Flowise
      const response = await sendPaymentToFlowise(paymentData);
      
      if (response.success) {
        // Payment successful, redirect to confirmation
        onPurchaseComplete?.(response);
        navigate(`/order-confirmation/${response.orderId}`);
      } else {
        // Payment failed
        onPurchaseError?.(response.error);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPurchaseError?.(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendPaymentToFlowise = async (paymentData) => {
    // Send payment data to Flowise via the existing API
    try {
      const response = await fetch('https://cloud.flowiseai.com/api/v1/prediction/30c97938-1c04-4822-998d-e00b368a8833', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'uQZ5hwTBiAQbpl_Il1K3UBypIRbgxBZ25vGsIHsYxDg',
        },
        body: JSON.stringify({
          question: `Process payment for order ${paymentData.orderId}`,
          history: [],
          toolParams: {
            action: 'collect_payment',
            orderData: paymentData
          }
        })
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      const result = await response.json();
      
      // Store order data in localStorage for the confirmation page
      if (result.success) {
        const orderData = {
          orderId: paymentData.orderId,
          status: 'confirmed',
          totalPrice: 0, // This would come from the tool response
          products: [], // This would come from the tool response
          paymentInfo: {
            cardType: paymentData.cardType,
            last4: paymentData.cardNumber.slice(-4)
          },
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(`order_${paymentData.orderId}`, JSON.stringify(orderData));
      }

      return result;
    } catch (error) {
      console.error('Error sending payment to Flowise:', error);
      throw error;
    }
  };

  return null; // This component doesn't render anything, it just handles the purchase flow
};

export default PurchaseHandler;
