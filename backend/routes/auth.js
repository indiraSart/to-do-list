const router = require('express').Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// Render the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Render the login page
router.get('/login', (req, res) => { 
    res.render('login');
});

// Register route
router.post('/register', [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], authController.register);

// Login route
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], authController.login);

module.exports = router;