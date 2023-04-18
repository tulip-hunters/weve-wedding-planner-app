const router = require("express").Router();
const mongoose = require("mongoose");

const Reservation = require("../models/Reservation.model");
const Venue = require("../models/Venue.model");
const User = require("../models/User.model");

const attachCurrentUser = require("../middleware/attachCurrentUser");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//Create Reservation
router.post("/reservations", isAuthenticated, async (req, res, next) => {
  const { title, weddingDate, guestsNumber, venue, user } = req.body;
  console.log(req.payload);
  if (!weddingDate) {
    return res.status(400).json({ message: "Please provide Wedding date" });
  } else if (!title) {
    return res.status(400).json({ message: "Please provide title" });
  } else if (!guestsNumber) {
    return res.status(400).json({ message: "Please provide number of guests" });
  }

  try {
    const reservation = await Reservation.create({
      title,
      weddingDate,
      guestsNumber,
      user: req.payload._id,
      venue,
    });

    const updateVenue = await Venue.findByIdAndUpdate(
      venue,
      {
        $push: { reservations: reservation._id },
      },
      { new: true }
    );

    const userUpdate = await User.findByIdAndUpdate(
      user,
      {
        $push: { reservations: reservation._id },
      },
      { new: true }
    );

    return res.status(201).json(reservation);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// All User Reservations
router.get("/my-reservations", isAuthenticated, (req, res, next) => {
  Reservation.find({ user: req.payload._id })
    .populate("venue")
    .then((allReservations) => {
      if (allReservations.length === 0) {
        res.status(200).json({ message: "Tere are no Reservations" });
      } else {
        res.json(allReservations);
      }
    })
    .catch((err) => {
      console.log("error getting list of reservations...", err);
      res.status(500).json({
        message: "error getting list of reservations",
        error: err,
      });
    });
});

// Get reservation by id
router.get(
  "/reservations/:reservationId",
  isAuthenticated,
  (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Reservation.findById(reservationId)
      .populate("venue")
      .then((reservation) => res.status(200).json(reservation))
      .catch((err) => {
        console.log("error getting a reservation details...", err);
        res.status(500).json({
          message: "error getting a reservation details",
          error: err,
        });
      });
  }
);

//Update reservation by id
router.put(
  "/reservations/:reservationId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Reservation.findById(req.params.reservationId)
      .then((reservationDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(reservationDetails.user)
        ) {
          Reservation.findByIdAndUpdate(reservationId, req.body, { new: true })
            .then((updatedReservation) => {
              res.json(updatedReservation);
            })
            .catch((err) => {
              console.log("error updating a house...", err);
              res.status(500).json({
                message: "error updating a house",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can updated only thier own data. Please check the data you are updating!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error getting reservation details from DB", err);
        next();
      });
  }
);

// Delete own reservation
router.delete(
  "/reservations/:reservationId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Reservation.findById(req.params.reservationId)
      .then((reservationDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(reservationDetails.user)
        ) {
          Reservation.findByIdAndDelete(reservationId)
            .then(() =>
              res.json({
                message: `Reservation with ${reservationId} is removed successfully`,
              })
            )
            .catch((err) => {
              console.log("error deleting a reservation...", err);
              res.status(500).json({
                message: "error deleting a reservation",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can delete only thier own reservation. Please check the reservation you are deleting!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error deleting reservation details from DB", err);
        next();
      });
  }
);

module.exports = router;
