import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Analysis from '../models/analysis.js';

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

const updateProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({ message: 'Email already in use' });
      }
    }

    user.name = name;
    user.email = email;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        notifications: user.notifications,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(currentPassword, user.password);
    } catch (err) {
      return res.status(500).json({ message: 'Password verification failed' });
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      return res.status(500).json({ message: 'Could not update password' });
    }

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const updateNotifications = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const { email, analysis, updates } = req.body;

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof email !== 'undefined') user.notifications.email = email;
    if (typeof analysis !== 'undefined') user.notifications.analysis = analysis;
    if (typeof updates !== 'undefined') user.notifications.updates = updates;

    user.updatedAt = new Date();
    await user.save();

    res.json({
      message: 'Notification preferences updated',
      notifications: user.notifications
    });
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    // Delete all analyses for the user
    await Analysis.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

export { getUsers, signup, login, getCurrentUser, updateProfile, updatePassword, updateNotifications, deleteUser };
