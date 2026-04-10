import express from 'express';
import { check } from 'express-validator';
import { getUsers, signup, login, getCurrentUser, updateProfile, updatePassword, updateNotifications, deleteUser } from '../controllers/users-controller.js';

const router = express.Router();

router.get('/', getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signup
);

router.post('/login', login);

router.get('/me', getCurrentUser);

router.patch('/profile', updateProfile);

router.patch('/password', updatePassword);

router.patch('/notifications', updateNotifications);

router.delete('/me', deleteUser);

export default router;