const mongoose = require('mongoose');
const User = require('../UserModel');

const EventSchema = new mongoose.Schema({
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, // dynamic, must correspond with logged-in user
    eventName: { type: String, required: true, unique: true },
    startingDate: { type: Date, required: true },
    timeFrom: { type: String, required: true },
    timeTo: { type: String, required: true },
    online: { type: Boolean, required: true },
    place: { type: String },
    street: { type: String },
    postalCode: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, unique: true },
    category: { type: String, enum: ['music', 'books', 'sport', 'languages', 'other'], required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref:User }]
});

module.exports = EventSchema;