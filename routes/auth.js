const express = require('express')
const router = express.Router()
const config = require('config')
const  jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt')
const db = require('../db')
const collection = "users";

router.post('/login',  (req, res) => {
  const { username, password } = req.body;

    db.getDB().collection(collection).findOne({ username: username}, function(err, user) {
      try{
        if(err) {
          res.json(err)
        } else{
        bcrypt.compare(password, user.pass).then(isMatch=> {

             if (isMatch) {
                const token =  jwt.sign({ id: user._id }, config.get('jwtSecret'), { expiresIn: 18000 });
                if (!token) throw Error('Couldnt sign the token');
                res.json({token});
                console.log("salje usera")
            } else {
                return res.json({ msg: "Invalid credencial" })
            }
            
        })  
      }  
    }catch(err){
      return res.json({korisniknotfound: "User does not exist."})
  }  
 });  
 
});

module.exports = router;