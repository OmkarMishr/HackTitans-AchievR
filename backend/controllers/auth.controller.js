const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Make JWT token -  user ID + role
const makeToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Clean slug for profile URLs
const makeSlug = (name) => {
  return name.toLowerCase().trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w-]/g, ''); 
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department, year, mobile } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Need name, email, and password' 
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already taken' 
      });
    }

    if (role === 'student' && rollNumber) {
      if (await User.findOne({ rollNumber })) {
        return res.status(400).json({ 
          success: false, 
          message: 'Roll number already registered' 
        });
      }
    }

    // Make unique slug (shashank-mishra → shashank-mishra-2)
    let slug = makeSlug(name);
    let counter = 1;
    while (await User.findOne({ slug })) {
      slug = `${makeSlug(name)}-${counter++}`;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      rollNumber,
      department,
      year,
      mobile,
      slug
    });

    const token = makeToken(user._id, user.role);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        slug: user.slug
      }
    });

  } catch (error) {
    console.log('Register error:', error.message);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password required' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Wrong credentials' });
    }

    if (!await user.comparePassword(password)) {
      return res.status(401).json({ success: false, message: 'Wrong credentials' });
    }

    const token = makeToken(user._id, user.role);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department
      }
    });

  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// Current user profile (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.log('Get me error:', error.message);
    res.status(500).json({ success: false, message: 'Profile fetch failed' });
  }
};


exports.logout = async (req, res) => {   // client drops token
  res.json({ success: true, message: 'Logged out' });
};