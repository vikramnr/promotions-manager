const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport')
const passportLocal = require('passport-local')
const bodyParser = require('body-parser');
const createError = require('http-errors');
const methodOverride = require('method-override')

const User = require('./models/user')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const promoRouter = require('./routes/promotion')
const app = express();

// db connection to local instance
mongoose.connect('mongodb://localhost:27017/promomanager').then(() => console.log('connected successfully')).catch((err) => console.log(err))
// require seed model and 
const seed = require('./seed')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});


app.use(bodyParser.json());
app.use(expressSession);
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pm', promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.message)
  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error Occured'});
});

module.exports = app;
