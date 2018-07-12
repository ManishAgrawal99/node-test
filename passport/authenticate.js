//We can use this file to store authentication strategies and to configure it
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//Configuring Passport with the new local strategy and then we export it
//Using the below, the user will have to supply the username & password as a JSON in the body of the message
//If we do not use passport local Mongoose, we will have to provide our own authenticate fn instead of authenticate()
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//The below two are used since we use sessions to track users and these provides us support for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

