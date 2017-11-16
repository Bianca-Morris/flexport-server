"use strict";
var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize');
var sequelize = new Sequelize(
  process.env.DATABASE_NAME, null, null,
  {
    host: 'localhost',
    dialect: 'postgres'
  }
)


router.get('/test', function(req, res){
  res.json({success: true});
});

router.get('/api/v1/shipments', function(req, res){
  // var id = res.params.company_id;
  sequelize.query('SELECT * from COMPANIES', {type: sequelize.QueryTypes.SELECT})
  .then(function(resp){
    res.json({"records": resp});
  })
  .catch(function(err){
    res.json({"error": err});
  })
});

/*
/api/v1/shipments?company_id=#{YALMART_ID}
 {
   "records": [
     {
       "id": 1,
       "name": "yalmart apparel from china",
       "products": [
         {
           "quantity": 123,
           "id": 1,
           "sku": "shoe1",
           "description": "shoes",
           "active_shipment_count": 1
         },
         {
           "quantity": 234,
           "id": 2,
           "sku": "pant1",
           "description": "pants",
           "active_shipment_count": 2
         }
       ]
     },
     {
       "id": 2,
       ...
     },
     {
       "id": 3,
       ...
     }
   ]
 }
*/



router.get('/testdb', function(req, res){
  sequelize
  .authenticate()
  .then(function(){
    res.json({success: true});
  })
  .catch(function(err){
    res.json({success: false});
  })
})

module.exports = router;
