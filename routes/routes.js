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

router.get('/api/v1/shipments', function(req, res, next){
  var company_id = req.query.company_id;
  if (!company_id || !parseInt(company_id)){
    res.status(422).json({success: false, errors: ["company_id is required"]});
  } else {
    sequelize.query(
      `SELECT shipments.id,
        shipments.name,
        shipment_products.product_id,
        shipment_products.quantity,
        products.sku,
        products.description
      FROM shipment_products
      JOIN shipments
        on shipment_products.shipment_id = shipments.id
      JOIN products
        on shipment_products.product_id = products.id
      WHERE shipments.company_id = ?;
      `,
       {replacements: [company_id],type: sequelize.QueryTypes.SELECT})
    .then(function(resp){
      var shipment_ids = [] // keep track of each individual shipment id number
      var shipments = []; // keep track of each individual shipment's associated products
      // search through the
      resp.forEach(item => {
        var shipment_index = shipment_ids.indexOf(item.id); // for storing in shipment_ids
        // checks to see if shipment has already been entered into shipments array
        if (shipment_index === -1) {
          shipment_ids.push(item.id);
          // add the new shipment object to the shipments array
          shipments.push({
            "id": item.id,
            "name": item.name,
            "products": [
              // make sure it includes the product information
              {
                "quantity": item.quantity,
                "id": item.product_id,
                "sku": item.sku,
                "description": item.description,
                "active_shipment_count": item.product_id
              }
            ]
          });
        } else {
          // if the shipment already exists,
          // add the new product to its products array
          shipments[shipment_index].products.push({
            "quantity": item.quantity,
            "id": item.product_id,
            "sku": item.sku,
            "description": item.description,
            "active_shipment_count": item.product_id
          })
        }
      });
      res.json({"records": shipments});
    })
    .catch(function(err){
      res.status(500).json({"error": err});
    })
  }
});


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
