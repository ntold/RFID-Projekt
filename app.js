const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/config')

const RFID = require('./models/RFID')

// Importieren der SerialPort Dependency
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
// Konfigurieren der seriellen Schnittstelle. In diesem Fall ist es
// die Schnittstelle "COM4"
const port = new SerialPort('COM4')
// Parser erstellen, welcher dann die vom Arduino geschickten Daten
// richtig Formatiert und ausgibt
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

// Importieren der Socket.IO Dependency 
// Konfiguriert auf Port 4000
const io = require('socket.io')(4000)

const app = express()

app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

// Verbinden der Datenbank auf dem lokalen Gerät
mongoose.connect(config.db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log('Connection was successful'))
    .catch(err => console.error("An error has eccourd:", err))

// Die Funktion wird bei jeder Berührung des RFID-Scanners
// ausgeführt. 
parser.on('data', (data) => {
    // Hier wird erstmals nach der soeben erhaltenen RFID
    // gesucht, um redundante Daten zu vermeiden
    RFID.find({ RFID: data })
        .then(rfid => {
            // Falls das erhaltene Objekt grösser ist als 1,
            // so ist die RFID schon in der Datenbank vorhanden
            if (rfid.length >= 1) {
                // Sendet eine Antwort an das Frontend, dass die
                // RFID schon vorhanden ist. 
                io.emit('alreadyTaken', rfid)
            } else {
                // Erstellt ein Objekt mit der soeben erhaltenen 
                // RFID
                const rfid = new RFID({
                    RFID: data,
                    createdDate: new Date().toDateString()
                })
                // Speichert das Objekt in der Datenbank
                rfid.save().then(result => {
                    // Sendet das erstellte Object an das Frontend
                    io.emit("create", result)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
})

app.listen(config.port, () => console.log(`Server started on port ${config.port}`))

