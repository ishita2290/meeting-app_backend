const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { jwtIssuer } = require("../utils/jwtIssuer");
const {authenticatetoken} = require("../middleware/auth")
const jwt = require("jsonwebtoken");

router.post("/register", async (request, response) => {
  console.log(request.body);
  const { username, email, password } = request.body;
  const user = await User.findOne({ email });

  if (user !== null) {
    return response.status(500).send("User already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.create({
    username,
    email,
    hash,
  });
  response.status(200).send("User does not exist");
});

// router.get("/users", authenticatetoken, (req, res) => {
//   res.json(users.filter((user) => user.username === req.body.username));
// });

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (user === null) {
    return response.status(500).send("User doesnot exist");
  }

  const match = await bcrypt.compare(password, user.hash);

  if (!match) {
    return response.status(500).send("password doesnot match");
  }

  const token = jwtIssuer(user);
  response.status(200).send(token);
});

router.post("reset-password",(req,res)=>{
  crypto.randomBytes(32,async(err,buffer)=>{
    if(err){
      console.log(err)
    }
    const token = buffer.toString("hex")
   const getUser = await User.findOne({email})
   if(!getUser){
     return res.status(400).send("user does not exist")
   }
    getUser.resetToken =  token;
    getUser.expireToken =  Date.now() + 3600000
  })
})


module.exports = router;
