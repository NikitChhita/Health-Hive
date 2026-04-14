const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.get('/me', usersController.getCurrentUser);

router.patch('/me', checkAuth, usersController.updateProfile);
router.patch('/me/password', checkAuth, usersController.updatePassword);
router.delete('/me', checkAuth, usersController.deleteAccount);

module.exports = router;