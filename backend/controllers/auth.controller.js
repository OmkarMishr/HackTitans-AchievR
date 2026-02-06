const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign(
    { userId: id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const slugify = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department, year, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, password required' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    if (role === 'student' && rollNumber) {
      const existingRoll = await User.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json({ success: false, message: 'Roll number already used' });
      }
    }

    // 🔹 Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;

    let count = 1;
    while (await User.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // 🔹 Create user WITH slug
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

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        slug: user.slug   // 👈 return slug to frontend
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//LOGOUT
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};