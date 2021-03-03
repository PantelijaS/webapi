const MongoClient = require("mongodb").MongoClient;
const config = require('config')
const bcrypt = require('bcrypt')
// name of our database
const dbname = "mydb";

// Options for mongoDB
var database;
const mongoOptions = {useNewUrlParser : true,  useUnifiedTopology: true};


const client = new MongoClient(config.get('mongoUrl'),mongoOptions);
async function run() {
  try {
    await client.connect();
    database = client.db(dbname);
    const collection = database.collection('users');
    collection.findOne({"username": config.get('username')}, function(err, result) {
      if (result) {
        console.log("admin user already exists")
      }else{
        // create salt & hash
        bcrypt.genSalt(10,(err,salt)=> {
          bcrypt.hash(config.get('pass'),salt,(err,hash) =>{
            if (err) {
              throw err
            }else{
              const query = { username: config.get('username'), pass : hash };
              collection.insertOne(query);
            }
          })
        })
       
      }
   });
  } finally {
   console.log("datebase is create")
  }
}

// returns database connection 
const getDB = ()=>{
    return database;
}

const closeDb =()=>{
  return client.close;
}

module.exports = {getDB,run,closeDb};