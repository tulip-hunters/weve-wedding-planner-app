const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const venueSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  //   defaultImageUrl =
  // "https://images.pexels.com/photos/12846017/pexels-photo-12846017.jpeg";
  },
  offers: {
    type: [String],
    enum: [
      "dj " ,
      "jazz band " ,
      "folk group " ,
      "photo box " ,
      "kids entertainer " ,
      "dancefloor " ,
      "guestrooms " ,
      "outdoor ceremeony " ,
      "indoor ceremony " ,
      "fireworks "
    ],
  },
  comments: [String],
  likes: { type: Number, default: 0 },
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
