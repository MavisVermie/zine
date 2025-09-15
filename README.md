# Zinc Hardware - E-commerce Website

A modern, responsive e-commerce website inspired by Newegg, built with React and Tailwind CSS. Zinc Hardware specializes in computer hardware and electronics with a clean, professional design.

## 🚀 Features

### Core Functionality
- **Product Browsing**: Browse products by category with filtering and sorting
- **Product Details**: Detailed product pages with specifications and images
- **Shopping Cart**: Add/remove items, adjust quantities, persistent cart storage
- **Checkout Process**: Complete checkout flow with form validation
- **Search**: Full-text search across products with filtering options
- **Responsive Design**: Mobile-first design that works on all devices

### Design & Branding
- **Zinc Hardware Branding**: Custom logo and color scheme
- **Color Palette**: White, Fuchsia (#FF2D9C), and Blue (#0B66FF)
- **Newegg-Inspired Layout**: Familiar e-commerce structure and navigation
- **Professional UI**: Clean, modern interface with smooth animations

### Product Categories
- Graphics Cards
- Processors
- Memory (RAM)
- Storage (SSDs)
- Motherboards
- Power Supplies
- Cooling Systems
- PC Cases
- Peripherals
- Audio Equipment
- Monitors
- Keyboards

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks + localStorage
- **Icons**: Custom SVG icons
- **Build Tool**: Vite

## 📁 Project Structure

```
zinc-hardware/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation and search
│   │   ├── ProductCard.jsx     # Product display component
│   │   └── Icons.jsx           # Custom SVG icons
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with featured products
│   │   ├── Category.jsx        # Category browsing page
│   │   ├── ProductDetail.jsx   # Individual product page
│   │   ├── Cart.jsx            # Shopping cart page
│   │   ├── Checkout.jsx        # Checkout process
│   │   └── Search.jsx          # Search results page
│   ├── data/
│   │   └── products.json       # Sample product data
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles and Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zinc-hardware
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: #0B66FF - Used for buttons, links, and accents
- **Fuchsia**: #FF2D9C - Used for secondary buttons and highlights
- **White**: #FFFFFF - Background and card colors
- **Gray Scale**: Various shades for text and borders

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Key UI Elements
- **Navigation Bar**: Sticky header with search and cart
- **Product Cards**: Consistent layout with images, specs, and pricing
- **Category Grid**: Visual category browsing
- **Cart Interface**: Quantity controls and price calculations
- **Checkout Forms**: Multi-step checkout process

## 📱 Pages Overview

### Home Page (`/`)
- Hero section with call-to-action buttons
- Category grid for easy browsing
- Featured products showcase
- Promotional sections (free shipping, support, warranty)

### Category Pages (`/category/:categoryName`)
- Filtered product listings
- Sort options (price, rating, name)
- Price range filtering
- Responsive product grid

### Product Detail (`/product/:id`)
- Large product images
- Detailed specifications table
- Add to cart functionality
- Related products section
- Customer reviews display

### Shopping Cart (`/cart`)
- Item management (quantity, remove)
- Price calculations with tax and shipping
- Order summary
- Proceed to checkout

### Checkout (`/checkout`)
- Contact information form
- Shipping address form
- Payment information form
- Order confirmation

### Search (`/search?q=query`)
- Full-text search across products
- Search result filtering
- Sort options
- No results handling

## 🛒 Shopping Features

### Cart Management
- **Add to Cart**: From product cards or detail pages
- **Quantity Control**: Increase/decrease item quantities
- **Remove Items**: Delete items from cart
- **Persistent Storage**: Cart saved in localStorage
- **Real-time Updates**: Cart count updates across pages

### Pricing & Calculations
- **Subtotal**: Sum of all items
- **Shipping**: Free on orders over $99, otherwise $9.99
- **Tax**: 8% calculated on subtotal
- **Total**: Final amount including all fees

### Checkout Process
- **Form Validation**: Required field checking
- **Order Confirmation**: Success page with order details
- **Cart Clearing**: Automatic cart clearing after order

## 🎯 Sample Data

The application includes realistic sample data with:
- 12 different hardware products
- Detailed specifications for each product
- Realistic pricing and ratings
- Product images (using Unsplash placeholders)
- Multiple categories and brands

## 🔧 Customization

### Adding New Products
Edit `src/data/products.json` to add new products:

```json
{
  "id": 13,
  "name": "Product Name",
  "category": "Category",
  "price": 299.99,
  "originalPrice": 349.99,
  "rating": 4.5,
  "reviews": 123,
  "image": "https://example.com/image.jpg",
  "inStock": true,
  "shipping": "Free shipping",
  "specs": {
    "Spec1": "Value1",
    "Spec2": "Value2"
  },
  "description": "Product description"
}
```

### Styling Customization
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for global styles
- Customize component styles in individual files

### Adding New Categories
1. Add category to the categories array in Header.jsx
2. Add products to the new category in products.json
3. Update routing if needed

## 🌟 Key Features Implemented

✅ **Responsive Design** - Works on all device sizes
✅ **Product Browsing** - Category and search functionality  
✅ **Shopping Cart** - Full cart management with localStorage
✅ **Checkout Process** - Complete checkout flow
✅ **Search Functionality** - Full-text search with filters
✅ **Professional UI** - Newegg-inspired design
✅ **Modern Stack** - React + Tailwind CSS + Vite
✅ **Performance** - Fast loading and smooth animations

## 🚀 Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@zinchardware.com or create an issue in the repository.

---

**Zinc Hardware** - Your trusted source for premium computer hardware and electronics.
