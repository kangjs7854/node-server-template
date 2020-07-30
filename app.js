/*
 * @Date: 2020-07-23 10:16:24
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-30 18:45:07
 * @FilePath: \server\app.js
 */ 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose")

var app = express();


mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection
db.on('error',console.error.bind(console, 'connection error:'))
db.once("open",()=>{
  console.log('mongodb connect success~');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


const indexRouter = require('./routes/index');
const getUserInfoRouter = require("./routes/getUserInfo")
const getClinicGuideRouter = require("./routes/getClinicGuide")
const getPatientRouter = require("./routes/getPatient")
const getAppointmentOrderRouter = require("./routes/getAppointmentOrder")

app.use('/api/get_cat_info', indexRouter);
app.use("/api/get_user_info",getUserInfoRouter)
app.use('/api/get_clinic_guide',getClinicGuideRouter)
app.use('/api/get_patient',getPatientRouter)
app.use('/api/get_appointment_order',getAppointmentOrderRouter)


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
