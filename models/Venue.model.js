const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const venueSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
  },
  imageUrl: {
    type: String,
  },
  offers: {
    type: [String],
    enum: [
      "dj",
      "jazz band",
      "photo box",
      "kids entertainer",
      "dancefloor",
      "guestrooms",
      "outdoor ceremeony",
      "indoor ceremony",
      "fireworks",
      "other"
    ],
  },
  reservations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Venue", venueSchema);
