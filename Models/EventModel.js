const mongoose = require('mongoose');
const EventSchema = require('./schemas/EventSchema');

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;