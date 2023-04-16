const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please type your names"]
  },
  weddingDate: {
    type: Date,
    get: (wedingDate) => wedingDate.toDateString(),
    unique: [true, "Please select another date. We are booked for this date already."]
  },
  guestsNumber: {
    type: Number,
    required: [true, "Please check venue capacity."]
  },

  user: { type: Schema.Types.ObjectId, ref: "User" },
  venue: { type: Schema.Types.ObjectId, ref: "Venue" },
});

module.exports = model("Reservation", reservationSchema);
