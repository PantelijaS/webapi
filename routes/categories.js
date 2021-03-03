const express = require('express')
const router = express.Router()
const mongoDB = require('mongodb')
const auth =  require('../middleware/auth');
const db = require('../db')
const collection = "categories";

// get all category
router.get('/',auth, (req, res) => {
  
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

router.post('/add',auth,function (req,res){
  console.log(req.body.categories)
  var cat = {
    categories: req.body.categories,
    name: req.body.name
  }
  db.getDB().collection(collection).insertOne(cat, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      db.closeDb();
    }
  });
});

// get id category
router.get('/:id', auth,(req, res) => {
  console.log("dasdasdasdasda")
  var id = req.params.id;
  var o_id = new mongoDB.ObjectID(id);

  db.getDB().collection(collection).findOne({ _id: o_id})
    .then(catFound => {
      if (!catFound) {
        return res.status(404).end();
      }
        return res.status(200).json(catFound)
    })
    .catch(err => console.log(err));
});

// update category
router.post('/update/',auth, function (req, res) {
  console.log(res.body)
  var cat = {
    categories: req.body.categories,
    name: req.body.name
  }

  var id = req.body.id;

  db.getDB().collection(collection).updateOne({ "_id": mongoDB.ObjectID(id) }, { $set: cat }, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      db.closeDb();
    }
  });
});

// delete category
router.delete('/delete/:id',auth, function (req, res) {
  // console.log(req.params.id)
  var id = req.params.id;
  db.getDB().collection(collection).deleteOne({ _id: new mongoDB.ObjectId(id) }, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
})

module.exports = router;