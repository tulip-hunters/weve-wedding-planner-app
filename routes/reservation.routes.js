const router = require("express").Router();
const mongoose = require("mongoose");


const Reservation = require("../models/Reservation.model");
const Venue = require("../models/Venue.model");



//Create Reservation
router.post("/reservations" , ( req, res, next ) => {
    const { title, weddingDate, guestsNumber } = req.body;

    Reservation.create({title, weddingDate, guestsNumber, owner, venue: [] })
    .then(reservationFromDB => {
        return Venue.findByIdAndUpdate(venueId, { $push: { reservations: reservationFromDB._id } });
    })
    .then(response => res.status(201).json(response))
    .catch(err => {
        console.log("error creating a new reservation", err);
        res.status(500).json({
            message: "error creating a new reservation",
            error: err
        });
    })
});

// All Reservations

