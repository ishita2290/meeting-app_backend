const mongoose =require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    hash:{ type: String, required: true },
    firstName: { type: String, required: false },
    lastName:{ type: String, required: false },
    dateOfBirth:{ type: Date, required: false },
    age:{type:Number},
    email:{ type: String, required: true },
    age:{ type: String, required: false },
    city:{ type: String, required: false },
    telephone:{ type: String },
    gender:{ type: String,default:"N/A",enum:["Male","Female","N/A"]},
    image:{type:Buffer},
    bio:{type:String,max:255},
    city:{type:String},
    country:{type:String},
    resetToken:String,
    expireToken: Date,
});

module.exports = UserSchema;