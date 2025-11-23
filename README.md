# Status Form:

Please submit published link here:
https://skillwise-assignment-alpha.vercel.app/

Please submit GitHub link here:
https://github.com/Mounika-S1234/Skillwise-Assignment

Please submit screen recording drive link here:

1.https://www.loom.com/share/567b7ad65a584e908b09569238d82416
2.https://www.loom.com/share/be4b07e0a2364aceba005a147734a12c

# Product Inventory Management System

A full-stack application for managing product inventory with advanced features including search, filtering, inline editing, CSV import/export, and inventory change history tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd inventory-management

# Setup Backend
cd backend
npm install
npm run dev

# In a new terminal, setup Frontend
cd frontend
npm install
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 Project Structure

```
inventory-management/
├── backend/
│   ├── routes/
│   │   └── products.js           # Product API endpoints
│   ├── database.js               # SQLite database setup
│   ├── server.js                 # Express server
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductTable.js   # Main product table
│   │   │   ├── ProductFormModal.js
│   │   │   ├── InventoryHistorySidebar.js
│   │   │   └── Toast.js
│   │   ├── api.js                # API client
│   │   ├── App.js                # Main React component
│   │   ├── index.js
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── README.md
└── README.md (this file)
```

## 🎯 Features

### Frontend Features
✅ **Product Search & Filtering**
- Real-time search by product name
- Category-based filtering
- Add new products via modal form

✅ **Products Table**
- Responsive table with columns: Image | Name | Unit | Category | Brand | Stock | Status | Actions
- Color-coded stock status (Green for In Stock, Red for Out of Stock)
- Edit and Delete buttons

✅ **Inline Editing**
- Click Edit to turn row into editable fields
- Save or Cancel changes
- Automatic history tracking on save

✅ **Import/Export**
- Import products from CSV file
- Export all products as CSV
- Duplicate handling during import

✅ **Inventory History Sidebar**
- Click a product row to view history
- Shows: Date, Old Stock, New Stock, Changed By, Change Amount

### Backend Features
✅ **RESTful API**
- Get all products with pagination
- Search products by name
- Create, update, delete products
- Import products from CSV
- Export products as CSV
- Get inventory history for products

✅ **Inventory Tracking**
- Automatic history logging on stock changes
- Track: Old Stock, New Stock, Changed By, Timestamp

✅ **Data Validation**
- Product name uniqueness
- Stock validation (non-negative integer)
- Required field validation

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
  - Query params: `page`, `limit`, `sort`, `order`, `category`
- `GET /api/products/search?name=<query>` - Search products by name
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Import/Export
- `POST /api/products/import` - Import products from CSV
- `GET /api/products/export` - Download products as CSV

### History
- `GET /api/products/:id/history` - Get inventory history for a product

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL COLLATE NOCASE,
  unit TEXT,
  category TEXT,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Inventory History Table
```sql
CREATE TABLE inventory_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  old_stock INTEGER,
  new_stock INTEGER,
  changed_by TEXT DEFAULT 'admin',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
)
```

## 📝 CSV Import Format

Expected CSV columns:
```
name,unit,category,brand,stock,status,image
```

Example:
```csv
name,unit,category,brand,stock,status,image
Laptop,piece,Electronics,Dell,15,In Stock,https://example.com/laptop.jpg
Coffee Beans,kg,Food,Lavazza,50,In Stock,
Monitor,piece,Electronics,Samsung,0,Out of Stock,
```

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variable `PORT=5000`
4. Deploy

### Frontend Deployment (Netlify/Vercel)

1. Update `REACT_APP_API_URL` in `.env` to deployed backend URL
2. Push code to GitHub
3. Connect repository to Netlify/Vercel
4. Deploy

### Environment Variables

**Backend** (`.env`):
```
NODE_ENV=production
PORT=5000
```

**Frontend** (`.env`):
```
REACT_APP_API_URL=https://your-backend-url/api
```

## 🧪 Testing the Application

### Sample Data

You can use the provided `sample-products.csv` file to test import functionality.

### Manual Testing Steps

1. **Add a Product**
   - Click "+ Add New Product"
   - Fill in all fields
   - Click "Add Product"

2. **Search Products**
   - Type in the search bar
   - Results filter in real-time

3. **Filter by Category**
   - Select a category from the dropdown
   - Products are filtered instantly

4. **Edit a Product**
   - Click "Edit" button
   - Modify fields
   - Click "Save"

5. **Delete a Product**
   - Click "Delete" button
   - Confirm deletion

6. **View History**
   - Click any product row
   - Sidebar shows inventory change history

7. **Import CSV**
   - Click "Import" button
   - Select a CSV file
   - View results

8. **Export CSV**
   - Click "Export" button
   - Download file with all products

## 🛠️ Technology Stack

**Frontend:**
- React 18
- Axios for HTTP requests
- CSS3 for styling
- No external UI framework (custom CSS)

**Backend:**
- Node.js + Express
- SQLite3 for database
- Multer for file uploads
- CSV Parser for import
- Express Validator for validation
- CORS for cross-origin requests

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.6",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "csv-parser": "^3.0.0",
  "csv-writer": "^1.6.0",
  "express-validator": "^7.0.0",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1",
  "axios": "^1.6.2",
  "react-router-dom": "^6.20.0"
}
```

## 💡 Features Highlights

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Real-time search and filtering
- ✅ Inline editing with optimistic updates
- ✅ CSV import with duplicate detection
- ✅ CSV export with all products
- ✅ Inventory change history tracking
- ✅ User-friendly toast notifications
- ✅ Pagination support on backend
- ✅ Proper error handling
- ✅ Clean, maintainable code

## 🔒 Security Considerations

- Input validation on both frontend and backend
- SQL injection prevention through parameterized queries
- CORS configuration for secure cross-origin requests
- File upload validation (CSV only)
- No sensitive data in environment variables

## 📖 Documentation

- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is open source and available under the MIT License.

## ✉️ Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ by [Your Name]**
