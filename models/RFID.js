const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDSchema = new Schema({
    RFID: {
        type: String,
        required: true,
    },
    Name: {
        type: String
    },
    Vorname: {
        type: String
    },
    lastSignIn: String,
    createdDate: String,
});

module.exports = mongoose.model('RFID', RFIDSchema);