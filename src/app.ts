import "reflect-metadata";
import { createExpressServer } from "routing-controllers";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require("mongoose")
const fs = require('fs')

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
  cors: true,
  controllers: [__dirname + "/controller/*"], //批量引入controller
});


//数据库连接
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once("open", () => {
  console.log('mongodb connect success~');
})

//中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors())

//批量动态引入路由
const allApi = fs.readdirSync("./src/routes");
allApi.forEach(el => {
  var el = require("./routes/" + el)
  app.use('/api', el)
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
  // res.render('error');
});

app.use("/",(req,res)=>{
  res.send("hello")
})


// run express application on port 3000
app.listen(5000,()=>{
  console.log('server is running on http://localhost:5000');
})

module.exports = app;
