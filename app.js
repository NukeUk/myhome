var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb =  require('mongodb');
var mangoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var dbHost = "mongodb://192.168.1.38:27017/fusion_demo";
var dbObject;
var MongoClient = mongodb.MongoClient;
//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

function getData(){
  //use the find() API and pass an empty query object to retrieve all records
  dbObject.collection("fuel_price").find({}).toArray(function(err, docs){
    if ( err ) throw err;
    var monthArray = [];
    var petrolPrices = [];
    var dieselPrices = [];
 
    for ( index in docs){
      var doc = docs[index];
      //category array
      var month = doc['month'];
      //series 1 values array
      var petrol = doc['petrol'];
      //series 2 values array
      var diesel = doc['diesel'];
      monthArray.push({"label": month});
      petrolPrices.push({"value" : petrol});
      dieselPrices.push({"value" : diesel});
    }
 
    var dataset = [
      {
        "seriesname" : "Petrol Price",
        "data" : petrolPrices
      },
      {
        "seriesname" : "Diesel Price",
        "data": dieselPrices
      }
    ];
 
    var response = {
      "dataset" : dataset,
      "categories" : monthArray
    };
  });
};

app.get("/fuelPrices", function(req, res){
  getData(res);
  console.log('Data retrived');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
