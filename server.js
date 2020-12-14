require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/',router);

router.get('/m/newArrive', async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.URI);
    const collection = client.db(process.env.DBNAME).collection(process.env.COLLECTION);

    if(collection) {
      const responseData = await collection.find().sort( { '_id': -1 } ).limit(8).map( function(u) { return {'id':u._id,'name': u.name, 'price': u.price}; } ).toArray();
      //console.log(responseData);
      if(responseData)
        res.send(JSON.stringify(responseData));
      else
        res.sendStatus(404);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get('/m/product', async (req, res) => {
  var id =  req.query.id;
  try {
    const client = await MongoClient.connect(process.env.URI);
    const collection = client.db(process.env.DBNAME).collection(process.env.COLLECTION);

    if(collection) {
      const responseData = await collection.find({ '_id': new ObjectId(id) }).toArray();
      if(responseData)
        res.send(JSON.stringify(responseData));
      else
        res.sendStatus(404);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get('/m/productsFromType', async (req, res) => {
  var type =  req.query.type;
  var quantity = req.query.quantity ? req.query.quantity : 0;
  try {
    const client = await MongoClient.connect(process.env.URI);
    const collection = client.db(process.env.DBNAME).collection(process.env.COLLECTION);

    if(collection) {
      var responseData;
      if(quantity > 0) {
        responseData = await collection.find({ 'type': type }).sort( { '_id': -1 } ).limit(8).map( function(u) { return {'id':u._id,'name': u.name, 'price': u.price}; } ).toArray();
      } else {
        responseData = await collection.find({ 'type': type }).toArray();
      }

      if(responseData)
        res.send(JSON.stringify(responseData));
      else
        res.sendStatus(404);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.message);
  }
});

const port = process.env.PORT || port;
app.listen(port, () => console.log(`express listen at port ${port}`));
