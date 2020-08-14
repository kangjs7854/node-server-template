/*
 * @Date: 2020-07-23 10:16:24
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-14 11:38:35
 * @FilePath: \server\app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose")
const fs = require('fs')
const ejs = require("ejs")
var app = express();

mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once("open", () => {
  console.log('mongodb connect success~');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
//批量动态引入api
const allApi = fs.readdirSync("./api");
allApi.forEach(el => {
  var el = require("./api/" + el)
  app.use('/api', el)
})

//批量动态引入routes
const allRoutes = fs.readdirSync("./routes");
allRoutes.forEach(el => {
  var el = require("./routes/" + el)
  app.use('/', el)
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
