//We can use this file to store authentication strategies and to configure it
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

//Configuring Passport with the new local strategy and then we export it
//Using the below, the user will have to supply the username & password as a JSON in the body of the message
//If we do not use passport local Mongoose, we will have to provide our own authenticate fn instead of authenticate()
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//The below two are used since we use sessions to track users and these provides us support for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    //Creates and returns a JWT
    return jwt.sign(user, config.secretKey, 
        {expiresIn:3600});
        //States that the token expires in 3600 sec
};

var opts= {};
//Tells how and from where the token will be extracted
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) =>{
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id},(err,user) =>{
            if(err){
                return done(err, false);
            }
            else if(user){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        })
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin){
      next();
    }
    else {
      var err = new Error ('Admin Previleges Required!');
      err.status = 403;
      return next(err);
    }
  };

