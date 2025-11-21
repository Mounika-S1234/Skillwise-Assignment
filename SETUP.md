# SETUP INSTRUCTIONS

## Quick Start Guide

This guide will help you set up and run the Product Inventory Management System locally.

### Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) - verify with `npm --version`
- **Git** (optional, for cloning)

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd inventory-management

# Or download and extract the ZIP file, then navigate to it
```

### Step 2: Install Dependencies

#### Option A: Install All at Once

```bash
# From project root
npm run install-all
```

#### Option B: Install Manually

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### Step 3: Start the Application

#### Option A: Start Both Services Together

```bash
# From project root (requires 'concurrently' installed)
npm start
```

#### Option B: Start Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will run on: **http://localhost:5000**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Frontend will open at: **http://localhost:3000**

### Step 4: Test the Application

1. **Open Frontend**: http://localhost:3000
2. **Test Backend Health**: http://localhost:5000/health
3. **Try Features**:
   - Add a new product
   - Search products
   - Filter by category
   - Edit a product (inline)
   - Delete a product
   - Import sample CSV (use `sample-products.csv`)
   - Export products
   - View inventory history

### Step 5: Sample Data

A sample CSV file (`sample-products.csv`) is provided in the project root.

To import it:
1. Click "Import" button
2. Select `sample-products.csv`
3. Products will be imported automatically

---

## Project Structure

```
inventory-management/
├── backend/                    # Node.js/Express backend
│   ├── routes/
│   │   └── products.js        # API endpoints
│   ├── database.js            # SQLite setup
│   ├── server.js              # Express app
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductTable.js
│   │   │   ├── ProductFormModal.js
│   │   │   ├── InventoryHistorySidebar.js
│   │   │   └── Toast.js
│   │   ├── api.js            # API client
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── README.md                   # Main documentation
├── DEPLOYMENT.md              # Deployment guide
├── package.json               # Root package.json
├── sample-products.csv        # Sample data for import
└── SETUP.md                   # This file
```

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Node.js/npm not installed. Install from https://nodejs.org/

### Issue: Port 3000 or 5000 already in use
**Solution**: 
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or use different ports:
```bash
# Backend on different port
cd backend
PORT=5001 npm run dev

# Frontend on different port
cd frontend
DANGEROUSLY_DISABLE_HOST_CHECK=true PORT=3001 npm start
```

### Issue: "sqlite3 compilation failed"
**Solution**: This is usually not a problem - sqlite3 may build from source. If it fails:
```bash
cd backend
npm rebuild sqlite3
```

### Issue: "React app not loading"
**Solution**: 
1. Check browser console for errors (F12)
2. Ensure backend is running
3. Check `.env` file has correct API URL

### Issue: "Cannot POST /api/products/import"
**Solution**:
1. Ensure backend is running (`http://localhost:5000/health` returns 200)
2. Check file is in CSV format
3. Review backend logs for errors

---

## API Endpoints Reference

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search?name=<query>` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Import/Export
- `POST /api/products/import` - Import from CSV
- `GET /api/products/export` - Export to CSV

### History
- `GET /api/products/:id/history` - Get inventory history

---

## Next Steps

1. **Customize**: Modify styling in `frontend/src/index.css`
2. **Add Features**: Extend components and API endpoints
3. **Deploy**: Follow `DEPLOYMENT.md` for production setup
4. **Database**: Migrate to PostgreSQL for scalability

---

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + Express | 18.x / 4.18.x |
| Frontend | React | 18.x |
| Database | SQLite | 5.x |
| HTTP Client | Axios | 1.x |
| File Upload | Multer | 1.x |
| Validation | Express Validator | 7.x |

---

## Development Tips

### Enable Debug Logging

**Backend**:
```bash
NODE_DEBUG=* npm run dev
```

**Frontend**:
Open DevTools (F12) and check Console tab

### Hot Reload

- **Frontend**: Already enabled with React Scripts
- **Backend**: Enabled with nodemon (`npm run dev`)

### Database Inspection

SQLite database is stored at `backend/inventory.db`

To inspect:
```bash
# Using SQLite CLI (if installed)
sqlite3 backend/inventory.db
> SELECT * FROM products;
> SELECT * FROM inventory_history;
```

---

## Performance Tips

1. **Frontend**:
   - Implement pagination for large product lists
   - Use React.memo() for ProductTable
   - Lazy load components with React.lazy()

2. **Backend**:
   - Add database indexes on frequently searched fields
   - Implement response caching with Redis
   - Use connection pooling for database

---

## Security Reminders

- Never commit `.env` files with secrets
- Always validate and sanitize user inputs
- Use HTTPS in production
- Keep dependencies updated with `npm audit`
- Use environment variables for sensitive data

---

## File Structure Details

### Backend Files

**`database.js`**
- SQLite connection setup
- Table initialization
- Exported `db` object

**`server.js`**
- Express app configuration
- Middleware setup
- Route initialization
- Error handling

**`routes/products.js`**
- All API endpoints
- Request validation
- Database operations
- File upload handling

### Frontend Files

**`api.js`**
- Axios client configuration
- API wrapper functions
- Error handling

**`App.js`**
- Main React component
- State management
- Component orchestration

**`components/ProductTable.js`**
- Product list display
- Inline editing
- Actions (Edit/Delete)

**`components/ProductFormModal.js`**
- Modal for adding/editing products
- Form validation
- API integration

**`components/InventoryHistorySidebar.js`**
- Sidebar for history display
- History data fetching
- Timeline view

**`components/Toast.js`**
- Toast notification system
- Custom hook for notifications

**`index.css`**
- Global styling
- Responsive design
- Component styles

---

## Support and Help

- **GitHub Issues**: Report bugs on GitHub
- **Documentation**: See README.md for full documentation
- **API Docs**: See backend/README.md for API reference

---

## Deployment

For production deployment, see `DEPLOYMENT.md` for detailed instructions on:
- Deploying to Render
- Deploying to Railway
- Deploying to Netlify/Vercel
- Database setup for production

---

**Happy Coding! 🚀**

Last Updated: November 2025
