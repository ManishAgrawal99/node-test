var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());



/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {

  //Here we are expecting to get all the users, so we need to find all the users in DB
	User.find({})
	.then((users) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(users);
	},
	(err) =>{
		next(err);
	})
	.catch((err) =>{
		next(err);
	})
});

router.post('/signup',cors.corsWithOptions, (req, res, next) =>{
  //If the provided username in the body already exists
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) =>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});      
    }
    else{
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return; 
        }
        passport.authenticate('local')(req,res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registeration Successful'});
        });
      });
      
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  //Creating a token using the authenticate file and sending in the user id from the req header as param
  //The req.user will be already available because the passport.authenticate('local') is successfully
  //done and this loads up the user property on the req message
  var token = authenticate.getToken({_id: req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  //The token is passed in to the reply message
  //The token can be later extracted in from here
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
})

router.get('/logout', (req,res) =>{
  if(req.session){
    req.session.destroy();
    //Removing the cookie from client side by the name session-id created in the app.js when first authenticating
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

//The FB strategy has been already configured in the authenticate.js file
router.get('/facebook/token', passport.authenticate('facebook-token'),(req, res) =>{
  //If the facebook authentication is successful then the user is already loaded into the req
  if(req.user){
    //We will create a JSON Web Token like we did in /login
    //The user is sending the access token to express server, the express server is using it to access the profile
    //If the user does not exist, we will create a new user with that FB ID
    //And after that our server is creating a JWT and returning it to our client
    //After this, it follows the same process
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //The token is passed in to the reply message
    //The token can be later extracted in from here
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
})

module.exports = router;
