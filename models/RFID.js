const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RFIDSchema = new Schema({
    RFID: {
        type: String,
        required: true,
    },
    Nachname: String,
    Vorname: String,
    lastSignIn: String,
    createdDate: String,
});

module.exports = mongoose.model('RFID', RFIDSchema);