// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth setup (GoogleStrategy will be defined in index.js, as seen below)
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// OAuth callback route to handle Google authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect user with token to the front-end (modify URL as needed)
    res.redirect(`/?token=${req.user.accessToken}`);
  }
);

// Route for logging out
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
