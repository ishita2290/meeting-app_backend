const mongoose = require('mongoose');
const User = require('../UserModel');

const EventSchema = new mongoose.Schema({
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: User, required: false }, // dynamic, must correspond with logged-in user
    eventName: { type: String, required: true, unique: true },
    startingDate: { type: Date, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    online: { type: Boolean, required: true },
    // location: { // GeoJSON https://mongoosejs.com/docs/geojson.html
    //     type: {
    //         type: String, 
    //         enum: ['Point'] // 'location.type' must be 'Point'
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: false
    //     }
    // },
    address: {
        place: { type: String },
        street: { type: String },
        postalCode: { type: Number },
        city: { type: String },
        country: { type: String },
    },
    description: { type: String, unique: true },
    category: { type: String, enum: ['music', 'books', 'sport', 'learning languages', 'other'] },
    //participants: { type: [mongoose.Schema.Types.ObjectId] } // dynamic 
});

module.exports = EventSchema;