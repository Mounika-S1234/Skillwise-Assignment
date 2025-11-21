# Testing Guide

Complete guide for testing the Product Inventory Management System.

---

## Prerequisites

- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Sample data available (`sample-products.csv`)

---

## Manual Testing Checklist

### 1. Backend API Testing

#### 1.1 Health Check
```bash
curl http://localhost:5000/health
```
**Expected**: `{"status":"Backend is running"}`

#### 1.2 Get All Products
```bash
curl http://localhost:5000/api/products
```
**Expected**: Products list (initially empty or with imported data)

#### 1.3 Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Laptop",
    "unit": "piece",
    "category": "Electronics",
    "brand": "TestBrand",
    "stock": 5,
    "status": "In Stock"
  }'
```
**Expected**: Product created with ID

#### 1.4 Search Products
```bash
curl "http://localhost:5000/api/products/search?name=test"
```
**Expected**: Filtered products list

#### 1.5 Update Product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 10}'
```
**Expected**: Updated product data

#### 1.6 Get Inventory History
```bash
curl http://localhost:5000/api/products/1/history
```
**Expected**: History records showing stock changes

#### 1.7 Import CSV
```bash
curl -X POST http://localhost:5000/api/products/import \
  -F "csvFile=@sample-products.csv"
```
**Expected**: Success message with counts

#### 1.8 Export CSV
```bash
curl http://localhost:5000/api/products/export -o products.csv
```
**Expected**: CSV file downloaded

#### 1.9 Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/1
```
**Expected**: Deletion confirmation

---

### 2. Frontend UI Testing

#### 2.1 Page Load
- Open `http://localhost:3000`
- **Expected**: Page loads without errors, displays header with buttons

#### 2.2 Search Bar
- Type "laptop" in search bar
- **Expected**: Products list filters in real-time

#### 2.3 Category Filter
- Select a category from dropdown
- **Expected**: Products filtered by category
- Clear filter (select "All Categories")
- **Expected**: All products displayed

#### 2.4 Add New Product
- Click "+ Add New Product" button
- **Expected**: Modal form opens
- Fill form with valid data
- Click "Add Product"
- **Expected**: Toast success message, product appears in table

#### 2.5 Edit Product (Inline)
- Find a product in table
- Click "Edit" button
- **Expected**: Row becomes editable
- Modify stock value (e.g., 15 to 20)
- Click "Save"
- **Expected**: Toast success, row updates, history should record change

#### 2.6 Delete Product
- Click "Delete" button
- **Expected**: Confirmation dialog appears
- Confirm deletion
- **Expected**: Product removed from table

#### 2.7 Import CSV
- Click "Import" button
- **Expected**: File picker opens
- Select `sample-products.csv`
- **Expected**: Success toast showing import count

#### 2.8 Export CSV
- Click "Export" button
- **Expected**: CSV file downloads

#### 2.9 View History
- Click on any product row (not on buttons)
- **Expected**: Sidebar slides in from right
- Shows product info and history
- Close sidebar
- **Expected**: Sidebar slides out

#### 2.10 Toast Notifications
- Perform any action (add, edit, delete, import, export)
- **Expected**: Toast notification appears top-right
- Disappears after 3 seconds

---

### 3. Integration Testing

#### 3.1 Full Workflow
1. Add a product
   - Click "+ Add New Product"
   - Fill all fields
   - Click "Add Product"
   - **Expected**: Product added successfully

2. Edit the product
   - Find product in table
   - Click "Edit"
   - Change stock value
   - Click "Save"
   - **Expected**: Product updated

3. Check history
   - Click product row
   - **Expected**: Sidebar shows the stock change you just made

4. Export
   - Click "Export"
   - **Expected**: CSV contains the product you added

5. Delete
   - Click "Delete"
   - Confirm
   - **Expected**: Product removed

#### 3.2 Bulk Import Workflow
1. Ensure database is empty or has few products
2. Click "Import"
3. Select `sample-products.csv`
4. **Expected**: 
   - Toast shows "25 added, 0 skipped"
   - Table displays all 25 products
5. Try importing same file again
6. **Expected**: 
   - Toast shows "0 added, 25 skipped"
   - No duplicates added

---

### 4. Edge Cases and Error Testing

#### 4.1 Duplicate Product Name
- Try to create product with name that already exists
- **Expected**: Error: "Product name already exists"

#### 4.2 Missing Required Fields
- Try to add product without name
- **Expected**: Validation error message

#### 4.3 Invalid Stock Value
- Try to set stock to negative number
- **Expected**: Validation error or rejected

#### 4.4 Empty Search
- Clear search box (leave empty)
- **Expected**: All products displayed

#### 4.5 Non-existent Product Edit
- Manually try to edit URL with invalid ID
- **Expected**: Graceful error handling

#### 4.6 Large CSV Import
- Create CSV with 1000 products
- Import
- **Expected**: All products imported successfully

#### 4.7 Malformed CSV
- Create invalid CSV (wrong headers)
- Try to import
- **Expected**: Error or skip invalid rows

#### 4.8 Network Failure
- Disconnect internet
- Try to add product
- **Expected**: Error toast message

---

### 5. Performance Testing

