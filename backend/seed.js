// Optional: Seed database with test data
// Run this after starting your server if needed

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Report = require('./src/models/Report');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pest-disease-reporting', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Report.deleteMany({});

    // Create test farmers
    const farmer1 = await User.create({
      name: 'Ramesh Singh',
      email: 'ramesh@test.com',
      password: 'password123',
      phone: '9876543210',
      role: 'farmer',
      location: 'Haryana, India'
    });

    const farmer2 = await User.create({
      name: 'Priya Verma',
      email: 'priya@test.com',
      password: 'password123',
      phone: '8765432109',
      role: 'farmer',
      location: 'Punjab, India'
    });

    // Create test admin
    const admin = await User.create({
      name: 'Dr. Anil Kumar',
      email: 'admin@test.com',
      password: 'password123',
      phone: '7654321098',
      role: 'admin'
    });

    console.log('✓ Test users created');

    // Create test reports
    await Report.create({
      farmerId: farmer1._id,
      cropType: 'Tomato',
      imagePath: '/uploads/test-tomato-1.jpg',
      description: 'Brown spots appearing on leaves, leaves yellowing and dropping. Started 3 days ago.',
      location: 'Haryana, India',
      status: 'Pending'
    });

    await Report.create({
      farmerId: farmer1._id,
      cropType: 'Cucumber',
      imagePath: '/uploads/test-cucumber-1.jpg',
      description: 'Yellow spots with concentric rings on cucumber fruits and leaves. Severe infection.',
      location: 'Haryana, India',
      status: 'Identified',
      treatment: 'This appears to be Cucumber Mosaic Virus (CMV). Remove infected plants immediately. Spray with Neem oil weekly. Control aphid vectors using yellow sticky traps.'
    });

    await Report.create({
      farmerId: farmer2._id,
      cropType: 'Tomato',
      imagePath: '/uploads/test-tomato-2.jpg',
      description: 'Wilting and root rot symptoms. Soil appears waterlogged.',
      location: 'Punjab, India',
      status: 'Resolved',
      treatment: 'Problem was overwatering. Improved drainage by raising bed by 6 inches. Disease resolved after proper moisture management.'
    });

    console.log('✓ Test reports created');

    console.log('\n--- Test Credentials ---');
    console.log('Farmer 1:');
    console.log('  Email: ramesh@test.com');
    console.log('  Password: password123');
    console.log('\nFarmer 2:');
    console.log('  Email: priya@test.com');
    console.log('  Password: password123');
    console.log('\nAdmin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: password123');

    mongoose.connection.close();
    console.log('\n✓ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
