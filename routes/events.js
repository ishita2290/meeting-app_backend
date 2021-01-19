const router = require('express').Router();
const { builtinModules } = require('module');
const mongoose = require('mongoose');
const Event = require('../Models/EventModel');


// router.post('/add-new-event', (request, response) => {

//     Event.create(request.body).then(() =>  {
//         console.log('it worked')
//         response.status(201).json(
//             {
//                 status: 'New Event added',
//                 data: {
//                     event: Event //???                                                  
//                 }
//             })
//     })                                                          
//       .catch(error => response.status(400).json({
//         status: 'fail',
//         message: error
//     }));
       
// });

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

router.get("/get-event/:id" , async (request, response) => {
    const singleEvent = await Event.findById(request.params.id);
    if(!singleEvent){
       return response.send('not correct id')
    }
    response.send(singleEvent)
})



module.exports = router;