const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../Uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage, limits: { files: 10 } });

// Middleware: check admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
}

// Get all products (with search and category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add product (admin only)
router.post('/', upload.fields([{ name: 'images', maxCount: 10 }]), isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, soldOut, sizes } = req.body;
    const images = (req.files.images || []).map(file => `/Uploads/${file.filename}`);
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }
    const product = new Product({
      name,
      description,
      price: Number(price),
      images,
      category,
      sizes: Array.isArray(parsedSizes) ? parsedSizes : [],
      soldOut: soldOut === 'true' || soldOut === 'on',
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(400).json({ error: err.message || 'Failed to add product' });
  }
});

// Update product (admin only)
router.put('/:id', upload.fields([{ name: 'images', maxCount: 10 }]), isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, soldOut, sizes } = req.body;
    const images = (req.files.images || []).map(file => `/Uploads/${file.filename}`);
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        category,
        images,
        sizes: Array.isArray(parsedSizes) ? parsedSizes : [],
        soldOut: soldOut === 'true' || soldOut === 'on',
      },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

// Toggle soldOut status (admin only)
router.patch('/:id/soldout', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.soldOut = !product.soldOut;
    await product.save();
    res.json({ message: `Product marked as ${product.soldOut ? 'sold out' : 'available'}`, product });
  } catch (err) {
    console.error('Error updating product status:', err);
    res.status(500).json({ error: 'Failed to update product status' });
  }
});

// Delete product (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;