#### 5.1 Large Dataset
- Import large number of products (1000+)
- **Expected**: 
  - Page loads within 3 seconds
  - Search responds within 1 second
  - Scrolling is smooth

#### 5.2 Multiple Concurrent Edits
- Open product in two browser tabs
- Edit same product in both tabs
- **Expected**: Last change wins, no data corruption

#### 5.3 Rapid Searches
- Type quickly in search box
- **Expected**: No lag, results update smoothly

---

### 6. Browser Compatibility Testing

Test on different browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Expected**: All features work consistently

---

### 7. Responsive Design Testing

#### 7.1 Desktop (1920x1080)
- All elements visible
- Table scrolls horizontally if needed
- **Expected**: Fully responsive

#### 7.2 Tablet (768x1024)
- Header stacks properly
- Table readable
- Sidebar slides in correctly
- **Expected**: Properly formatted

#### 7.3 Mobile (375x667)
- All buttons accessible
- Search bar functional
- Table readable (might scroll)
- **Expected**: Mobile-friendly layout

#### 7.4 Test Rotation
- Rotate device
- **Expected**: Layout adjusts

---

### 8. Data Validation Testing

#### 8.1 Product Name
- Test with special characters: `Test@#$%`
- Test with spaces: `Test Product Name`
- Test with numbers: `Product 123`
- **Expected**: All accepted

#### 8.2 Stock
- Test with 0
- Test with very large number (999999)
- Test with decimal (should reject)
- Test with negative (should reject)
- **Expected**: Only integers >= 0 accepted

#### 8.3 Image URL
- Test with valid URL
- Leave empty
- Test with invalid URL format
- **Expected**: Valid URLs stored, empty accepted, invalid rejected

#### 8.4 Category/Brand/Unit
- Test with various text inputs
- Test with max length strings
- **Expected**: All accepted and stored

---

### 9. Database Testing

#### 9.1 Data Persistence
- Add products
- Restart backend
- **Expected**: Products still exist (database persists)

#### 9.2 Inventory History
- Update stock multiple times
- Query history
- **Expected**: All changes recorded chronologically

#### 9.3 Unique Constraint
- Try to insert duplicate name
- **Expected**: Error message

#### 9.4 Cascading Delete
- Delete product
- Check inventory_history
- **Expected**: Related history records deleted

---

### 10. Accessibility Testing

#### 10.1 Keyboard Navigation
- Navigate using Tab key
- **Expected**: Can access all interactive elements

#### 10.2 Screen Reader
- Use screen reader (e.g., NVDA, JAWS)
- **Expected**: All elements properly labeled

#### 10.3 Color Contrast
- Check stock status badges
- **Expected**: Sufficient contrast (WCAG AA)

#### 10.4 Font Size
- Zoom to 150%, 200%
- **Expected**: All text readable

---

## Automated Testing (Optional)

### Backend Testing (Jest + Supertest)

Create `backend/tests/products.test.js`:
```javascript
const request = require('supertest');
const app = require('../server');

describe('Products API', () => {
  test('GET /api/products should return products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  test('POST /api/products should create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        unit: 'piece',
        category: 'Test',
        brand: 'Test',
        stock: 5,
        status: 'In Stock'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

Run with:
```bash
npm test
```

### Frontend Testing (Jest + React Testing Library)

Create `frontend/src/App.test.js`:
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main header', () => {
  render(<App />);
  expect(screen.getByText(/inventory management system/i)).toBeInTheDocument();
});
```

Run with:
```bash
npm test
```

---

## Load Testing

### Using Apache Bench (ab)

```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/api/products

# Export and stress test
ab -n 1000 -c 50 http://localhost:5000/api/products/export
```

### Using k6

```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let response = http.get('http://localhost:5000/api/products');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => r.json('data').length > 0,
  });
}
```

Run with:
```bash
k6 run load-test.js
```

---

## Test Data

### Use sample-products.csv for testing:
```csv
name,unit,category,brand,stock,status,image
Laptop Computer,piece,Electronics,Dell,15,In Stock,
Wireless Mouse,piece,Electronics,Logitech,42,In Stock,
USB-C Cable,piece,Electronics,Belkin,120,In Stock,
Coffee Beans,kg,Food,Lavazza,50,In Stock,
...
```

---

## Testing Checklist

- [ ] Backend API endpoints all working
- [ ] Frontend loads without errors
- [ ] Search functionality working
- [ ] Filter functionality working
- [ ] Add product working
- [ ] Edit product working
- [ ] Delete product working
- [ ] Import CSV working
- [ ] Export CSV working
- [ ] Inventory history working
- [ ] All toast notifications displaying
- [ ] Responsive design working on mobile
- [ ] Database persisting data
- [ ] Error handling working
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable

---

## Known Limitations

1. **No Authentication**: Currently anyone can access all data
2. **SQLite**: Not ideal for high-concurrency scenarios
3. **File Upload**: Limited to CSV format only
4. **Database**: No query optimization indexes

---

## Bug Report Template

If you find an issue:

```
Title: [Component] Issue description

Environment:
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Backend: Running/Not running

Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3

Expected Result:
Should do X

Actual Result:
Does Y

Screenshots: [if applicable]
```

---

**Last Updated**: November 2025
