require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { initDb } = require('./db/db');  
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense');
const authRoutes = require('./routes/auth');  // Import the auth routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const User = require('./models/user'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 8080;

// Allow CORS for the front-end URL
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST'],
}));

// Swagger setup for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Express session
app.use(session({ 
  secret: process.env.SESSION_SECRET || "your_secret_key", 
  resave: false, 
  saveUninitialized: false 
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`,  // Ensure BASE_URL is defined in your .env file
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initialize database connection
initDb((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully");

    // Start the server after the database is initialized
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
});

// Root route for the server
app.get('/', (req, res) => {
  res.send('Welcome to the Finance Tracker API! Go to /api-docs for API documentation.');
});

// Define API routes
app.use('/income', incomeRoutes);
app.use('/expense', expenseRoutes);
app.use('/auth', authRoutes);
