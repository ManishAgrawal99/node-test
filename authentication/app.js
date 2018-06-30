var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

//Connecting to the MongoDB server with DB named conFusion
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
  //useMongoClient: true
});

connect.then((db) => {
  console.log('connected correctly to the server');
}, (err) =>{
  console.log('err');
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//We will be using signed cookie with the secret key as 12345-67890-09876-54321
app.use(cookieParser('12345-67890-09876-54321'));

//This is added to provide authorization
function auth(req, res, next){
  console.log(req.signedCookies);

  //user is a property we will setup in the signed cookie
  if(!req.signedCookies.user){
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

    //In this implementation, we use a fixed id and password
    if(username === 'admin' && password ==='password'){
      //If the id and pass are correct, we allow the user to pass through the next middleware
      //Since this is now an authorized user, we will setup a cookie here
      res.cookie('user','admin',{signed: true});

      next();
    }
    else{
      var err = new Error('You are not authenticated !');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status=401;
      return next(err);
    }
  }
  else{
    if(req.signedCookies.user === 'admin'){
      next();
    }
    else{
      var err = new Error('You are not authenticated !');
      err.status=401;
      return next(err);
    }
  }

}

app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
