const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('@node-rs/bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');  // Add JWT
const helmet = require('helmet');      // Add Helmet for security headers
const rateLimit = require('express-rate-limit'); // Add Rate Limiting

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Add security middlewares
app.use(helmet()); // Set security headers

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter); // Apply rate limiting globally

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Create User model
const User = require('./models/User');
const Subscriber = require('./models/Subscriber');

// Middleware for protecting routes
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header
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
};

// Routes
// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      username,
      password
    });

    await user.save();
    console.log('User saved to DB :', user)
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: user._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send successful response with the token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      },
      token, // Send the token in the response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Subscribe endpoint (no authentication required here)
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  console.log('Received email for subscription:', email);

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    // Save to DB
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    console.log('Subscriber saved:', subscriber);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thanks for subscribing!',
      text: 'You are now subscribed to our company newsletter. Stay tuned for updates!',
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Subscribed and email sent!' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

// Protected route example
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});