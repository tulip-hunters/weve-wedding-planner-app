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
    
    owner: [{type: Schema.Types.OjectId, ref: 'User'  }],
    venue: [{ type: Schema.Types.ObjectId, ref: 'Venue' }]
});

module.exports = model('Reservation', reservationSchema);