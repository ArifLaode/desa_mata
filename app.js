var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var { v4: uuidv4 } = require('uuid');
var bodParser = require('body-parser');

var secretkey = uuidv4();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var submitRouter = require('./routes/submit');

var app = express();

app.use(session({
    secret: secretkey,
    resave: false,
    saveUninitialized: true
  }));

  

app.use(logger('dev'));
app.use(bodParser.json());
app.use(bodParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'admin')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/layanan', loginRouter);
app.use('/submit', submitRouter);

module.exports = app;
