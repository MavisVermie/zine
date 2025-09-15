import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    // Perform search
    const results = productsData.filter(product => {
      const searchTerms = query.toLowerCase().split(' ');
      
      // Search in product name, category, and specs
      const searchableText = [
        product.name,
        product.category,
        product.description,
        ...Object.values(product.specs)
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });

    setSearchResults(results);
    setLoading(false);
  }, [query]);

  const handleSort = (sortType) => {
    let sortedResults = [...searchResults];
    
    switch (sortType) {
      case 'price-low':
        sortedResults.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedResults.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'relevance':
        // Keep original search order for relevance
        break;
      default:
        break;
    }
    
    setSearchResults(sortedResults);
    setSortBy(sortType);
  };

  const handlePriceFilter = (priceRange) => {
    setFilterPrice(priceRange);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const getFilteredResults = () => {
    let filtered = [...searchResults];

    // Apply price filter
    if (filterPrice !== 'all') {
      filtered = filtered.filter(product => {
        switch (filterPrice) {
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
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    return filtered;
  };

  const getUniqueCategories = () => {
    return [...new Set(searchResults.map(product => product.category))];
  };

  const filteredResults = getFilteredResults();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Searching...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        {query ? (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600">
              {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Products
            </h1>
            <p className="text-gray-600">
              Use the search bar in the header to find products
            </p>
          </div>
        )}
      </div>

      {query && searchResults.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <div className="lg:w-64">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Category Filter */}
              {getUniqueCategories().length > 1 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={filterCategory === 'all'}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="mr-2 text-blue focus:ring-blue"
                      />
                      <span className="text-sm text-gray-700">All Categories</span>
                    </label>
                    {getUniqueCategories().map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filterCategory === category}
                          onChange={(e) => handleCategoryFilter(e.target.value)}
                          className="mr-2 text-blue focus:ring-blue"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
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

          {/* Search Results */}
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
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredResults.length} of {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Products Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No products found matching your filters
                </div>
                <button
                  onClick={() => {
                    setFilterPrice('all');
                    setFilterCategory('all');
                  }}
                  className="text-blue hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {query && searchResults.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No products found for "{query}"
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Try searching for:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Different keywords</li>
              <li>More general terms</li>
              <li>Product categories</li>
              <li>Brand names</li>
            </ul>
          </div>
          <Link
            to="/"
            className="inline-block mt-4 text-blue hover:text-blue-700 font-medium"
          >
            Browse all products
          </Link>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            Enter a search term to find products
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {[...new Set(productsData.map(p => p.category))].slice(0, 6).map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue to-fuchsia rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {category.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
