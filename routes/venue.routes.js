const router = require("express").Router();
const mongoose = require("mongoose");

const Venue = require("../models/Venue.model");
const Reservation = require("../models/Reservation.model");

const attachCurrentUser = require("../middleware/attachCurrentUser");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//CREATE venue
router.post("/venues", isAuthenticated, (req, res, next) => {
  const { name, description, address, price, capacity, imageUrl, offers } =
    req.body;

  Venue.create({
    name,
    description,
    address,
    price,
    capacity,
    imageUrl,
    offers,
    reservations: [],
    user: req.payload._id,
  })
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("error creating a new venue", err);
      res.status(500).json({
        message: "error creating a new venue",
        error: err,
      });
    });
});

//DISPLAY ALL venues
router.get("/venues", (req, res, next) => {
  Venue.find()
    .populate("reservations")
    .then((venuesFromDB) => {
      res.json(venuesFromDB);
    })
    .catch((err) => {
      console.log("error getting list of venues", err);
      res.status(500).json({
        message: "error getting list of venues",
        error: err,
      });
    });
});

//DISPLAY DETAILS venue
router.get("/venues/:venueId", (req, res, next) => {
  const { venueId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Venue.findById(venueId)
    .populate("reservations")
    .then((venue) => res.json(venue))
    .catch((err) => {
      console.log("error getting details of a venue", err);
      res.status(500).json({
        message: "error getting details of a venue",
        error: err,
      });
    });
});

//Add comments to venue
// router.post("/venues/:venueId", isAuthenticated, (req, res, next) => {
//     const { comment, numberOfLikes, venueId } = req.body;

//     Venue.findByIdAndUpdate(venueId, { $push: { comments: comment },
//     likes: numberOfLikes})
//     .then((response) => res.json(response))
//     .catch((err) => {
//         console.log("error creating a new comment...", err);
//         res.status(500).json({
//           message: "error creating a new comment",
//           error: err,
//         });
//     });
// })

////UPDATE venue
router.put(
  "/venues/:venueId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { venueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Venue.findById(req.params.venueId)
      .then((venueDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(venueDetails.user)
        ) {
          Venue.findByIdAndUpdate(venueId, req.body, { new: true })
            .then((updatedVenue) => {
              res.json(updatedVenue);
            })
            .catch((err) => {
              console.log("error updating a venue...", err);
              res.status(500).json({
                message: "error updating a venue",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can updated only thier own data.Please Check the data you are updating!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error getting venue details from DB", err);
        next();
      });
  }
);

//DELETE venue
router.delete(
  "/venues/:venueId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { venueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(venueId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Venue.findById(req.params.venueId)
      .then((venueDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(venueDetails.user)
        ) {
          Venue.findByIdAndRemove(venueId)
            .then(() =>
              res.json({
                message: `Venue with ${venueId} is removed successfully.`,
              })
            )
            .catch((err) => {
              console.log("error deleting a venue...", err);
              res.status(500).json({
                message: "error deleting a venue",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can delete only thier own data.Please Check the data you are deleting!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error deleting venue details from DB", err);
        next();
      });
  }
);

module.exports = router;
