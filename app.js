"use strict";
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var routes = require('./routes/routes');
app.use(routes);

app.get("/", function(req, res){
  res.json({success: true});
});

// Generates 404 errors, if page not found
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handles errors and displays
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({Error : err});
});

var port = process.env.port || 3000;
app.listen(port, function() {
  console.log('Express started. Listening on %s', port);
});
