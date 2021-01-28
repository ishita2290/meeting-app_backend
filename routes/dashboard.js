

const express=require("express");
const passport = require("passport");

const router = express.Router();

router.get("/view",passport.authenticate("jwt",{session:false}),(request,response)=>{
    console.log(request.cookies)

    response.send("got it")
})

module.exports = router;