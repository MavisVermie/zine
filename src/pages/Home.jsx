import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Get featured products (top rated products)
    const featured = productsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
    setFeaturedProducts(featured);

    // Get unique categories
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    setCategories(uniqueCategories);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue to-fuchsia text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Zinc Hardware
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your trusted source for premium computer hardware and electronics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/category/graphics-cards"
              className="bg-white text-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Graphics Cards
            </Link>
            <Link
              to="/category/processors"
              className="bg-fuchsia text-white px-8 py-3 rounded-lg font-semibold hover:bg-fuchsia-700 transition-colors"
            >
              Shop Processors
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-6 text-center transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue to-fuchsia rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {category.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link
              to="/search"
              className="text-blue hover:text-blue-700 font-semibold"
            >
              View All Products →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Today's Best Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue to-blue-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Free Shipping</h3>
              <p className="text-lg mb-4">On orders over $99</p>
              <Link
                to="/search"
                className="bg-white text-blue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-fuchsia to-fuchsia-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Expert Support</h3>
              <p className="text-lg mb-4">24/7 technical assistance</p>
              <Link
                to="/"
                className="bg-white text-fuchsia px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Help
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Warranty</h3>
              <p className="text-lg mb-4">Extended warranty options</p>
              <Link
                to="/"
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Zinc Hardware
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest deals, product launches, and tech news delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue"
            />
            <button className="bg-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
