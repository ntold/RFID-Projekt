const RFID = require('./models/RFID')

module.exports = (app) => {

    app.get("/getAll", (req, res, next) => {
        RFID.find((err, RFIDS) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            }else{
                res.status(200).json(RFIDS)
            }
        })
    })
    
    app.post("/delete", (req, res) => {
        RFID.deleteOne({ _id: req.body._id }, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            }else{
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
            }else{
                res.status(200).json({
                    message: 'RFID Updated!'
                })
            }
        })
    })
}