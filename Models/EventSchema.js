const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    organizator: { type: String, required: yes }, // dynamic, must correspond with logged-in user
    eventName: { type: String, required: yes },
    startingDate: { type: Date, required: yes },
    finishingDate: { type: Date },
    online: { type: Boolean, required: yes },
    location: { // GeoJSON https://mongoosejs.com/docs/geojson.html
        type: {
        type: String, 
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
        },
        coordinates: {
        type: [Number],
        required: true
        }
    },
    description: { type: String },
    category: { type: Array, required: yes, enum: ['culture', 'sport', 'learning languages', 'other'] },
    participants: { type: Array } // dynamic
});

module.exports = EventSchema;