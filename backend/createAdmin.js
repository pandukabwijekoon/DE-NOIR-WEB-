const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin user already exists
    const adminExists = await User.findOne({ username: 'dilum2003' });
    if (adminExists) {
      console.log('Admin user already exists');
      return mongoose.connection.close();
    }

    // Create admin user
    const hash = await bcrypt.hash('Mahasona@11', 10);
    const admin = new User({
      username: 'dilum2003',
      email: 'admin@denior.com',
      password: hash,
      nic: 'ADMIN-001',
      role: 'admin',
      profile: {
        fullName: 'Admin User',
        address: 'N/A',
        phone: 'N/A',
      },
    });

    await admin.save();
    console.log('Admin user created successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin:', err);
    mongoose.connection.close();
  }
}

createAdmin();