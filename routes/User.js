const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { jwtIssuer } = require("../utils/jwtIssuer");
const { authenticatetoken } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const { response } = require("express");
const sendEmail = require("../utils/sendEmail");

router.post("/register", async (request, response) => {
  console.log(request.body);
  try {
  const {
    username,
    email,
    password,
    gender,
    age,
    city,
    country,
    telephone,
    bio,
  } = request.body;
  const user = await User.findOne({ email });

  if (user) {
    return response.status(500).send("User exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  
    await User.create({
      username,
      email,
      hash,
      gender,
      age,
      city,
      country,
      telephone,
      bio,
    });
    response.status(200).send("User created");
  } catch (error) {
    console.log(error);
    response.status(500).json({ msg:"server error" ,error })
  }

 
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

router.post("/resetPassword", async (req, res) => {
  const { email } = request.body;
  const user = await User.findOne({ email });
  if (!user) {
    return response
      .status(400)
      .json({ msg: "user with this email does not exist" });
  }

  const payload = {
    id: user.id,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, process.env.RESETPASSWORD_SECRET, {
    expiresIn: "30m"},
  );
 
  console.log(token);
    user.passwordResetToken = token;
        user.save();
        const resetUrl = `${request.protocol}://${request.get('host')}/user/resetPassword/${token}`;
        const message = `Forgot your password? click on the link and submit your new password and password confirmation to ${resetUrl} \n \n if you didn't forget your password please ignore this email  `;


  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset link valid for 30 minutes ",
      text: message,
    });
    response
      .status(200)
      .json({ msg: "you received email to change your password" });
  } catch (error) {}
});



/**
 * Back-end endpoint to get auth user through token
 * 
 */
router.get("/get-auth-user", async (request, response) => {
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

        // return user info
        response.json({status: true, user: user});
      }
    });
  } else {
    // return error: user is not logged in
    response.json({status: false});
  }
});

/**
 * Back-end endpoint to update user
 * 
 */
router.post("/update-user", async (request, response) => {
  user = await User.findOne({ _id: request.body.user._id});
  
  user.username = request.body.user.username;
  user.city = request.body.user.city;
  user.age = request.body.user.age;

  if (user.save()) {
    response.json({status: true, message: 'Changes saved'});
  } else {
    response.json({status: false});
  }
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
