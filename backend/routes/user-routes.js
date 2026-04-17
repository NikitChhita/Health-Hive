import express from 'express';
import { check } from 'express-validator';
import {
  getUsers,
  signup,
  login,
  getCurrentUser,
  updateProfile,
  updatePassword,
  updateNotifications,
  deleteUser,
} from '../controllers/users-controller.js';
import checkAuth from '../middleware/check-auth.js';

const router = express.Router();

router.get('/', getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  signup
);

router.post('/login', login);

router.get('/me', checkAuth, getCurrentUser);
router.patch('/me', checkAuth, updateProfile);
router.patch('/me/password', checkAuth, updatePassword);
router.patch('/me/notifications', checkAuth, updateNotifications);
router.delete('/me', checkAuth, deleteUser);

export default router;
