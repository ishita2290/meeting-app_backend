const jsonwebtoken = require("jsonwebtoken");
const User = require("../Models/UserModel");

const dotenv = require('dotenv');
dotenv.config();

// function jwtIssuer(user){

// // const expiresIn = "id";

// const payload ={
//     sub: user._id,
//     iat:Date.now(),
//     exp:Date.now() + 500000
// }

// const signedToken = jsonwebtoken.sign(payload,process.env.ACCESS_TOKEN_SECRET);

// return{
//         token:`${signedToken}`,
//     // expiredIn
// }
// }
function jwtIssuer(user){

    // const expiresIn = "id";
    
    const payload ={
        sub: user._id,
        iat:Date.now(),
        exp:Date.now() + 500000
    }
    
    const signedToken = jsonwebtoken.sign(payload,process.env.ACCESS_TOKEN_SECRET);
    
    return signedToken
        // expiredIn
    
    }

module.exports ={jwtIssuer}