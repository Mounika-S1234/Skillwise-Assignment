# Inventory Management Backend

Node.js + Express + SQLite backend for the Product Inventory Management System.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

3. **Database:**
   - SQLite database (`inventory.db`) is automatically created on first run
   - Tables are initialized automatically

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/search?name=<query>` - Search products by name
- `GET /api/products/:id/history` - Get inventory history for a product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/import` - Import products from CSV
- `GET /api/products/export` - Export all products as CSV

## Default Port
Server runs on port 5000 (or PORT environment variable)
