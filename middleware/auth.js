const  jwt = require('jsonwebtoken');
const config = require('config')

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

//   console.log(authHeader)

  if (authHeader) {
      const token = authHeader.split(' ')[1];

    //   console.log(token +"prosledjeni")
    //   console.log(config.get('jwtSecret'))
      jwt.verify(token,config.get('jwtSecret'), (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

module.exports = authenticateJWT;