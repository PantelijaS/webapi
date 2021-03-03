const express = require('express')
const router = express.Router()
const mongoDB = require('mongodb')
const auth =  require('../middleware/auth');
const db = require('../db')
const collection = "users";


// get all category
router.get('/', (req, res) => {
  
  db.getDB().collection(collection).find().toArray((err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      // console.log(result)
      db.closeDb();
    }
  });
});