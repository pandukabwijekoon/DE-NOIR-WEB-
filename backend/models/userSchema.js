const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  profile: {
    fullName: String,
    address: String,
    phone: String,
    avatar: String,
  },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
  }],
});

module.exports = mongoose.model('User', userSchema);