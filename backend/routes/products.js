const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { body, validationResult, query } = require('express-validator');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const router = express.Router();
const db = require('../database');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith('.csv')) {
      cb(new Error('Only CSV files are allowed'));
    } else {
      cb(null, true);
    }
  }
});

// ============================================================================
// GET /api/products - Get all products with optional pagination and sorting
// ============================================================================
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'id';
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    const category = req.query.category;

    let query = 'SELECT * FROM products';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as count FROM products';
      if (category) {
        countQuery += ' WHERE category = ?';
      }

      db.get(countQuery, category ? [category] : [], (err, countResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          data: rows,
          pagination: {
            page,
            limit,
            total: countResult.count,
            pages: Math.ceil(countResult.count / limit)
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/products/search - Search products by name (case-insensitive)
// ============================================================================
router.get('/search', (req, res) => {
  try {
    const name = req.query.name || '';
    
    if (name.trim().length === 0) {
      return res.json({ data: [] });
    }

    const query = `
      SELECT * FROM products 
      WHERE LOWER(name) LIKE LOWER(?) 
      ORDER BY name ASC
    `;

    db.all(query, [`%${name}%`], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/products/:id/history - Get inventory history for a product
// ============================================================================
router.get('/:id/history', (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT * FROM inventory_history 
      WHERE product_id = ? 
      ORDER BY timestamp DESC
    `;

    db.all(query, [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: rows });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// POST /api/products - Create a new product
// ============================================================================
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('unit').trim().notEmpty().withMessage('Unit is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('brand').trim().notEmpty().withMessage('Brand is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('status').trim().notEmpty().withMessage('Status is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, unit, category, brand, stock, status, image } = req.body;

      const query = `
        INSERT INTO products (name, unit, category, brand, stock, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(query, [name, unit, category, brand, stock, status, image || null], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Product name already exists' });
          }
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          id: this.lastID,
          name,
          unit,
          category,
          brand,
          stock,
          status,
          image
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// PUT /api/products/:id - Update a product
// ============================================================================
router.put('/:id',
  [
    body('name').optional().trim(),
    body('unit').optional().trim(),
    body('category').optional().trim(),
    body('brand').optional().trim(),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('status').optional().trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, unit, category, brand, stock, status, image } = req.body;

      // First, fetch the current product data
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, currentProduct) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!currentProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // Build the update query dynamically
        const updates = [];
        const values = [];

        if (name !== undefined) {
          updates.push('name = ?');
          values.push(name);
        }
        if (unit !== undefined) {
          updates.push('unit = ?');
          values.push(unit);
        }
        if (category !== undefined) {
          updates.push('category = ?');
          values.push(category);
        }
        if (brand !== undefined) {
          updates.push('brand = ?');
          values.push(brand);
        }
        if (stock !== undefined) {
          updates.push('stock = ?');
          values.push(stock);
        }
        if (status !== undefined) {
          updates.push('status = ?');
          values.push(status);
        }
        if (image !== undefined) {
          updates.push('image = ?');
          values.push(image);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const updateQuery = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;

        db.run(updateQuery, values, function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(409).json({ error: 'Product name already exists' });
            }
            return res.status(500).json({ error: err.message });
          }

          // Track inventory history if stock changed
          if (stock !== undefined && stock !== currentProduct.stock) {
            const historyQuery = `
              INSERT INTO inventory_history (product_id, old_stock, new_stock, changed_by, timestamp)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `;
            db.run(historyQuery, [id, currentProduct.stock, stock, 'admin'], (histErr) => {
              if (histErr) {
                console.error('Error creating inventory history:', histErr);
              }
            });
          }

          // Fetch and return the updated product
          db.get('SELECT * FROM products WHERE id = ?', [id], (err, updatedProduct) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json(updatedProduct);
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ============================================================================
// DELETE /api/products/:id - Delete a product
// ============================================================================
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully', id: parseInt(id) });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// POST /api/products/import - Import products from CSV
// ============================================================================
router.post('/import', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const results = [];
    let parseError = null;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('error', (error) => {
        parseError = error;
      })
      .on('end', () => {
        // Clean up the file after reading
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });

        if (parseError) {
          return res.status(400).json({ error: 'Error parsing CSV file' });
        }

        let added = 0;
        let skipped = 0;
        const duplicates = [];

        // Process each row
        const processRow = (index) => {
          if (index >= results.length) {
            // All rows processed
            return res.json({
              added,
              skipped,
              duplicates,
              message: `Import complete: ${added} added, ${skipped} skipped`
            });
          }

          const row = results[index];

          // Validate required fields
          if (!row.name || !row.unit || !row.category || !row.brand) {
            skipped++;
            return processRow(index + 1);
          }

          // Check for duplicates (case-insensitive)
          db.get('SELECT id, name FROM products WHERE LOWER(name) = LOWER(?)', [row.name], (err, existingProduct) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (existingProduct) {
              skipped++;
              duplicates.push({
                name: row.name,
                existingId: existingProduct.id
              });
              return processRow(index + 1);
            }

            // Insert new product
            const insertQuery = `
              INSERT INTO products (name, unit, category, brand, stock, status, image)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const stock = parseInt(row.stock) || 0;
            const status = row.status || (stock > 0 ? 'In Stock' : 'Out of Stock');

            db.run(
              insertQuery,
              [row.name, row.unit, row.category, row.brand, stock, status, row.image || null],
              (err) => {
                if (err) {
                  console.error('Error inserting product:', err);
                  skipped++;
                } else {
                  added++;
                }
                processRow(index + 1);
              }
            );
          });
        };

        processRow(0);
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// GET /api/products/export - Export all products as CSV
// ============================================================================
router.get('/export', (req, res) => {
  try {
    db.all('SELECT * FROM products ORDER BY id ASC', (err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (products.length === 0) {
        return res.status(400).json({ error: 'No products to export' });
      }

      // Create CSV headers and data
      const csvHeaders = [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'unit', title: 'Unit' },
        { id: 'category', title: 'Category' },
        { id: 'brand', title: 'Brand' },
        { id: 'stock', title: 'Stock' },
        { id: 'status', title: 'Status' },
        { id: 'image', title: 'Image' }
      ];

      const csvFileName = `products-${Date.now()}.csv`;
      const csvFilePath = path.join(__dirname, '../uploads', csvFileName);

      const writer = createObjectCsvWriter({
        path: csvFilePath,
        header: csvHeaders
      });

      writer.writeRecords(products).then(() => {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${csvFileName}"`);
        
        const fileStream = fs.createReadStream(csvFilePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
          // Clean up the file after sending
          fs.unlink(csvFilePath, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
