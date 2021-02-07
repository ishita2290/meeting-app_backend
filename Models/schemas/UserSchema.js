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
    country:{ type: String, required: false },
    telephone:{ type: String },
    gender:{ type: String,default:"N/A",enum:["Male","Female","N/A"]},
    image:{type:Buffer},
    bio:{type:String,max:255},
<<<<<<< HEAD
    city:{type:String},
    country:{type:String},
    photo:{type:String},
=======
    // events:[
    //     {type:mongoose.Schema.Types.ObjectId,
    //      ref:"events"}
    // ]
>>>>>>> 6911d9caa65954cb8aba28db4fc12f1827e24f8c
   
    resetToken:String,
    expireToken: Date,
    events: [{ type: mongoose.Schema.Types.ObjectId,ref:"events" }]
});

module.exports = UserSchema;