const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: {
    type: String,
    enum: [
      'Men Wear',
      'Women Wear',
      'Oversized T-shirt',
      'Regular T-shirt',
      'Perfumes',
      'Croptop',
      'Polo T-shirt',
    ],
    required: true,
  },
  sizes: [{
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    available: { type: Boolean, default: true },
  }],
  soldOut: { type: Boolean, default: false },
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);