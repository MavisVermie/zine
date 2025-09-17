import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, StarOutlineIcon } from './Icons';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to cart
    window.location.href = '/cart';
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const incrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOutlineIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JOD'
    }).format(price);
  };

  const getProductLink = (productId) => {
    return `/product/${productId}`;
  };

  const getDiscountPercentage = () => {
    if (product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="product-layout swiper-slide has-extra-button">
      <div className="product-thumb">
        {/* Product Image */}
        <div className="image relative">
          <div className="quickview-button absolute top-2 right-2 z-10">
            <button className="btn btn-quickview text-xs px-2 py-1 bg-white text-gray-700 hover:bg-red-600 hover:text-white transition-colors">
              <span className="btn-text">Quickview</span>
            </button>
          </div>
          
          <Link to={getProductLink(product.id)} className="product-img has-second-image block">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="img-responsive img-first w-full h-48 object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
                }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="img-responsive img-second w-full h-48 object-contain absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';
                }}
              />
            </div>
          </Link>

          {/* Product Labels */}
          <div className="product-labels absolute top-2 left-2">
            {getDiscountPercentage() > 0 && (
              <span className="product-label product-label-233 product-label-default">
                <b>-{getDiscountPercentage()}%</b>
              </span>
            )}
            {!product.inStock && (
              <span className="product-label product-label-30 product-label-diagonal">
                <b>Out Of Stock</b>
              </span>
            )}
          </div>
        </div>

        {/* Product Caption */}
        <div className="caption p-4">
          {/* Stats */}
          <div className="stats text-xs text-gray-600 mb-2">
            <span className="stat-1 block">
              <span className="stats-label font-medium">Brand:</span> 
              <span className="ml-1">{product.brand || 'Unknown'}</span>
            </span>
            <span className="stat-2 block">
              <span className="stats-label font-medium">Model:</span> 
              <span className="ml-1">{product.model || 'N/A'}</span>
            </span>
          </div>

          {/* Product Name */}
          <div className="name mb-2">
            <Link 
              to={getProductLink(product.id)}
              className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
          </div>

          {/* Price */}
          <div className="price mb-2">
            <div className="flex items-center space-x-2">
              <span className="price-new text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="price-old text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="price-tax text-xs text-gray-600">
              Ex Tax: {formatPrice(product.price)}
            </span>
          </div>

          {/* Rating */}
          <div className="rating mb-3">
            <div className="rating-stars flex items-center">
              {renderStars(product.rating)}
              <span className="ml-2 text-xs text-gray-600">({product.reviews})</span>
            </div>
          </div>

          {/* Buttons Wrapper */}
          <div className="buttons-wrapper">
            <div className="button-group">
              <div className="cart-group flex items-center space-x-2 mb-2">
                <div className="stepper flex items-center border border-gray-300 rounded-sm">
                  <input
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="form-control w-12 h-8 text-center border-0 focus:outline-none"
                    style={{fontSize: '12px'}}
                  />
                  <input type="hidden" name="product_id" value={product.id} />
                  <div className="flex flex-col">
                    <button
                      onClick={incrementQuantity}
                      className="w-4 h-4 flex items-center justify-center hover:bg-gray-100"
                      style={{fontSize: '10px'}}
                    >
                      <i className="fa fa-angle-up"></i>
                    </button>
                    <button
                      onClick={decrementQuantity}
                      className="w-4 h-4 flex items-center justify-center hover:bg-gray-100"
                      style={{fontSize: '10px'}}
                    >
                      <i className="fa fa-angle-down"></i>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn btn-cart btn-primary text-xs px-3 py-1 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <span className="btn-text">Add to Cart</span>
                </button>
              </div>
              
              <div className="wish-group flex space-x-1 mb-2">
                <button className="btn btn-wishlist text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors">
                  <span className="btn-text">Wish List</span>
                </button>
                <button className="btn btn-compare text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors">
                  <span className="btn-text">Compare</span>
                </button>
              </div>
            </div>

            <div className="extra-group">
              <div className="flex space-x-1">
                <button
                  onClick={handleBuyNow}
                  className="btn btn-extra btn-extra-46 text-xs px-2 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <span className="btn-text">Buy Now</span>
                </button>
                <button className="btn btn-extra btn-extra-93 text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition-colors">
                  <span className="btn-text">Ask Question</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
