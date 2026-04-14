const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users failed, please try again later' });
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed, please try again later' });
  }

  if (existingUser) {
    return res.status(422).json({ message: 'User already exists' });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ message: 'Could not create user, please try again' });
  }

  const createdUser = new User({ name, email, password: hashedPassword });

  try {
    await createdUser.save();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed, please try again' });
  }

  res.status(201).json({
    token,
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt
    }
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed, please try again later' });
  }

  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json({ message: 'Login failed, please try again' });
  }

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (err) {
    return res.status(500).json({ message: 'Login failed, please try again' });
  }

  res.json({
    token,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      createdAt: existingUser.createdAt
    }
  });
};

const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toObject({ getters: true }) });
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(422).json({ message: 'Name and email are required' });
  }

  try {
    const existing = await User.findOne({ email, _id: { $ne: req.userId } });
    if (existing) {
      return res.status(422).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Updating profile failed, please try again' });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(422).json({ message: 'Valid current and new password (min 6 chars) are required' });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Updating password failed, please try again' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting account failed, please try again' });
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getCurrentUser = getCurrentUser;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;
exports.deleteAccount = deleteAccount;