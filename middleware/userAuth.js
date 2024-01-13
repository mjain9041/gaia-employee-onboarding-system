//impementing middleware using jwt only those user can access who have tocken
const jwt = require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. Token not provided.' });
            jwt.verify(token, 'your-secret-key', (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token.' });
            req.user = user;
            next();
        });
    }
}