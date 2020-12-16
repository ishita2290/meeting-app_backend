//const router = require('express').Router();
// const mongoose = require('mongoose');

// let Event = require('../Models/EventModel');

// router.get('/', (request, response) => {
//     Event.find()
//         .then(events => response.json(events))
//         .catch(error => response.status(400).json(`Error: ${error}`));
// });

// router.post('/add-new-event', (request, response) => {
//     const event = request.body.username;
//     const newEvent = new Event({event});

//     newEvent.save()
//         .then(() => response.json('New Event added'))
//         .catch(error => response.status(400).json(`Error: ${error}`))
// });