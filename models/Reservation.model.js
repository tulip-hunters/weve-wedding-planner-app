const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  weddingDate: {
    type: Date,
    get: (wedingDate) => wedingDate.toDateString(),
    unique: true,
  },
  guestsNumber: {
    type: Number,
    required: true,
  },

  user: { type: Schema.Types.ObjectId, ref: "User" },
  venue: { type: Schema.Types.ObjectId, ref: "Venue" },
});

module.exports = model("Reservation", reservationSchema);
