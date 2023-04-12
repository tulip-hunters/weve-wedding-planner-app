const router = require("express").Router();
const mongoose = require("mongoose");

const Venue = require("../models/Venue.model")
const Reservation = require("../models/Reservation.model");
const { response } = require("express");


//CREATE venue
router.post("/venues", (req, res, next) => {
    const { name, description, address, price, capacity, imageUrl, offers, reservation, owner } = req.body;

    Venue.create({name, description, address, price, capacity, imageUrl, offers, reservation: [], owner: [] })
    .then(response => res.status(201).json(response))
    .catch(err => {
        console.log("error creating a new venue", err);
        res.status(500).json({
            message: "error creating a new venue",
            error: err
        });
    })
});

//DISPLAY ALL venues
router.get("/venues", (req, res, next) => {
    Venue.find()
    //.populate("reservations")
    .then(venuesFromDB => {
        res.json(venuesFromDB);
    })
    .catch(err => {
        console.log("error getting list of venues", err);
        res.status(500).json({
            message: "error getting list of venues",
            error: err
        });
    })
})

//DISPLAY DETAILS venue
router.get("/venues/:venueId", (req, res, next) => {
    const { venueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(venueId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Venue.findById(venueId)
    //.populate('reservations')
    .then(venue => res.json(venue))
    .catch(err => {
        console.log("error getting details of a venue", err);
        res.status(500).json({
            message: "error getting details of a venue",
            error: err
        });
    })
});

//UPDATE venue
// router.put('/venues/:venueId', (req, res, next) => {
//     const { venueId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(venueId)) {
//         res.status(400).json({ message: 'Specified id is not valid' });
//         return;
//     }

//     Venue.findByIdAndUpdate(venueId, req.body, { new: true })
//         .then((updatedVenue) => res.json(updatedVenue))
//         .catch(err => {
//             console.log("error getting details of a venue", err);
//             res.status(500).json({
//                 message: "error getting details of a venue",
//                 error: err
//             });
//         })
// });

//DELETE venue
// router.delete('/venues/:venueId', (req, res, next) => {
//     const { venueId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(venueId)) {
//         res.status(400).json({ message: 'Specified id is not valid' });
//         return;
//     }

//     Venue.findByIdAndRemove(venueId)
//     .then( deletedVenue => {
//       return Reservation.deleteMany( { _id: { $in: deletedVenue.reservations } } );
//     })
//     .then(() => res.json({ message: `Venue with id ${venueId} & all associated reservations were removed successfully.` }))
//     .catch(error => res.status(500).json(error));
// });

module.exports = router;