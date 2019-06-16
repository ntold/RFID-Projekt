const RFID = require('./models/RFID')

module.exports = (app) => {

    // Abfrage und Ausgaben aller RFID's in der Datenbank
    app.get("/getAll", (req, res, next) => {
        RFID.find((err, RFIDS) => {
            if (err) {
                // Falls ein Fehler auftritt, diesen 
                // an den Client schicken.
                res.status(500).json({
                    error: err
                })
            } else {
                // JSON-Objekt mit allen RFIDS
                // ausgeben
                res.status(200).json(RFIDS)
            }
        })
    })

    // Löscht einen bestimmten Datensatz mittels der ID
    app.post("/delete", (req, res) => {
        RFID.deleteOne({ _id: req.body._id }, (err, RFID) => {
            if (err) {
                // Falls ein Fehler auftritt, diesen 
                // an den Client schicken.
                res.status(500).json({
                    error: err
                })
            } else {
                // JSON-Objekt mit allen RFIDS
                // ausgeben
                res.status(200).json({
                    message: "RFID removed!"
                })
            }
        })
    })

    app.post("/update", (req, res) => {
        RFID.findByIdAndUpdate(req.body.Id, { Vorname: req.body.Vorname, Nachname: req.body.Nachname }, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            } else {
                res.status(200).json({
                    message: 'RFID Updated!'
                })
            }
        })
    })
}