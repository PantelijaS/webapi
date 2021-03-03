const express = require('express')
const router = express.Router()
const config = require('config')
const axios = require('axios');
const https = require('https');
const db = require('../db')
const collection = "aadata";
const auth =  require('../middleware/auth');

// var url ='https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key='+config.get('apiKey');

// get unitName  and update lat,lng
router.get('/api', auth, async (req, res) => {
  makeGetRequest();
  setTimeout(function cb(){
  db.getDB().collection(collection).find().toArray((err, result) => {
    if (err) {
      res.json(err);
    } else {
      result.forEach(element => {
        var unitName = element.unitName
        getRequestGeo(unitName);  // potrebno je odkomentarista kad se zavrsi aplikacija

      });
    }
  });
  setTimeout( function cb() {
  db.getDB().collection(collection).find().toArray((err,result) =>{
    if(err){
      res.json(err)
    }else{

        res.json(result)
    }
  });
}, 2000);
},
2000)
});


async function makeGetRequest() {
  const url = ('https://www.vantetider.se/api/Ajax/GetWaitingAndCapacityByService/141');

  https.get(url, (res) => {
    var body = ''
    var Chunk = []
    res.on('data', (chunk) => {
      Chunk.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(Chunk)
    }).on('end', () => {
      let obj = JSON.parse(body)
      obj.aaData.forEach(element => {
        element["processing"] = false
        db.getDB().collection(collection).insertOne(element);
      });
    })
  })
}

async function getRequestGeo(unitName) {

    axios.get('https://maps.googleapis.com/maps/api/geocode/json?',{
        params:{
            address: unitName,
            key:config.get('apiKey')
        }
    }).then(function(response){

        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;

        db.getDB().collection(collection).updateOne({ "unitName": unitName }, { $set: { lat: lat, lng: lng, processing: true } }, function (err, result) {
        db.closeDb();
      });
    });

}

module.exports = router;