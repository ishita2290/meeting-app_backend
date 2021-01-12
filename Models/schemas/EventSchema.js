const mongoose = require('mongoose');
const User = require('../UserModel');

const EventSchema = new mongoose.Schema({
    //organizer: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // dynamic, must correspond with logged-in user
    eventName: { type: String, required: true, unique: true },
    startingDate: { type: Date, required: true },
    finishingDate: { type: Date },
    online: { type: Boolean },
    location: { // GeoJSON https://mongoosejs.com/docs/geojson.html
        type: {
            type: String, 
            enum: ['Point'] // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    description: { type: String },
    category: { type: String, enum: ['culture', 'sport', 'learning languages', 'other'] },
    //participants: { type: [mongoose.Schema.Types.ObjectId] } // dynamic 
});

module.exports = EventSchema;