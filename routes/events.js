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

router.get('/search-events/:query', async (request, response) => {

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

router.get('/search-events/', async (request, response) => {

       const category = request.query.category

    try {
        const events = await Event.find({category });
        response.json(events);
    }
    catch (error) {
        console.error(error);
    }

});

// get data - only online events



module.exports = router;