const router = require('express').Router();
const { builtinModules } = require('module');
const mongoose = require('mongoose');
const Event = require('../Models/EventModel');

router.post('/add-new-event', async (request, response) => {

    try {
        const createNewEvent = await Event.create(request.body);
        //console.log('it worked');
        response.status(201).json(
            {
                status: 'New Event added',
                data: createNewEvent                                     
            }
        )
    }
    catch (error) {
        console.error(error);
    }
       
});

// get data based on event's name

router.get('/search-events/name/:query', async (request, response) => {

    const {query} = request.params;

    try {
        const nameWhichContains = query;
        const regex = new RegExp(nameWhichContains, 'i');
        const events = await Event.find({eventName: {$regex: regex}});
        response.json(events);
    }
    catch (error) {
        console.error(error);
    }

});

// get data based on category

router.get('/search-events/category/:category', async (request, response) => {

    const category = request.params.category;

    try {
        const events = await Event.find({category});
        response.json(events);
    }
    catch (error) {
        console.error(error);
    }

});

// get data - only online events

router.get('/search-events/online', async (request, response) => {

    try {
        const events = await Event.find({online: true});
        response.json(events);
    }
    catch (error) {
        console.error(error);
        response.status(404).send('/here was an error')
    }

});

//get data based on city

// router.get('/search-events/city/:city', async (request, response) => {

//     const {city} = request.params;

//     try {
//         const events = await Event.find({city});
//         response.json(events);
//     }
//     catch (error) {
//         console.error(error);
//     }

// });

module.exports = router;