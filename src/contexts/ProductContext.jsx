import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const location = useLocation();

  // Extract product ID from URL and set current product
  useEffect(() => {
    const path = location.pathname;
    console.log('Current path:', path);
    
    if (path.startsWith('/CPU-')) {
      // Extract the ID part after /CPU-
      const idPart = path.replace('/CPU-', '');
      // Construct the full product ID
      const productId = `CPU-${idPart.padStart(3, '0')}`;
      console.log('Extracted product ID:', productId);
      
      // Find the product in the data
      import('../data/products.json').then(module => {
        const productsData = module.default;
        const product = productsData.find(p => p.id === productId);
        console.log('Found product:', product);
        setCurrentProduct(product);
      });
    } else {
      setCurrentProduct(null);
    }
  }, [location.pathname]);

  const openAIAssistant = () => {
    setIsAIAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setIsAIAssistantOpen(false);
  };

  const sendToFlowise = async (message) => {
    try {
      const flowId = '30c97938-1c04-4822-998d-e00b368a8833';
      const apiUrl = `https://cloud.flowiseai.com/api/v1/prediction/${flowId}`;
      
      console.log('=== FLOWISE API CALL DEBUG ===');
      console.log('API URL:', apiUrl);
      console.log('User Message:', message);
      console.log('Current Product:', currentProduct);
      console.log('Product ID being sent:', currentProduct?.id);
      console.log('================================');
      
      // Send only the product ID since Flowise already has the database
      const productContext = {
        product_id: currentProduct?.id || 'none'
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          streaming: false,
          overrideConfig: {
            vars: productContext
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message to Flowise');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message to Flowise:', error);
      throw error;
    }
  };

  const value = {
    currentProduct,
    isAIAssistantOpen,
    openAIAssistant,
    closeAIAssistant,
    sendToFlowise
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
