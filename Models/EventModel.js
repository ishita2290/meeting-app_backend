const mongoose = require('mongoose');
const EventSchema = require('./EventSchema');

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;