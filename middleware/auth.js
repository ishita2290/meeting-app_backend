const jwt =require("jsonwebtoken");

function authenticatetoken(req, res, next) {
    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split("")[1];
    console.log(req.cookies.jwt);
    const token = req.cookies.jwt
    if (token === null) return res.status(401).send('not authorized');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send('not authorized');
      }
      req.user = user;
      next();
    });
    // Bearer TOKEN
  }

  module.exports = authenticatetoken
