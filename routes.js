const RFID = require('./models/RFID')

module.exports = (app, io) => {

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
        console.log(req.body._id);
        
        RFID.deleteOne({ _id: req.body._id }, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                })
            }
            io.emit("update", RFID)
            res.status(200).json({
                message: "RFID removed"
            })
        })
    })
    
    app.post("/update", (req, res) => {
        
        console.log(req.body);
        
        RFID.findByIdAndUpdate(req.body.Id, { Vorname: req.body.Vorname, Nachname: req.body.Nachname }, (err, RFID) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }else{
                //TODO
                io.emit("update", RFID)
                
                console.log(RFID)
                
                res.status(200).json({
                    message: RFID
                })
            }
        })
    })
}