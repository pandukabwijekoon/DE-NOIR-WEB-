const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware: check auth
function isAuth(req, res, next) {
  if (req.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Get user profile
router.get('/', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.product')
      .select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/', isAuth, async (req, res) => {
  try {
    const { fullName, address, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile: { fullName, address, phone, avatar } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart
router.put('/cart', isAuth, async (req, res) => {
  try {
    const { cart } = req.body;
    console.log('Received cart update:', cart); // Debug incoming cart
    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: 'Cart must be an array' });
    }
    for (const [index, item] of cart.entries()) {
      if (!item.product || !item.quantity || !item.size) {
        return res.status(400).json({ error: `Cart item at index ${index} is missing product, quantity, or size` });
      }
      if (!['S', 'M', 'L', 'XL'].includes(item.size)) {
        return res.status(400).json({ error: `Invalid size "${item.size}" at cart index ${index}` });
      }
    }
    const user = await User.findById(req.user.id);
    user.cart = cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
    }));
    await user.save();
    const updatedUser = await User.findById(req.user.id)
      .populate('cart.product')
      .select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;