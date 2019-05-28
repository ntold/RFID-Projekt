const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/config')

const RFID = require('./models/RFID')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('COM4')

const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
const io = require('socket.io')(4000)

const app = express()

app.use(bodyParser.json())
app.use(cors())

require('./routes')(app, io)

//MongoDB connection
mongoose.connect(config.db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('Connection was successful'))
    .catch(err => console.error("An error has eccourd:", err))


parser.on('data', (data) => {
    RFID.find({ RFID: data })
        .exec()
        .then(rfid => {
            if (rfid.length >= 1) {
                let err = "RFID Schon Vorhanden!"
                io.emit('alreadyTaken', rfid)
                console.log("RFID schon vorhanden!")
            } else {
                const rfid = new RFID({
                    RFID: data,
                    createdDate: new Date().toDateString()
                })
                rfid.save().then(result => {
                    //emit new rfid to frontend
                    io.emit("create", result)
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
})

app.listen(config.port, () => console.log(`Server started on port ${config.port}`))

