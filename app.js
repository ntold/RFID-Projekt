const serialport = require("serialport");


// Stores the RFID id as it reconstructs from the stream.
let id = '';
// List of all RFID ids read
let ids = [];

const myPort = new serialport('/dev/cu.usbmodem14201', {
    baudRate: 9600,
    parser: new serialport.parsers.Readline('\n')
});

myPort.on("open", function () {
    console.log('Serial Port Open');
    console.log('=================');
    let x = 0;
    myPort.on('data', function (chunk) {

        chunk = chunk.toString('ascii').match(/\w*/)[0]; // Only keep hex chars
        if (chunk.length == 0) { // Found non-hex char
            if (id.length > 0) { // The ID isn't blank
                ids.push(id); // Store the completely reconstructed ID
            }
            id = ''; // Prepare for the next ID read
            return;
        }
        id += chunk; // Concat hex chars to the forming ID

        console.log(id);

    });
});








