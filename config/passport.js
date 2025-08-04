const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth Profile:', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    });

    // Check if user exists with Google ID
    let existingUser = await User.findOne({ googleId: profile.id });
    
    if (existingUser) {
      console.log('Existing user found:', existingUser.email);
      return done(null, existingUser);
    }

    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email provided by Google'), null);
    }

    let existingEmailUser = await User.findOne({ email: email });
    
    if (existingEmailUser) {
      // Link Google account to existing user
      console.log('Linking Google account to existing email user');
      existingEmailUser.googleId = profile.id;
      existingEmailUser.avatar = profile.photos?.[0]?.value || '';
      await existingEmailUser.save();
      return done(null, existingEmailUser);
    }

    // Create new user
    console.log('Creating new user');
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      avatar: profile.photos?.[0]?.value || ''
    });

    const savedUser = await newUser.save();
    console.log('New user created:', savedUser.email);
    return done(null, savedUser);

  } catch (error) {
    console.error('Google OAuth Strategy Error:', error);
    return done(error, null);
  }
}));

// Serialize user for session (minimal - only during OAuth flow)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session (minimal - only during OAuth flow)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

module.exports = passport;
