const mongoose =require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    hash:{ type: String, required: true },
    firstName: { type: String, required: false },
    lastName:{ type: String, required: false },
    dateOfBirth:{ type: Date, required: false },
    email:{ type: String, required: true },
    age:{ type: String, required: false },
    city:{ type: String, required: false },
    telephone:{ type: String },
    gender:{ type: String,default:"N/A",enum:["Male","Female","N/A"]},
    image:{type:Buffer},
    bio:{type:String,max:255},
    resetToken:String,
    expireToken: Date,
    events: [{ type: mongoose.Schema.Types.ObjectId,ref:"events" }]
});

module.exports = UserSchema;