// Import mongoose
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/RFIDProject', { useNewUrlParser: true })
    // If the connection was succsessfully created, log this
    .then(() => console.log('Connection was successful'))
    // If not, log that
    .catch(err => console.error("An error has eccourd:", err));

//

const RFID = require('./models/RFID')

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/cu.usbmodem14201')

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

parser.on('data', (data) => {

    RFID.find({ RFID: data })
        .exec()
        .then(rfid => {
            if (rfid.length >= 1) {
                console.log("RFID schon vorhanden!")
            } else {
                const rfid = new RFID({
                    RFID: data,
                    createdDate: new Date()
                })
                rfid.save().then(result => {
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
})