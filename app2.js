// Import express
const express = require('express')
// Import cors
const cors = require('cors')
// Import bodyparser
const bodyParser = require('body-parser')

// Creates an instance of express
const app = express()
// Provides req.body functionality with json
app.use(bodyParser.json())
// Crossplatform requests
app.use(cors())



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

const io = require('socket.io')(4000);

parser.on('data', (data) => {
    RFID.find({ RFID: data })
        .exec()
        .then(rfid => {
            if (rfid.length >= 1) {
                let err = "RFID Schon Vorhanden!"
                io.emit('test', err)
                console.log("RFID schon vorhanden!")
            } else {
                const rfid = new RFID({
                    RFID: data,
                    createdDate: new Date()
                })
                rfid.save().then(result => {
                    let status = "RFID hinzugefügt"
                    io.emit('test', status)
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
});


app.get("/getAll", (req, res, next) => {
    RFID.find((err, RFIDS) => {
        if (err) {
            next()
        } else {
            res.status(200).json(RFIDS)
        }
    })
})

app.get("/RFID/:id", (req, res, next) => {
    RFID.find({ RFID: req.params.id }, (err, RFID) => {
        if (err) {
            next()
        } else {
            res.status(200).json(RFID)
        }
    })
})

app.get("/:id", (req, res, next) => {
    RFID.findOneAndDelete(req.params.id, (err, RFID) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        res.status(200).json({
            message: "RFID removed"
        });
    })
})

app.post("/update/:id", (req, res, next) => {
    RFID.findOneAndUpdate(req.params.id, { Vorname: req.body.Vorname, Name: req.body.Name }, (err, RFID) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        };
        // If no error occured, it sends a message. Status Code 200 means "OK"
        res.status(200).json({
            message: "RFID Updated"
        });
    })
})

// App listens on every action taken on port 8081
app.listen(1337)

