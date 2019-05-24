const RFID = require('./models/RFID')

module.exports = (app) => {

    app.get("/getAll", (req, res, next) => {
        RFID.find((err, RFIDS) => {
            if (!err) {
                RFIDS.map(RFID => {
                    let date = new Date(RFID.createdDate)
                    RFID.createdDate = date.toDateString()
                })
                res.status(200).json(RFIDS)
            }
        })
    })
    
    app.get("/getOne/:id", (req, res) => {
        RFID.find({ RFID: req.params.id }, (err, RFID) => {
            if (!err) {
                res.status(200).json(RFID)
            }
        })
    })
    
    app.post("/delete", (req, res) => {
        RFID.findOneAndDelete(req.body.id, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                message: "RFID removed"
            })
        })
    })
    
    app.post("/update", (req, res) => {
        
        RFID.findOneAndUpdate(req.body.Id, { Vorname: req.body.Vorname, Nachname: req.body.Nachname }, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }else{
                res.status(200).json({
                    message: RFID
                })
            }
        })
    })
}