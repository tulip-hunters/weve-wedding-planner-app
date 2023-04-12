const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    wedingDate: {
        type: Date,
        get: wedingDate => wedingDate.toDateString()
    },
      guestsNumber: {
        type: number,
        required: true,
      },   
    
    user: {type: Schema.Types.userId, ref: 'User'  },
    venue: { type: Schema.Types.venueId, ref: 'Venue' }
});

module.exports = model('Reservation', reservationSchema);