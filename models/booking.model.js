const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Booking = new Schema({
     id: {
        type: String
    },
    patientID: {
        type: String
    },
    doctorID: {
        type: String
    },
    time: {
        type: String
    },
    patientName: {
        type: String
    },
    doctorName: {
        type: String
    },
    date: {
        type: String
    },
    status: {
        type: String
    },
    slotID: {
        type: String
    },
});

Booking.plugin(mongoosePaginate);

module.exports = mongoose.model("Bookings", Booking);