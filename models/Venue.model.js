const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const venueSchema = new Schema ({
    name: {
        type: String,
        required: [true, "Name is required"]
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
    capaity: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    offers: {
        type: String,
        enum: ['dj', 'jazz band', 'folk group', 'photo box', 'kids entertainer', 'dancefloor', 'guestrooms', 'outdoor ceremeony', 'indoor ceremony', 'fireworks'],
    },
    reservation:[{
        type: Schema.Types.ObjectId,
        ref: "Reservation",
    }],
    owner: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }]
})

module.esports = model('Venue', venueSchema);