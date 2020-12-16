const mongoose =require("mongoose");

const UserSchema = new mongoose.Schema({
    username:{ type: String, required: true },
    hash:{ type: String, required: true },
    firstName: { type: String, required: true },
    lastName:{ type: String, required: true },
    dateOfBirth:{ type: Date, required: true },
    email:{ type: String, required: true },
    telephone:{ type: String },
    gender:{ type: String,default:"N/A",enum:["Male","Female","N/A"]},
});

module.exports = UserSchema;