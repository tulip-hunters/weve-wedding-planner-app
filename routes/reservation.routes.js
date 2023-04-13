const router = require("express").Router();
const mongoose = require("mongoose");


const Reservation = require("../models/Reservation.model");
const Venue = require("../models/Venue.model");

const attachCurrentUser = require("../middleware/attachCurrentUser");
const { isAuthenticated } = require("../middleware/jwt.middleware")


//Create Reservation
router.post("/reservations", isAuthenticated, ( req, res, next ) => {
    const { title, weddingDate, guestsNumber, venue } = req.body;
console.log(req.payload)
    if (!weddingDate) {
        return res.status(400).json({ message: "Please provide Wedding date" });
      } else if (!title) {
        return res.status(400).json({ message: "Please provide title" });
      } else if (!guestsNumber) {
        return res
          .status(400)
          .json({ message: "Please provide number of guests" });
      }

    Reservation.create({title, weddingDate, guestsNumber, user: req.payload._id, venue })
    .then(newReservation => {
        return Venue.findByIdAndUpdate(venue, { $push: { reservations: newReservation._id } });
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

// // All Reservations showed in venue
// router.get("/reservations", (req, res, next) => {
//     Reservation.find()
//       .populate("venue")
//       .then((allReservations) => res.json(allReservations))
//       .catch((err) => {
//         console.log("error getting list of reservations...", err);
//         res.status(500).json({
//           message: "error getting list of reservations",
//           error: err,
//         });
//       });
//   });


// All User Reservations
router.get("/my-reservations", isAuthenticated, attachCurrentUser, (req, res, next) => {
    Reservation.find({ userId: req.currentUser._id })
    .populate("venue")
    .then((allReservations) => {
        if (allReservations.length === 0) {
            res.status(200).json({message: "Tere are no Reservations"});
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
})

// Get reservation by id
router.get("/reservations/:reservationId", isAuthenticated, attachCurrentUser, (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Reservation.findById(reservationId)
    .populate("venues")
    .then((reservation) => res.status(200).json(reservation))
    .catch((err) => {
      console.log("error getting a reservation details...", err);
      res.status(500).json({
        message: "error getting a reservation details",
        error: err,
      });
    });
})

//Add comments to venue
router.post("/reservations/:reservationId", isAuthenticated, attachCurrentUser, (req, res, next) => {
    const { comment, numberOfLikes, reservationId } = req.body;

    Reservation.findByIdAndUpdate(reservationId, { $push: { comments: comment},
    likes: numberOfLikes,})
    .then((response) => res.json(response))
    .catch((err) => {
        console.log("error creating a new reservation...", err);
        res.status(500).json({
          message: "error creating a new reservation",
          error: err,
        });
    });
}) 

//Update reservation by id
router.put("/reservations/:reservationId", isAuthenticated, attachCurrentUser, (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Reservation.findById(req.params.reservationId)
    .then((reservationDetails) => {
        if ( 
            req.currentUser._id &&
            req.currentUser._id.equals(reservationDetails.userId)
        ) {
            Reservation.findByIdAndUpdate(reservationId, req.body, {new: true})
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
router.delete("/reservations/:reservationId", isAuthenticated, attachCurrentUser, (req, res, next) => {
    const { reservationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Reservation.findById(req.params.reservationId)
    .then((reservationDetails) => {
        if ( 
            req.currentUser._id &&
            req.currentUser._id.equals(reservationDetails.userId)
        ) {
            Reservation.findByIdAndRemove(reservationId)
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
