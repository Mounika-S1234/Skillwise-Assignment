# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
Currently, no authentication is required. (Optional: Can be added later)

---

## Endpoints

### 1. Get All Products

**Endpoint**: `GET /products`

**Query Parameters**:
- `page` (optional): Page number, default = 1
- `limit` (optional): Items per page, default = 10
- `sort` (optional): Sort field, default = 'id'
- `order` (optional): 'asc' or 'desc', default = 'asc'
- `category` (optional): Filter by category name

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "unit": "piece",
      "category": "Electronics",
      "brand": "Dell",
      "stock": 15,
      "status": "In Stock",
      "image": "https://...",
      "created_at": "2025-11-21T10:00:00.000Z",
      "updated_at": "2025-11-21T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Example**:
```bash
curl "http://localhost:5000/api/products?page=1&limit=10&sort=name&order=asc"
```

---

### 2. Search Products

**Endpoint**: `GET /products/search`

**Query Parameters**:
- `name` (required): Search term (case-insensitive, partial match)

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop Computer",
      "unit": "piece",
      "category": "Electronics",
      "brand": "Dell",
      "stock": 15,
      "status": "In Stock",
      "image": "https://...",
      "created_at": "2025-11-21T10:00:00.000Z",
      "updated_at": "2025-11-21T10:00:00.000Z"
    }
  ]
}
```

**Example**:
```bash
curl "http://localhost:5000/api/products/search?name=laptop"
```

---

### 3. Create Product

**Endpoint**: `POST /products`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "name": "New Product",
  "unit": "piece",
  "category": "Electronics",
  "brand": "Brand Name",
  "stock": 10,
  "status": "In Stock",
  "image": "https://example.com/image.jpg"
}
```

**Validation Rules**:
- `name` (required): Unique, non-empty string
- `unit` (required): Non-empty string
- `category` (required): Non-empty string
- `brand` (required): Non-empty string
- `stock` (required): Non-negative integer
- `status` (required): Non-empty string
- `image` (optional): Valid URL

**Response** (201 Created):
```json
{
  "id": 26,
  "name": "New Product",
  "unit": "piece",
  "category": "Electronics",
  "brand": "Brand Name",
  "stock": 10,
  "status": "In Stock",
  "image": "https://example.com/image.jpg"
}
```

**Error Response** (409 Conflict - duplicate name):
```json
{
  "error": "Product name already exists"
}
```

**Example**:
```bash
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "unit": "piece",
    "category": "Electronics",
    "brand": "Brand Name",
    "stock": 10,
    "status": "In Stock"
  }'
```

---

### 4. Update Product

**Endpoint**: `PUT /products/:id`

**Content-Type**: `application/json`

**URL Parameters**:
- `id` (required): Product ID

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "unit": "kg",
  "category": "Food",
  "brand": "Updated Brand",
  "stock": 20,
  "status": "Out of Stock",
  "image": "https://example.com/new-image.jpg"
}
```

**Notes**:
- Only provided fields are updated
- Stock changes are automatically logged in inventory_history
- Product name must remain unique (except for itself)

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Name",
  "unit": "kg",
  "category": "Food",
  "brand": "Updated Brand",
  "stock": 20,
  "status": "Out of Stock",
  "image": "https://example.com/new-image.jpg",
  "created_at": "2025-11-21T10:00:00.000Z",
  "updated_at": "2025-11-21T10:30:00.000Z"
}
```

**Example**:
```bash
curl -X PUT "http://localhost:5000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 20
  }'
```

---

### 5. Delete Product

**Endpoint**: `DELETE /products/:id`

**URL Parameters**:
- `id` (required): Product ID

**Response** (200 OK):
```json
{
  "message": "Product deleted successfully",
  "id": 1
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "Product not found"
}
```

**Example**:
```bash
curl -X DELETE "http://localhost:5000/api/products/1"
```

---

### 6. Import Products from CSV

**Endpoint**: `POST /products/import`

**Content-Type**: `multipart/form-data`

**Request Fields**:
- `csvFile` (required): CSV file

**CSV Format**:
```csv
name,unit,category,brand,stock,status,image
Product 1,piece,Electronics,Brand A,10,In Stock,https://...
Product 2,kg,Food,Brand B,50,Out of Stock,
```

