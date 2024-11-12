require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { initDb } = require('./db/db');  // Correctly require the initDb function
const incomeRoutes = require('./routes/income');
const expenseRoutes = require('./routes/expense');
const authRoutes = require('./routes/auth');  // Import the auth routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const User = require('./models/User');  // Assuming you have a User model

const app = express();
const PORT = process.env.PORT || 8080;

// Allow CORS for the front-end URL
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST'],
}));

// Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`,  // Update BASE_URL for live server
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

passport
