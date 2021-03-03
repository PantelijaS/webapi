const express = require('express')
const router = express.Router()
const mongoDB = require('mongodb')
const db = require('../db')
const collection = "products";
const multer = require('multer')
const auth =  require('../middleware/auth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './routes/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage:storage})

// get all products
router.get('/', auth,(req, res) => {
  db.getDB().collection(collection).find().toArray((err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});



router.post('/add', auth, upload.single('image'),function (req,res){
  console.log(req.body.categories)
  console.log(req.body.categories)
  console.log(req.body.content)
  console.log(req.file)
  // var product = req.body;
  var product ={
      name: req.body.name,
      categories: req.body.categories,
      content: req.body.content,
      image: req.file.originalname     
  }
  db.getDB().collection(collection).insertOne(product, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
      db.closeDb();
    }
  });
});

// get id products
router.get('/:id', auth,(req, res) => {
  var id = req.params.id;
  var o_id = new mongoDB.ObjectID(id);

  db.getDB().collection(collection).findOne({ _id: o_id})
    .then(prodFound => {
      if (!prodFound) {
        return res.status(404).end();
      }
        return res.status(200).json(prodFound)
    })
    .catch(err => console.log(err));
});

// update products
router.post('/update/:id', auth, upload.single("image"), function (req, res) {
  console.log(req.body.categories)
  console.log(req.body.categories)
  console.log(req.body.content)
  console.log(req.file)
  console.log(req.body.name)
  console.log(req.params.id)
  //   var product = {
  //       name: req.body.name,
  //       categories: req.body.categories,
  //       content: req.body.content,
  //       image: req.file.originalname     
  //     }

  // const id = req.body.id;

  db.getDB().collection(collection).updateOne({ "_id": mongoDB.ObjectID(req.params.id) }, { $set: {name:req.body.name, categories:req.body.categories,content:req.body.content, image:req.file.originalname  }}, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// delete products
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