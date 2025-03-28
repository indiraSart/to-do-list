const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.render('register', { errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.render('register', { error: 'User already exists' });
        }

        // Create new user
        user = new User({
            username,
            email,
            password
        });

        // Hash password and save user
        await user.save();

        console.log('Registration successful for user:', email);
        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (err) {
        console.error('Registration error:', err);
        res.render('register', { error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.render('login', { errors: errors.array() });
        }

        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.render('login', { error: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        console.log('Login successful for user:', email);
        // Redirect to a dashboard or home page after successful login
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        res.render('login', { error: 'Server error during login' });
    }
};

