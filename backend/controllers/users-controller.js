import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Analysis from '../models/analysis.js';

import crypto from 'crypto';
import { sendResetEmail } from '../utils/mailer.js';

const JWT_SECRET = process.env.JWT_SECRET;

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  notifications: user.notifications,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUsers = async (req, res) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users failed, please try again later' });
  }

  return res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res) => {
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

  return res.status(201).json({
    token,
    user: serializeUser(createdUser),
  });
};

const login = async (req, res) => {
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

  return res.json({
    token,
    user: serializeUser(existingUser),
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: serializeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching current user failed, please try again' });
  }
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(422).json({ message: 'Name and email are required' });
  }

  try {
    const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });

    if (existingUser) {
      return res.status(422).json({ message: 'Email already in use' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.updatedAt = new Date();
    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: serializeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Updating profile failed, please try again' });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(422).json({ message: 'Current and new password are required' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(422).json({ message: 'New passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(422).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Updating password failed, please try again' });
  }
};

const updateNotifications = async (req, res) => {
  const { email, analysis, updates } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof email !== 'undefined') {
      user.notifications.email = email;
    }

    if (typeof analysis !== 'undefined') {
      user.notifications.analysis = analysis;
    }

    if (typeof updates !== 'undefined') {
      user.notifications.updates = updates;
    }

    user.updatedAt = new Date();
    await user.save();

    return res.json({
      message: 'Notification preferences updated',
      notifications: user.notifications,
      user: serializeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Updating notifications failed, please try again' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await Analysis.deleteMany({ userId: req.userId });

    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Account and all data deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Deleting account failed, please try again' });
  }
};

const forgotPassword = async (req, res) => {
  console.log('forgotPassword called with:', req.body);
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    
    console.log('Attempting to send email to:', user.email);
    await sendResetEmail(user.email, resetUrl);
    console.log('Email sent successfully');

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({ message: 'Failed to send reset email, please try again' });
  }
};

// --- ADD THIS ---
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(422).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.updatedAt = new Date();
    await user.save();

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    return res.status(500).json({ message: 'Password reset failed, please try again' });
  }
};


export {
  getUsers,
  signup,
  login,
  getCurrentUser,
  updateProfile,
  updatePassword,
  updateNotifications,
  deleteUser, 
  forgotPassword, 
  resetPassword,
};
