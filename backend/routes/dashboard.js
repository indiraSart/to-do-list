const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Use your existing JWT middleware

// Serve the dashboard page
router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard'); // Render the dashboard view
});

module.exports = router;