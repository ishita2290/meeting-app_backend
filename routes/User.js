const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { jwtIssuer } = require("../utils/jwtIssuer");
const { authenticatetoken } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/register", async (request, response) => {
  console.log(request.body);
  const { username, email, password, gender } = request.body;
  const user = await User.findOne({ email });

  if (user !== null) {
    return response.status(500).send("User does not exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.create({
    username,
    email,
    hash,
    gender,
  });
  response.status(200).send("User created");
});

// router.get("/users", authenticatetoken, (req, res) => {
//   res.json(users.filter((user) => user.username === req.body.username));
// });


router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  console.log(user);
  if (user === null) {
    return response.status(500).send("User doesnot exist");
  }

  const match = await bcrypt.compare(password, user.hash);
  console.log(match);
  if (!match) {
    return response.status(500).send("password doesnot match");
  }

  const token = jwtIssuer(user);
  response
    .cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
    })
    .send("logged In");
});


/**
 * Back-end endpoint to get auth user through token
 * 
 */
router.post("/get-auth-user", async (request, response) => {
  // Get all cookie
  cookies = request.cookies;

  // if type of cookie jwt  is not undefined
  if (typeof cookies.jwt != 'undefined') {

    // Get jwt token from wookies
    jwt_token = cookies.jwt.token;

    // Verify and decode token
    jwt.verify(jwt_token, process.env.ACCESS_TOKEN_SECRET, async (err, user_token) => {
      if (err) {
        console.error(err);
        response.json({status: false});
      } else {
        // Get user info from jwt token
        user_id = user_token.sub;

        // get User info from user ID (user_token.sub)
        user = await User.findOne({ _id: user_id});

        response.json({status: true, user: user});
      }
    });
  } else {
    // return error: user is not logged in
    response.json({status: false});
  }

    // return user info

});

router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(400).send("user does not exist");
    }
    getUser.resetToken = token;
    getUser.expireToken = Date.now() + 3600000;
  });
});

router.get("/", (request, response) => {
  console.log(response);
  response.render("/user/getUser", { user: new User() });
});
// router.get("/", async (req, res) => {

//   let searchOptions ={}
//   if(req.query.name!== null && req.query.name !== ""){
//       searchOptions.name = new RegExp(req.query.name, 'i')
//   }
//   try{
//       const users = await User.find(searchOptions)
//       res.render('users/id',{users})
//   }catch{
//       res.redirect('/');
//   }
//   });

module.exports = router;
