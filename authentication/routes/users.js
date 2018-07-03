var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) =>{
  //If the provided username in the body already exists
  User.findOne({username: req.body.username})
  .then((user) =>{
    if(user != null){
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({username: req.body.username,
                          password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registeration Successful', user: user});
  },(err) =>{
    next(err);
  })
  .catch((err) =>{
    next(err);
  })
});

router.post('/login',(req, res, next) => {
  //If the user is not present in session, we go through complete authentication
  if(!req.session.user){
    //It means that the user is not authorized yet
    var authHeader = req.headers.authorization;
  
    //If there is no authHeader means the client did not provide any authorization id and pass
    if(! authHeader){
      var err = new Error('You are not authenticated !');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status=401;
      return next(err);
    }

    //Since the header is a string seperated by ' ' in b/w basic and id pass and we want the id pass so we take [1] ie the second part
    //we give the id and pass a base64 encoding
    //Now we again split the id and pass seperated by ':' after converting it to string
    //So auth is now an array containing ID and Password
    var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];


    User.findOne({username: username})
    .then((user) => {
      
      if(user.username === username && user.password === password){
        //If the id and pass are correct, we allow the user to pass through the next middleware
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are auntheticated!');
      }
      else if(user.password !== password){
        var err = new Error('Incorrect Password !');
        err.status=403;
        return next(err);
      }
      else if(user ===null){
        var err = new Error('User '+username +' does not exist');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status=403;
        return next(err);
      }
    })
    .catch((err) =>{
      next(err);
    })
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated !');
  }
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

module.exports = router;
