const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const dbPath = path.join(__dirname, 'inventory.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product: row });
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, category, description, price, quantity, image } = req.body;
  
  if (!name || !category || price === undefined || quantity === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  const query = `
    INSERT INTO products (name, category, description, price, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [name, category, description || '', price, quantity, image || '📦'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      message: 'Product added successfully',
      id: this.lastID 
    });
  });
});

// Update product quantity
app.put('/api/products/:id/quantity', (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  
  if (quantity === undefined) {
    res.status(400).json({ error: 'Quantity is required' });
    return;
  }
  
  db.run('UPDATE products SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Quantity updated successfully' });
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, category, description, price, quantity, image } = req.body;
  
  if (!name || !category || price === undefined || quantity === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  const query = `
    UPDATE products 
    SET name = ?, category = ?, description = ?, price = ?, quantity = ?, image = ?
    WHERE id = ?
  `;
  
  db.run(query, [name, category, description, price, quantity, image, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product updated successfully' });
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`SkillForge Inventory Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    }
    console.log('\nDatabase connection closed');
    process.exit(0);
  });
});
