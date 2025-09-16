import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './contexts/ProductContext';
import Header from './components/Header';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import AIAssistant from './components/AIAssistant';
import AIAssistantButton from './components/AIAssistantButton';

function App() {
  return (
    <Router>
      <ProductProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/CPU-:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
          <AIAssistantButton />
          <AIAssistant />
        </div>
      </ProductProvider>
    </Router>
  );
}

export default App;
