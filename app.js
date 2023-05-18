var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJSDoc = require('swagger-jsdoc');


//GLOBAL DECLARATION//
const local = require('dotenv');
mongoose = require('mongoose');
verifyToken = require('./auth/validateToken');
jwt = require('jsonwebtoken');
logger1 = require("./logger");

local.config();
// var config=require('config');

//ROUTES//
var indexRouter = require('./routes/index');
var employeeRouter = require('./routes/employee');
var projectRouter = require('./routes/project');

//MODELS//
employeeModel = require("./model/employeeModel");
departmentModel = require("./model/departmentModel");
projectModel = require("./model/projectModel");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//END POINTS
app.use('/', indexRouter);
app.use('/employee', employeeRouter);
app.use('/project', projectRouter);


//MONGOOSE//
mongoose.connect('mongodb://127.0.0.1:27017/Data')
  .then(() => {
  //  var datas= logger1.info("connected");
  console.log("connected");
  })
  .catch((error) => console.log(error));
  

//SWAGGER//
let swaggerDefinition = {
  info: {
    title: 'Learning - API Swagger Definition',
    version: '1.0.0',
    description: 'For learning purposes',
  },
  // host: config.project.url,
  basePath: '/',
};
let options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./routes/*.js'],
};
// initialize swagger-jsdoc
let swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// catch 404 and forward to error handler //
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler //
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
