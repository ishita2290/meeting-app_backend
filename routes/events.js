const router = require('express').Router();
const { response } = require('express');
const { builtinModules } = require('module');
const mongoose = require('mongoose');
const Event = require('../Models/EventModel');
const  auth  = require("../middleware/auth");

router.post('/add-new-event', auth, async (request, response) => {

    try {
        const {
            eventName,
            startingDate,
            timeFrom,
            timeTo,
            online,
            place,
            street,
            postalCode,
            city,
            country,
            description,
            category
        } = request.body;

        const createNewEvent = await Event.create({
            organizer: request.user.sub,
            eventName,
            startingDate,
            timeFrom,
            timeTo,
            online,
            place,
            street,
            postalCode,
            city,
            country,
            description,
            category,
        });
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
        response.status(400).send('backend error');
    }
       
});

// get data organized by provided user
router.get('/get-organized-events', auth, async (request, response) => {

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


// router.get("/get-event/:id", async (request, response) => {
//   const singleEvent = await Event.findById(request.params.id);
//   if (!singleEvent) {
//     return response.send("not correct id");
//   }
//   response.send(singleEvent);
// });

// // get data organized by provided user
// router.get("/get-organized-events", async (request, response) => {
//   try {
//     if (
//       typeof request.query.user !== "undefined" &&
//       request.query.user !== ""
//     ) {
//       var user = JSON.parse(request.query.user);

//       var ObjectId = mongoose.Types.ObjectId;

//       const events = await Event.find({ organizer: new ObjectId(user._id) });

//       if (events.length > 0) {
//         response.json({ status: true, events: events });
//       } else {
//         response.json({ status: false });
//       }
//     } else {
//       response.json({ status: false });
//     }
//   } catch (error) {
//     console.error(error);
//     response.json({ status: false });
//   }
// });

// get data organized by provided user
router.get("/get-attended-events", async (request, response) => {
  try {
    if (
      typeof request.query.user !== "undefined" &&
      request.query.user !== ""
    ) {
      var user = JSON.parse(request.query.user);

      var ObjectId = mongoose.Types.ObjectId;

      const eventAttended = await Event.find({
        participants: new ObjectId(user._id),
      });

      if (eventAttended.length > 0) {
        response.json({ status: true, events: eventAttended });
      } else {
        response.json({ status: false });
      }
    } else {
      response.json({ status: false });
    }
  } catch (error) {
    console.error(error);
    response.json({ status: false });
  }
});

// get data based on event's name

router.get("/search-events/name/:query/:numOfResults/:skipResults", async (request, response) => {
  const { query } = request.params;
  const numOfResults = request.params.numOfResults || 10;
    const skipResults = request.params.skipResults || 0;

  try {
    const nameWhichContains = query;
    const regex = new RegExp(nameWhichContains, "i");
    const events = await Event.find({ eventName: { $regex: regex } }).limit(Number(numOfResults)).skip(Number(skipResults));
    response.json(events);
  } catch (error) {
    console.error(error);
  }
});

// get data based on category

router.get(
  "/search-events/category/:category/:numOfResults/:skipResults",
  //
  async (request, response) => {
    const category = request.params.category;
    const numOfResults = request.params.numOfResults || 10;
    const skipResults = request.params.skipResults || 0;
    

    //skip method

    try {
      const events = await Event.find({ category }).limit(Number(numOfResults)).skip(Number(skipResults));
     

      response.json(events);
    } catch (error) {
      console.error(error);
    }
  }
);

// get data - only online events

router.get("/search-events/online", async (request, response) => {
  try {
    const events = await Event.find({ online: true });
    response.json(events);
  } catch (error) {
    console.error(error);
    response.status(404).send("/here was an error");
  }
});

// get data based on address

router.get('/search-events/test/:city/:country', async (request, response) => {
    const city = request.params.city;
    const country = request.params.country;

    try {
        const events = await Event.find({ city, country });
        response.json(events);
    }
    catch (error) {
        console.error(error);
    }

});

router.get('/get-event/:id', async (request, response) =>  {
    const id = request.params.id;

    try {
        const event =  await (await Event.findById(id).populate('organizer').populate('participants'));
        if (!event) {
            return response.status(404).json({
                message: "Event not found"
            })
        }
        response.json({
            event
        });
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;
