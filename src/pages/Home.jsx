import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import ChatBot from '../components/ChatBot';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Get featured products (top rated products)
    const featured = productsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 12);
    setFeaturedProducts(featured);

    // Get unique categories
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JOD'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section 
        className="relative text-white py-32"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBjJTIwYnVpbGR8ZW58MHx8MHx8fDA%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10" style={{maxWidth: '1400px'}}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{fontFamily: 'Oswald, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            NUMBER ONE STORE
          </h1>
          <p className="text-2xl md:text-3xl mb-8 opacity-95" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
            Jordan's largest online store for Computer Hardware, Gaming PC & Accessories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/category/graphics-cards"
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Shop Graphics Cards
            </Link>
            <Link
              to="/category/processors"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Shop Processors
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4" style={{maxWidth: '1400px'}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="relative h-40 rounded-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundImage: `url('https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold text-2xl" style={{fontFamily: 'Oswald, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Gaming Accessories</span>
              </div>
            </div>
            <div 
              className="relative h-40 rounded-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundImage: `url('https://ms.codes/cdn/shop/articles/8a6c2e45cfb9e32859e9e7fa80350ad1.jpg?v=1707848484')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-bold text-2xl" style={{fontFamily: 'Oswald, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Computer Components</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8" style={{maxWidth: '1400px'}}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-50 p-6 rounded-sm border border-gray-200">
              <h3 className="title mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block py-2 px-3 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-sm transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brand Logos */}
            <div className="bg-white p-6 rounded-sm border border-gray-200 mt-6">
              <h3 className="title mb-4">Featured Brands</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 hover:bg-gray-50 rounded-sm transition-colors">
                  <img 
                    src="https://numberonestore.net/image/cache/catalog/brand/nvidia-100x50.png" 
                    alt="NVIDIA" 
                    className="h-8 mx-auto"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <div className="text-center p-2 hover:bg-gray-50 rounded-sm transition-colors">
                  <img 
                    src="https://numberonestore.net/image/cache/catalog/brand/amd-100x50.png" 
                    alt="AMD" 
                    className="h-8 mx-auto"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <div className="text-center p-2 hover:bg-gray-50 rounded-sm transition-colors">
                  <img 
                    src="https://numberonestore.net/image/cache/catalog/brand/intel-100x50.png" 
                    alt="Intel" 
                    className="h-8 mx-auto"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <div className="text-center p-2 hover:bg-gray-50 rounded-sm transition-colors">
                  <img 
                    src="https://numberonestore.net/image/cache/catalog/brand/msi-100x50.png" 
                    alt="MSI" 
                    className="h-8 mx-auto"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Featured Products Section */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Oswald, sans-serif'}}>
                  Featured Products
                </h2>
                <Link
                  to="/search"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  View All Products →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Deals Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{fontFamily: 'Oswald, sans-serif'}}>
                Today's Best Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  className="relative text-white rounded-sm p-6 text-center overflow-hidden"
                  style={{
                    backgroundImage: `url('https://numberonestore.net/image/cache/catalog/deals/deal-1-400x200.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">Free Shipping</h3>
                    <p className="text-sm mb-4">On orders over $99</p>
                    <Link
                      to="/search"
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
                
                <div 
                  className="relative text-white rounded-sm p-6 text-center overflow-hidden"
                  style={{
                    backgroundImage: `url('https://numberonestore.net/image/cache/catalog/deals/deal-2-400x200.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">Expert Support</h3>
                    <p className="text-sm mb-4">24/7 technical assistance</p>
                    <Link
                      to="/"
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Get Help
                    </Link>
                  </div>
                </div>
                
                <div 
                  className="relative text-white rounded-sm p-6 text-center overflow-hidden"
                  style={{
                    backgroundImage: `url('https://numberonestore.net/image/cache/catalog/deals/deal-3-400x200.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-90"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">Warranty</h3>
                    <p className="text-sm mb-4">Extended warranty options</p>
                    <Link
                      to="/"
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section 
        className="py-16 text-white relative"
        style={{
          backgroundImage: `url('https://numberonestore.net/image/cache/catalog/newsletter/newsletter-bg-1920x400.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 text-center relative z-10" style={{maxWidth: '1400px'}}>
          <h2 className="text-4xl font-bold mb-4" style={{fontFamily: 'Oswald, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Stay Updated with Number One Store
          </h2>
          <p className="text-xl mb-8 opacity-95" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
            Get the latest deals, product launches, and tech news delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1 text-gray-900"
            />
            <button className="btn-secondary hover:scale-105 transition-transform">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      
      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Home;
