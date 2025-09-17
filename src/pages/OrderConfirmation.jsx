import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load order data
    const loadOrder = async () => {
      try {
        // First try to load from localStorage
        const orderData = localStorage.getItem(`order_${orderId}`);
        
        if (orderData) {
          setOrder(JSON.parse(orderData));
        } else {
          // If not found in localStorage, try to fetch from backend
          const response = await fetch(`/api/orders/${orderId}`);
          if (response.ok) {
            const orderData = await response.json();
            setOrder(orderData);
          }
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Not Found</h1>
          <p className="text-gray-600 mb-4" style={{fontFamily: 'Ubuntu, sans-serif'}}>We couldn't find the order you're looking for.</p>
          <Link 
            to="/" 
            className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            style={{fontFamily: 'Ubuntu, sans-serif'}}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 text-green-500 mx-auto mb-4">
            <svg className="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Confirmed!</h1>
          <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order ID:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Date:</span>
                    <span style={{fontFamily: 'Ubuntu, sans-serif'}}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      order.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`} style={{fontFamily: 'Ubuntu, sans-serif'}}>
                      {order.status === 'confirmed' ? 'Confirmed' : 'Processing'}
                    </span>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Payment ID:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{order.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'Ubuntu, sans-serif'}}>Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Payment Method:</span>
                    <span className="flex items-center" style={{fontFamily: 'Ubuntu, sans-serif'}}>
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                      {order.paymentMethod || 'Credit Card'} ****{order.last4 || '****'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Total Amount:</span>
                    <span className="text-lg font-semibold text-red-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>
                      {order.totalPrice?.toFixed(2)} JOD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center" style={{fontFamily: 'Ubuntu, sans-serif'}}>
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Products Ordered
            </h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {order.products?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>{product.name}</h3>
                      <p className="text-sm text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Quantity: {product.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>
                      {(product.price * (product.quantity || 1)).toFixed(2)} JOD
                    </p>
                    <p className="text-sm text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>{product.price} JOD each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white" style={{fontFamily: 'Ubuntu, sans-serif'}}>What's Next?</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>Order Processing</h3>
                  <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>We're preparing your order for shipment. This usually takes 1-2 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>Shipping Notification</h3>
                  <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>You'll receive an email with tracking information once your order ships.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>Delivery</h3>
                  <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Your order will be delivered within 3-5 business days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-800 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white" style={{fontFamily: 'Ubuntu, sans-serif'}}>Need Help?</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>Phone Support</h3>
                  <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>+962 6 123 4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900" style={{fontFamily: 'Ubuntu, sans-serif'}}>Visit Our Store</h3>
                  <p className="text-gray-600" style={{fontFamily: 'Ubuntu, sans-serif'}}>Amman, Jordan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-gray-800 to-red-600 hover:from-gray-700 hover:to-red-700 text-white px-8 py-3 rounded-lg transition-colors text-center font-semibold"
            style={{fontFamily: 'Ubuntu, sans-serif'}}
          >
            Continue Shopping
          </Link>
          
          <Link 
            to="/cart" 
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold"
            style={{fontFamily: 'Ubuntu, sans-serif'}}
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
