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
app.use(express.urlencoded({ extended: false }));;
app.use('/',router);

router.get('/m/newArrive', async (req, res) => {
  try {
    const client = await MongoClient.connect(process.env.URI);
    const collection = client.db(process.env.DBNAME).collection(process.env.COLLECTION);

    if(collection) {
      const responseData = await collection.find().sort( { '_id': -1 } ).limit(8).map( function(u) { return {'id':u._id,'name': u.name, 'price': u.price}; } ).toArray();
      console.log(responseData);
      if(responseData)
        res.send(JSON.stringify(responseData));
      else
        res.sendStatus(404);
    } else {
      res.sendStatus(404);
    }


    /*
    const loadDB = await MongoClient.connect(process.env.URI, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(process.env.DBNAME);
      const collection = db.collection(process.env.COLLECTION);

      collection.find().sort( { '_id': -1 } ).limit(8).map( function(u) { return {'id':u._id,'name': u.name, 'price': u.price}; } ).toArray(function(err, docs) {
        assert.equal(err, null);
        responseData = docs;
      });

      client.close();
      return 200;
    })
    */
  } catch (error) {
    console.log(error.message);
  }
});

const port = process.env.PORT || port;
app.listen(port, () => console.log(`express listen at port ${port}`));