**Required CSV Columns**:
- name
- unit
- category
- brand
- stock
- status (optional, auto-generated based on stock)
- image (optional)

**Response** (200 OK):
```json
{
  "added": 12,
  "skipped": 5,
  "duplicates": [
    {
      "name": "Existing Product",
      "existingId": 3
    }
  ],
  "message": "Import complete: 12 added, 5 skipped"
}
```

**Notes**:
- Duplicate check is case-insensitive
- Skipped items have missing required fields or are duplicates
- Invalid rows are skipped silently

**Example** (using curl):
```bash
curl -X POST "http://localhost:5000/api/products/import" \
  -F "csvFile=@products.csv"
```

---

### 7. Export Products as CSV

**Endpoint**: `GET /products/export`

**Response**:
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="products-<timestamp>.csv"`
- Body: CSV data

**CSV Format**:
```csv
ID,Name,Unit,Category,Brand,Stock,Status,Image
1,Product 1,piece,Electronics,Brand A,10,In Stock,https://...
2,Product 2,kg,Food,Brand B,50,Out of Stock,
```

**Example**:
```bash
curl "http://localhost:5000/api/products/export" -o products.csv
```

---

### 8. Get Inventory History

**Endpoint**: `GET /products/:id/history`

**URL Parameters**:
- `id` (required): Product ID

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "old_stock": 15,
      "new_stock": 10,
      "changed_by": "admin",
      "timestamp": "2025-11-21T10:30:00.000Z"
    },
    {
      "id": 2,
      "product_id": 1,
      "old_stock": 20,
      "new_stock": 15,
      "changed_by": "admin",
      "timestamp": "2025-11-21T10:15:00.000Z"
    }
  ]
}
```

**Notes**:
- Results are sorted by timestamp (newest first)
- Only stock changes are logged
- Shows all historical changes for the product

**Example**:
```bash
curl "http://localhost:5000/api/products/1/history"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Stock must be a non-negative integer",
      "param": "stock"
    }
  ]
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 409 Conflict
```json
{
  "error": "Product name already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection error"
}
```

---

## Rate Limiting
Currently not implemented. Can be added using express-rate-limit.

---

## CORS
- Enabled for all origins
- Can be restricted in production

---

## Database Schema

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

---

## Testing Tools

### Using curl (Command Line)
```bash
# Get all products
curl "http://localhost:5000/api/products"

# Search products
curl "http://localhost:5000/api/products/search?name=laptop"

# Create product
curl -X POST "http://localhost:5000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","unit":"piece","category":"Test","brand":"Test","stock":5,"status":"In Stock"}'
```

### Using Postman
1. Open Postman
2. Create new requests for each endpoint
3. Set request method and URL
4. Add headers and body as needed
5. Send request

### Using REST Client VS Code Extension
Create a `.http` file:
```http
### Get all products
GET http://localhost:5000/api/products

### Search products
GET http://localhost:5000/api/products/search?name=laptop

### Create product
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "New Product",
  "unit": "piece",
  "category": "Electronics",
  "brand": "Brand",
  "stock": 10,
  "status": "In Stock"
}
```

---

## Pagination Examples

```bash
# Get first 10 products
curl "http://localhost:5000/api/products?page=1&limit=10"

# Get next 10 products
curl "http://localhost:5000/api/products?page=2&limit=10"

# Sort by name ascending
curl "http://localhost:5000/api/products?sort=name&order=asc"

# Sort by stock descending
curl "http://localhost:5000/api/products?sort=stock&order=desc"
```

---

## Frequently Used Examples

### Import CSV file
```bash
curl -X POST "http://localhost:5000/api/products/import" \
  -F "csvFile=@sample-products.csv"
```

### Export all products
```bash
curl "http://localhost:5000/api/products/export" > products.csv
```

### Get history for product ID 1
```bash
curl "http://localhost:5000/api/products/1/history"
```

### Update stock only
```bash
curl -X PUT "http://localhost:5000/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{"stock": 50}'
```

---

## Version History

- v1.0.0 (November 2025): Initial release

---

**Last Updated**: November 2025
