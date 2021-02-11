const express = require("express");
const router = express.Router();
const app = express();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { jwtIssuer } = require("../utils/jwtIssuer");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const Event = require("../Models/EventModel");
// const { authenticate } = require("passport");
const { response } = require("express");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const fileUpload = require("express-fileupload");
app.use(fileUpload());


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

    if (!password) {
      return response.status(500).send("No password");
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
    response.status(500).json({ msg: "server error", error });
  }
});

// login

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  console.log("user", user);
  if (!user) {
    return response.status(500).send("User doesnot exist");
  }

  const match = await bcrypt.compare(password, user.hash);
  console.log(match);
  if (!match) {
    return response.status(500).send("password doesnot match");
  }

  const token = jwtIssuer(user);
  console.log("login token : ", token);
  response
    .cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
    })
    .send("logged In");
});

router.post("/logout", async (request, response) => {
  response.clearCookie("jwt").send("logged out");
});

// forget password
router.post("/forgetPassword", async (request, response) => {
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
  try {
    const token = jwt.sign(payload, process.env.RESETPASSWORD_SECRET, {
      expiresIn: "60m",
    });

    console.log(token);
    user.resetToken = token;
    user.expireToken = Date.now() + 1 * 60 * 60 * 1000; //(1 * 60 * 1000)
    await user.save();
    console.log("user data : ", user);
    const resetUrl = `http://localhost:3000/resetPassword/${token}`;
    const message = `Forgot your password? click on the link and submit your new password and password confirmation to ${resetUrl} \n \n if you didn't forget your password please ignore this email  `;

    // try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset link valid for 60 minutes ",
      text: message,
    });
    response
      .status(200)
      .json({ msg: "you received email to change your password" });
  } catch (error) {
    response.status(500).json({ message: "error has occured", error });
  }
});
router.post("/resetPassword/:token", async (request, response) => {
  console.log(request.body);
  const token = request.params.token;

  const user = await User.findOne({
    resetToken: request.params.token,
  expireToken: { $gt: Date.now() },
  });
  if (!user) {
    return response
      .status(500)
      .json({ msg: "Token is invalid or already expired" });
  } else {
    response.send(`You may reset your Password`);
  }
});

// generate new password
router.post("/newpassword", async (request, response) => {
  const { password, token } = request.body;
  try {
    const data = await User.findOne({ resetToken: token });
    console.log(data);
    if (!data) {
      return response
        .status(400)
        .json({ msg: "Token is invalid or already expired" });
    }

    console.log("pass", password);
    const salt = await bcrypt.genSalt(10);
    data.hash = await bcrypt.hash(password, salt);
    data.resetToken = "";
    console.log("data after save", data);
    await data.save();

    return response.status(200).json({ msg: "Password Resetted successfully" });
  } catch (error) {
    response.status(500).json({ msg: "Error with resetting password" });
  }
});

// upload profile picture

router.post("/upload", auth, async (request, response) => {
  console.log(request.body);
  const userId = request.user.sub;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return response.status(500).json({ msg: "Server error" });
  }

  console.log(54, request.files);

  if (request.files === null) {
    // photo.save()
    return response.status(400).json({ msg: ` file not uploaded`, user });
  }

  const file = request.files.file;
  const newPath = `${Date.now()}-${file.name}`;
  file.mv(`${__dirname}/../../meeting-app-frontend/public/uploads/${newPath}`, (err) => {
    if (err) {
      console.log(err);
      return response.status(500).send(err);
    }
    user.photo = newPath;

    user.save();
    response.json({
      fileName: newPath,
      filePath: `/uploads/${newPath}`,
      msg: ` you updated your data `,
      user,
    });
  });
});


//get new password
router.get("/newpassword/:token", async (request, response) => {
  const token = request.params.token;
  const data = await User.findOne({ resetToken: token });
  if (!data) {
    return response
      .status(400)
      .json({ msg: "Token is invalid or already expired" });
  }
  response.status(200).json({ msg: "enter new password" });
});

router.get("/dashboard", auth, async (request, response) => {
  const userId = request.user.sub;
  const user = await User.findById(userId).select("-hash");

  response.send(user);
});

/// attend an event for logged in user
router.get("/attend-an-event/:id", auth, async (request, response) => {
  const userId = request.user.sub;
  try {
    const event = await Event.findByIdAndUpdate(
      request.params.id,
      { $addToSet: { participants: userId } },
      { new: true }
    );

    console.log(999, userId, event);
    /* const user = await User.findByIdAndUpdate(userId,
        { $addToSet :{ events :request.params.id  }},
        { new : true}
        
      )    */

    if (!event) {
      return response.send("the event is not exist anymore");
    }

    response.json({ msg: "you attended successfully", event });
  } catch (error) {
    console.log(error);
  }
});
/**
 * Back-end endpoint to get auth user through token
 *
 */
router.get("/get-auth-user", auth, async (request, response) => {
  // Get all cookie
  cookies = request.cookies;

  // if type of cookie jwt  is not undefined
  if (typeof cookies.jwt != "undefined") {
    // Get jwt token from cookies
    jwt_token = cookies.jwt;

    // Verify and decode token
    jwt.verify(
      jwt_token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user_token) => {
        if (err) {
          console.error(err);
          response.json({ status: false });
        } else {
          // Get user info from jwt token
          user_id = user_token.sub;

          // get User info from user ID (user_token.sub)
          user = await User.findOne({ _id: user_id });

          // return user info
          response.json({ status: true, user: user });
        }
      }
    );
  } else {
    // return error: user is not logged in
    response.json({ status: false });
  }
});

/**
 * Back-end endpoint to update user
 *
 */
router.post("/update-user", auth, async (request, response) => {
  const user_id = request.user.sub;

  const user = await User.findOne({ _id: user_id });

  user.firstName = request.body.firstName;
  user.lastName = request.body.lastName;
  user.email = request.body.email;
  user.age = request.body.age;
  user.city = request.body.city;
  user.country = request.body.country;
  user.telephone = request.body.telephone;
  user.gender = request.body.gender;
  user.bio = request.body.bio;

  if (user.save()) {
    response.json({ status: true, message: "Changes saved" });
  } else {
    response.json({ status: false });
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
// router.get('/dashboard' , authenticatetoken,(request,response)=>{
//     response.send(request.user)
// })

module.exports = router;
