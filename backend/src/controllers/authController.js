const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Only farmers can self-register
    const requestedRole = role || 'farmer';
    if (requestedRole !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Only farmers can register. Contact admin for other roles.'
      });
    }

    // Create user with approved=false
    user = await User.create({
      name,
      email,
      password,
      phone,
      role: requestedRole,
      location: location || '',
      approved: false
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Awaiting admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is approved
    if (!user.approved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Create user by admin (bypasses approval)
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide: name, email, password, phone, and role'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Validate role
    if (!['farmer', 'admin', 'agronomist'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be farmer, agronomist, or admin'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please use a different email'
      });
    }

    // Create user with approved=true (admin created)
    user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      location: location || '',
      approved: true
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};