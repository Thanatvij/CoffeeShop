// (backend)
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const validator = require('validator');

app.post('/your-route', (req, res) => {
  const cleanInput = validator.escape(req.body.name); 
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes bruteforc protect
  max: 100, // Limit each IP to 100 requests per windowMs
});

module.exports = {
  setupSecurity: (app) => {
    app.use(helmet()); // Set security headers
    app.use(xss()); // Prevent XSS attacks
    app.use(limiter); // Apply rate limiting
  },

  // Middleware to protect routes (check if the user is authenticated with JWT)
  authenticateJWT: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' });
      }
      req.user = user;
      next();
    });
  },
};