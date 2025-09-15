import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState('all');

  useEffect(() => {
    // Convert URL parameter back to category name
    const category = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Filter products by category
    const categoryProducts = productsData.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );

    setProducts(categoryProducts);
    setLoading(false);
  }, [categoryName]);

  const handleSort = (sortType) => {
    let sortedProducts = [...products];
    
    switch (sortType) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setProducts(sortedProducts);
    setSortBy(sortType);
  };

  const handlePriceFilter = (priceRange) => {
    setFilterPrice(priceRange);
    
    if (priceRange === 'all') {
      // Reset to all products in category
      const category = categoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const categoryProducts = productsData.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
      setProducts(categoryProducts);
    } else {
      // Apply price filter
      let filteredProducts = products.filter(product => {
        switch (priceRange) {
          case 'under-100':
            return product.price < 100;
          case '100-500':
            return product.price >= 100 && product.price <= 500;
          case '500-1000':
            return product.price >= 500 && product.price <= 1000;
          case 'over-1000':
            return product.price > 1000;
          default:
            return true;
        }
      });
      setProducts(filteredProducts);
    }
  };

  const formatCategoryName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue">Home</Link>
        <span>›</span>
        <span className="text-gray-900">{formatCategoryName(categoryName)}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {formatCategoryName(categoryName)}
        </h1>
        <p className="text-gray-600">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Filters */}
        <div className="lg:w-64">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'under-100', label: 'Under $100' },
                  { value: '100-500', label: '$100 - $500' },
                  { value: '500-1000', label: '$500 - $1,000' },
                  { value: 'over-1000', label: 'Over $1,000' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={filterPrice === option.value}
                      onChange={(e) => handlePriceFilter(e.target.value)}
                      className="mr-2 text-blue focus:ring-blue"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No products found in this category
              </div>
              <Link
                to="/"
                className="text-blue hover:text-blue-700 font-medium"
              >
                Browse all categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
