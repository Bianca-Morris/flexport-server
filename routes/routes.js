"use strict";
var express = require('express');
var router = express.Router();

router.get('/test', function(req, res){
  res.json({success: true});
});

module.exports = router;
