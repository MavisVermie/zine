import { useProductContext } from '../contexts/ProductContext';

const AIAssistantButton = () => {
  const { currentProduct, openAIAssistant } = useProductContext();

  // Only show the button when viewing a product
  if (!currentProduct) return null;

  return (
    <button
      onClick={openAIAssistant}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue to-fuchsia text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 group"
      title="Ask AI about this product"
    >
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="hidden group-hover:block text-sm font-medium">
          Ask AI
        </span>
      </div>
    </button>
  );
};

export default AIAssistantButton;
