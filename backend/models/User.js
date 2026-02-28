const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    unique: true,
    trim: true,
    minlength: [3, 'NIC must be at least 3 characters long'],
    validate: {
      validator: function (v) {
        return v && v.trim().length > 0;
      },
      message: 'NIC cannot be empty',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
  }],
  profile: {
    fullName: String,
    address: String,
    phone: String,
    avatar: String,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);