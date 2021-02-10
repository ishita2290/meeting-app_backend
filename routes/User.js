const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { jwtIssuer } = require("../utils/jwtIssuer");
const  auth  = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const Event = require("../Models/EventModel");
// const { authenticate } = require("passport");
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

  if(!password) {
    return response.status(500).send("No password")
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
  console.log('user',user);
  if (!user) {
    return response.status(500).send("User doesnot exist");
  }

  const match = await bcrypt.compare(password, user.hash);
  console.log(match);
  if (!match) {
    return response.status(500).send("password doesnot match");
  }

  const token = jwtIssuer(user);
  console.log('login token : ', token);
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

router.post("/resetPassword", async (request, response) => {
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
try{
  const token = jwt.sign(payload, process.env.RESETPASSWORD_SECRET, {
    expiresIn: "30m"},
  );
 
  console.log(token);
    user.resetToken = token;
       await user.save();
       console.log('user data : ', user);
        const resetUrl = `${request.protocol}://${request.get('host')}/user/resetPassword/${token}`;
        const message = `Forgot your password? click on the link and submit your new password and password confirmation to ${resetUrl} \n \n if you didn't forget your password please ignore this email  `;


  // try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset link valid for 30 minutes ",
      text: message,
    });
    response
      .status(200)
      .json({ msg: "you received email to change your password" });
  } catch (error) {
    response.status(500).json({message:"error has occured",error})
  }
});

router.post("/new-password", async(request,response)=>{
  const newPassword = request.body.password;
 const token = request.params.token;

 const user = await User.findOne({token,expireToken:{$gt:Date.now()}})
 if(!user){
  return response.status(400).json({message:"Password link is not valid"})
 }
 const salt = await bcrypt.genSalt(10);
 const hash = await bcrypt.hash(password, salt);
 if(hash){
   user.password = hash;
   user.token = undefined;
   user.expireToken=undefined;
 }
 await user.save()
  response.send({username:user.email,message:"Password link accepted"})
})





 
router.get('/dashboard', auth, async (request, response)=>{
 
const userId = request.user.sub;
const user = await User.findById(userId).select('-hash');

response.send(user);

});

/// attend an event for logged in user 
router.get('/attend-an-event/:id', auth, async (request, response)=>{
 
  const userId = request.user.sub;
  try {
    const event = await Event.findByIdAndUpdate(request.params.id,
      { $addToSet :{ participants :userId  }},
      { new : true}
      
    )
      const user = await User.findByIdAndUpdate(userId,
        { $addToSet :{ events :request.params.id  }},
        { new : true}
        
      )        
    
    if(!event){
    return  response.send('the event is not exist anymore')
    }

    response.json({msg: 'you attended successfully' ,event , user })
  } catch (error) {
     console.log(error)
  }
  
  });
/**
 * Back-end endpoint to get auth user through token
 * 
 */
router.get("/get-auth-user",auth, async (request, response) => {
  // Get all cookie
  cookies = request.cookies;

  // if type of cookie jwt  is not undefined
  if (typeof cookies.jwt != 'undefined') {

    // Get jwt token from cookies
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
  
  user.firstName = request.body.user.firstName;
  user.lastName = request.body.user.lastName;
  user.email = request.body.user.email;
  user.age = request.body.user.age;
  user.city = request.body.user.city;
  user.country = request.body.user.country;
  user.telephone = request.body.user.telephone;
  user.gender = request.body.user.gender;
  user.bio = request.body.user.bio;

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
// router.get('/dashboard' , authenticatetoken,(request,response)=>{
//     response.send(request.user)
// })

module.exports = router;
