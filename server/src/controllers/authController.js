const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secure_campus_it_jwt_secret_key_2026_final_year', {
    expiresIn: '7d',
  });
};

// @desc Register user (Student or Admin)
// @route POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, rollNo, email, password, department, role, assignedLab, assignedPc } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' });
    }

    const cleanName = name.trim();
    const cleanRoll = rollNo ? rollNo.trim().toUpperCase() : '';
    // Auto-derive email if not explicitly provided
    const fallbackHandle = (cleanRoll || cleanName).toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : `${fallbackHandle}@campus.edu`;

    // Check if user already exists by email or rollNo or name
    const query = [{ email: cleanEmail }];
    if (cleanRoll) {
      query.push({ rollNo: cleanRoll });
    }
    query.push({ name: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });

    let user = await User.findOne({ $or: query });

    if (user) {
      // Update existing record (e.g. user re-registering or resetting password)
      user.name = cleanName;
      if (cleanRoll) user.rollNo = cleanRoll;
      if (email && email.trim()) user.email = cleanEmail;
      user.password = password;
      if (department) user.department = department;
      if (role) user.role = role;
      if (assignedLab) user.assignedLab = assignedLab;
      if (assignedPc) user.assignedPc = assignedPc;
      await user.save();
    } else {
      user = await User.create({
        name: cleanName,
        rollNo: cleanRoll || `STU-${Date.now().toString().slice(-4)}`,
        email: cleanEmail,
        password,
        department: department || 'Computer Engineering',
        role: role || 'student',
        assignedLab: assignedLab || 'Lab 1',
        assignedPc: assignedPc || 'PC-01',
      });
    }

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        department: user.department,
        role: user.role,
        assignedLab: user.assignedLab,
        assignedPc: user.assignedPc,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // Can be email, rollNo, or name

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Roll No / Email / Name and password' });
    }

    const cleanIdentifier = identifier.trim();
    const escaped = cleanIdentifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check if identifier is email, rollNo, exact name, or partial name
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { rollNo: cleanIdentifier.toUpperCase() },
        { name: new RegExp(`^${escaped}$`, 'i') },
        { name: new RegExp(escaped, 'i') },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found. Please register if you are a new user.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        department: user.department,
        role: user.role,
        assignedLab: user.assignedLab,
        assignedPc: user.assignedPc,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        department: user.department,
        role: user.role,
        assignedLab: user.assignedLab,
        assignedPc: user.assignedPc,
      },
    });
  } catch (error) {
    next(error);
  }
};
