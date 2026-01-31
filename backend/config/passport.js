const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔵 Google OAuth callback - Profile:", profile.id);

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log("✅ Existing Google user found");
          return done(null, user);
        }

        // Check if email already exists (merge accounts)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          console.log("✅ Merging with existing email account");
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value;
          user.provider = "google";
          await user.save();
          return done(null, user);
        }

        // Create new user
        console.log("✨ Creating new Google user");
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
          provider: "google",
          role: "user",
        });

        done(null, user);
      } catch (err) {
        console.error("❌ Google OAuth error:", err);
        done(err, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/oauth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🐙 GitHub OAuth callback - Profile:", profile.id);

        // Check if user already exists
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          console.log("✅ Existing GitHub user found");
          return done(null, user);
        }

        // Get primary email
        const email = profile.emails?.find((e) => e.primary)?.value || profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in GitHub profile"), null);
        }

        // Check if email already exists (merge accounts)
        user = await User.findOne({ email });

        if (user) {
          console.log("✅ Merging with existing email account");
          user.githubId = profile.id;
          user.avatar = profile.photos[0]?.value;
          user.provider = "github";
          await user.save();
          return done(null, user);
        }

        // Create new user
        console.log("✨ Creating new GitHub user");
        user = await User.create({
          name: profile.displayName || profile.username,
          email,
          githubId: profile.id,
          avatar: profile.photos[0]?.value,
          provider: "github",
          role: "user",
        });

        done(null, user);
      } catch (err) {
        console.error("❌ GitHub OAuth error:", err);
        done(err, null);
      }
    }
  )
);

module.exports = passport;
