const mongoose = require("mongoose");
const UserSchema = require("../Schemas/UserSchema");


const User = mongoose.model("Users",UserSchema);


module.exports = User;