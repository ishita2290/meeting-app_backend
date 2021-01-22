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


// get data organized by provided user
router.get('/get-organized-events', async (request, response) => {

    try {
        if (typeof request.query.user !== 'undefined' && request.query.user !== '') {
            var user = JSON.parse(request.query.user);

            var ObjectId = mongoose.Types.ObjectId;

            const events = await Event.find({ organizer: new ObjectId(user._id)});

            if (events.length > 0) {
                response.json({status: true, events: events});
            } else {
                response.json({status: false});
            }
        } else {
            response.json({status: false});
        }
    } catch (error) {
        console.error(error);
        response.json({status: false});
    }

});

// get data organized by provided user
router.get('/get-attended-events', async (request, response) => {

   try {
        if (typeof request.query.user !== 'undefined' && request.query.user !== '') {
            var user = JSON.parse(request.query.user);

            var ObjectId = mongoose.Types.ObjectId;

            const eventAttended = await Event.find({ participants: new ObjectId(user._id) });

            if (eventAttended.length > 0) {
                response.json({status: true, events: eventAttended});
            } else {
                response.json({status: false});
            }
        } else {
            response.json({status: false});
        }
    } catch (error) {
        console.error(error);
        response.json({status: false});
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