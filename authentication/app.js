var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

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
//app.use(cookieParser('12345-67890-09876-54321'));
//Setting up the session
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

//Both are files present inside the routes
//users is to handle login sign up and logout 
app.use('/', indexRouter);
app.use('/users', usersRouter);

//This is added to provide authorization
function auth(req, res, next){
  console.log(req.session);

  //user is a property we will setup in the signed cookie
  if(!req.session.user){
    
    //It means that the user is not authenticated, this will be managed in login/signup page
      var err = new Error('You are not authenticated !');
      err.status=403;
      return next(err);
    }
    
  else{
    //We set the user to 'authenticated' while logging in
    if(req.session.user === 'authenticated'){
      next();
    }
    else{
      var err = new Error('You are not authenticated !');
      err.status=403;
      return next(err);
    }
  }

}

app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

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
