# Quick Reference Guide

## 📌 Quick Commands

### Starting the Application

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

### URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 🎯 Common Tasks

### Add a Product
1. Click "+ Add New Product"
2. Fill all fields
3. Click "Add Product"

### Edit a Product
1. Find product in table
2. Click "Edit"
3. Modify fields
4. Click "Save"

### Delete a Product
1. Click "Delete"
2. Confirm deletion

### Search Products
1. Type in search bar
2. Results filter automatically

### Filter by Category
1. Select category from dropdown
2. Products filter automatically

### Import Products
1. Click "Import"
2. Select CSV file
3. Products import automatically

### Export Products
1. Click "Export"
2. CSV file downloads

### View Inventory History
1. Click on product row
2. Sidebar slides in with history

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Close other apps or change port |
| Port 5000 in use | Kill process on port 5000 |
| npm install fails | Delete node_modules, try again |
| Can't connect to backend | Ensure backend is running |
| Database errors | Delete inventory.db, restart |
| White screen frontend | Check browser console for errors |
| API returning 404 | Verify backend is running |
| CSV import not working | Ensure CSV has correct headers |

---

## 📁 Important Files

```
backend/
  ├── server.js            # Start here to understand backend
  ├── routes/products.js   # All API endpoints
  ├── database.js          # Database setup
  └── package.json         # Dependencies

frontend/
  ├── App.js               # Main React component
  ├── components/          # All UI components
  ├── api.js               # API client
  └── index.css            # Styling
```

---

## 🌐 API Quick Reference

### GET /api/products
```bash
curl "http://localhost:5000/api/products?page=1&limit=10"
```

### POST /api/products
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","unit":"piece","category":"Electronics","brand":"Brand","stock":10,"status":"In Stock"}'
```

### PUT /api/products/1
```bash
curl -X PUT "http://localhost:5000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{"stock":20}'
```

### DELETE /api/products/1
```bash
curl -X DELETE "http://localhost:5000/api/products/1"
```

### Search /api/products/search
```bash
curl "http://localhost:5000/api/products/search?name=laptop"
```

### Import /api/products/import
```bash
curl -X POST "http://localhost:5000/api/products/import" \
  -F "csvFile=@sample-products.csv"
```

### Export /api/products/export
```bash
curl "http://localhost:5000/api/products/export" -o products.csv
```

### History /api/products/1/history
```bash
curl "http://localhost:5000/api/products/1/history"
```

---

## 📊 CSV Format

```csv
name,unit,category,brand,stock,status,image
Product 1,piece,Electronics,Brand A,10,In Stock,https://...
Product 2,kg,Food,Brand B,50,Out of Stock,
Product 3,liter,Beverages,Brand C,25,In Stock,
```

---

## 🗄️ Database Schema

### Products Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTO |
| name | TEXT | UNIQUE NOT NULL |
| unit | TEXT | |
| category | TEXT | |
| brand | TEXT | |
| stock | INTEGER | DEFAULT 0 |
| status | TEXT | |
| image | TEXT | |
| created_at | DATETIME | DEFAULT NOW |
| updated_at | DATETIME | DEFAULT NOW |

### Inventory History Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTO |
| product_id | INTEGER | FOREIGN KEY |
| old_stock | INTEGER | |
| new_stock | INTEGER | |
| changed_by | TEXT | DEFAULT 'admin' |
| timestamp | DATETIME | DEFAULT NOW |

---

## 🎨 UI Components

### ProductTable
Displays products with columns: Image, Name, Unit, Category, Brand, Stock, Status, Actions

### ProductFormModal
Modal for adding/editing products with form validation

### InventoryHistorySidebar
Right sidebar showing product history and change logs

### Toast Notifications
Temporary messages for user feedback

---

## 🛠️ Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📋 Testing Checklist

- [ ] Add product
- [ ] Edit product
- [ ] Delete product
- [ ] Search products
- [ ] Filter by category
- [ ] Import CSV
- [ ] Export CSV
- [ ] View history
- [ ] Check responsive design
- [ ] Verify database persistence

---

## 🚀 Deployment Checklist

- [ ] Update API URL in frontend .env
- [ ] Build frontend (`npm run build`)
- [ ] Push to GitHub
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Configure environment variables
- [ ] Test deployed application
- [ ] Share URLs

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP.md | Installation guide |
| DEPLOYMENT.md | Production deployment |
| API_DOCUMENTATION.md | API reference |
| TESTING_GUIDE.md | Testing instructions |
| PROJECT_SUMMARY.md | Project overview |
| This file | Quick reference |

---

## 🆘 Error Messages & Solutions

### "Product name already exists"
- Duplicate product name
- Try different name or edit existing product

### "Stock must be a non-negative integer"
- Invalid stock value (negative or not a number)
- Enter valid integer >= 0

### "Cannot connect to backend"
- Backend not running
- Start backend with `npm run dev`

### "CSV import failed"
- Invalid CSV format
- Check headers match: name,unit,category,brand,stock,status,image

### "Port 3000 already in use"
- Another process using port
- Kill process or restart computer

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Navigate form fields |
| Enter | Submit form |
| Esc | Close modal/sidebar |
| Ctrl+C | Stop server |

---

## 🔗 Useful Links

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html/)
- [Axios Documentation](https://axios-http.com/)

---

## 📈 Performance Tips

1. **Import**: Bulk import CSV for multiple products
2. **Search**: Search is case-insensitive for ease
3. **Filter**: Use category filter before search
4. **Export**: Export regularly for backups
5. **Database**: Clean old history logs periodically

---

## 🔐 Security Notes

- Don't commit `.env` files with secrets
- Use environment variables for sensitive data
- Always validate user input (both frontend & backend)
- Keep dependencies updated
- Use HTTPS in production

---

## 💡 Tips & Tricks

1. **Bulk Operations**
   - Import CSV with 100+ products at once
   - Export and modify CSV offline

2. **History Tracking**
   - Click any product row to see all changes
   - Useful for audit trail

3. **Search Optimization**
   - Search is real-time and case-insensitive
   - Partial name matching works

4. **Mobile Access**
   - Application is fully responsive
   - All features work on mobile

5. **Keyboard Navigation**
   - Tab through form fields
   - Enter to submit
   - Esc to close modals

---

## 🎓 Code Highlights

### Easy to Understand Components
- No complex state management (uses React hooks)
- No external UI framework (pure CSS)
- Modular and component-based
- Clear separation of concerns

### Database Features
- Automatic history tracking
- Data persistence with SQLite
- Cascade delete for referential integrity
- Case-insensitive search

### API Design
- RESTful principles
- Proper HTTP methods
- Consistent response format
- Comprehensive error handling

---

**Last Updated**: November 2025

**Need Help?** Check the relevant documentation file:
- Installation: SETUP.md
- Deployment: DEPLOYMENT.md
- API Usage: API_DOCUMENTATION.md
- Testing: TESTING_GUIDE.md
