const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Check for token in Authorization header
        let token = req.header('Authorization')?.replace('Bearer ', '');

        // If no token in header, check cookies
        if (!token && req.cookies) {
            token = req.cookies.token; // Assuming the token is stored in cookies
        }

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not defined in the environment variables' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the verified user to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

module.exports = auth;