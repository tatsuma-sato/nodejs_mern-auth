const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// Called during login/signup
passport.use(new LocalStrategy(User.authenticate()));

// Called while after login/signup, set user details to req.user
passport.serializeUser(User.serializeUser());
